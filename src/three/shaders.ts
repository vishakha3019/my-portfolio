// 3D simplex noise: Ashima Arts / Stefan Gustavson (MIT).
const noise = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+10.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.5-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 105.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
float fbm(vec3 p){
  float f=0.0; float a=0.5;
  for(int i=0;i<4;i++){ f+=a*snoise(p); p*=2.03; a*=0.5; }
  return f;
}
`

// The name texture is sampled by both the backdrop and the glass, so they must agree on where it sits.
const textUV = /* glsl */ `
uniform float uLift;
vec2 textUV(vec2 uv){
  float lift = uLift;
  uv.y -= lift * 0.22;
  uv.x = (uv.x - 0.5) / (1.0 + lift * 0.3) + 0.5;
  return uv;
}
`

// Surface shape shared by the glass and the particles, so particles leave exactly from the skin.
const surface = /* glsl */ `
uniform float uTime;
uniform float uAmp;
uniform float uFreq;
uniform float uPulse;
uniform vec3 uPointerDir;
uniform float uPointerStrength;
// two soft octaves: reads as liquid, not crumpled foil
float flowNoise(vec3 p){
  return snoise(p) * 0.72 + snoise(p * 1.85 + 4.1) * 0.28;
}
vec3 shape(vec3 p){
  vec3 n = normalize(p);
  float d = flowNoise(n * uFreq + vec3(0.0, uTime * 0.11, uTime * 0.07)) * uAmp;
  float pull = smoothstep(0.55, 1.0, dot(n, uPointerDir));
  d += pull * pull * uPointerStrength;
  d += uPulse * 0.16 * sin(dot(n, vec3(3.1, 4.7, 2.3)) * 3.0 - uTime * 9.0);
  return n * (1.0 + d);
}
`

export const backdropVertex = /* glsl */ `
varying vec2 vUv;
void main(){
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`

export const backdropFragment = /* glsl */ `
${noise}
${textUV}
uniform sampler2D uText;
uniform vec2 uRes;
uniform float uTime;
uniform float uReveal;
uniform float uTextFade;
uniform vec2 uPointer;
uniform float uPointerVel;
uniform vec2 uGlow;
uniform vec3 uTint;
uniform float uGlowAmt;
varying vec2 vUv;

void main(){
  vec2 uv = vUv;
  vec2 aspect = vec2(uRes.x / uRes.y, 1.0);

  // liquid warp around the pointer, stronger when the pointer moves fast
  vec2 d = (uv - uPointer) * aspect;
  float fall = exp(-dot(d, d) * 14.0);
  vec2 warp = vec2(snoise(vec3(uv * 5.0, uTime * 0.5)), snoise(vec3(uv * 5.0 + 7.3, uTime * 0.5)));
  float amt = fall * (0.004 + uPointerVel * 0.02);
  uv += warp * amt;

  vec2 tuv = textUV(uv);
  float ca = amt * 0.35;
  vec3 ink = vec3(
    texture2D(uText, tuv + vec2(ca, 0.0)).a,
    texture2D(uText, tuv).a,
    texture2D(uText, tuv - vec2(ca, 0.0)).a
  );

  // organic dissolve-in for the name
  float n = fbm(vec3(vUv * vec2(3.0, 2.0), 1.7)) * 0.5 + 0.5;
  float reveal = smoothstep(n - 0.06, n + 0.02, uReveal * 1.2 - 0.1);

  vec3 voidCol = vec3(0.027, 0.027, 0.031);
  vec2 g = (vUv - uGlow) * aspect;
  float glow = exp(-dot(g, g) * 2.2);
  vec3 col = voidCol + uTint * 0.6 * glow * uGlowAmt;
  col += vec3(0.93, 0.91, 0.87) * ink * reveal * (1.0 - uTextFade);

  float vig = smoothstep(1.25, 0.35, length((vUv - 0.5) * aspect));
  col *= mix(0.55, 1.0, vig);

  float grain = fract(sin(dot(gl_FragCoord.xy + uTime * 61.0, vec2(12.9898, 78.233))) * 43758.5453);
  col += (grain - 0.5) * 0.035;
  gl_FragColor = vec4(col, 1.0);
}
`

export const glassVertex = /* glsl */ `
${noise}
${surface}
varying vec3 vNormalV;
varying vec3 vViewPos;
varying vec3 vObj;

void main(){
  vec3 n = normalize(position);
  vec3 t = normalize(cross(n, abs(n.y) > 0.99 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 1.0, 0.0)));
  vec3 b = cross(n, t);
  float e = 0.012;
  vec3 p  = shape(n);
  vec3 pt = shape(n + t * e);
  vec3 pb = shape(n + b * e);
  vec3 normal = normalize(cross(pt - p, pb - p));
  if (dot(normal, n) < 0.0) normal = -normal;

  vObj = p;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vViewPos = mv.xyz;
  vNormalV = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * mv;
}
`

export const glassFragment = /* glsl */ `
${noise}
${textUV}
uniform sampler2D uText;
uniform vec2 uRes;
uniform float uTime;
uniform float uDissolve;
uniform float uTextFade;
uniform float uReveal;
varying vec3 vNormalV;
varying vec3 vViewPos;
varying vec3 vObj;

void main(){
  // dissolve: noise threshold eats the surface, a hot ion edge rides the boundary
  float n = snoise(vObj * 2.3) * 0.5 + 0.5;
  float th = uDissolve * 1.15;
  if (n < th) discard;
  float edge = (1.0 - smoothstep(0.0, 0.07, n - th)) * step(0.001, uDissolve);

  vec3 N = normalize(vNormalV);
  vec3 V = normalize(-vViewPos);
  float ndv = max(dot(N, V), 0.0);
  float fres = pow(1.0 - ndv, 3.0);

  // fake refraction of the name behind, split per channel for dispersion
  vec2 suv = gl_FragCoord.xy / uRes;
  vec2 off = N.xy * (0.035 + 0.05 * fres);
  vec3 refr = vec3(
    texture2D(uText, textUV(suv - off * 0.85)).a,
    texture2D(uText, textUV(suv - off * 1.0)).a,
    texture2D(uText, textUV(suv - off * 1.2)).a
  ) * uReveal * (1.0 - uTextFade * 0.8);

  vec3 ion = vec3(0.545, 0.592, 1.0);
  vec3 ivory = vec3(0.93, 0.91, 0.87);
  vec3 col = vec3(0.03, 0.032, 0.045) + vec3(0.04, 0.045, 0.08) * (N.y * 0.5 + 0.5);
  col += refr * ivory * 0.92;

  // thin-film iridescence on the rim
  vec3 film = 0.5 + 0.5 * cos(6.2831 * (fres * 0.85 + vec3(0.0, 0.14, 0.28)) + uTime * 0.15);
  col += mix(ion, film, 0.4) * fres * 0.85;

  vec3 L1 = normalize(vec3(0.55, 0.8, 0.6));
  col += ivory * pow(max(dot(N, normalize(L1 + V)), 0.0), 90.0) * 1.1;
  vec3 L2 = normalize(vec3(-0.8, -0.35, 0.45));
  col += ion * pow(max(dot(N, normalize(L2 + V)), 0.0), 24.0) * 0.4;

  col += ion * edge * 2.4;
  gl_FragColor = vec4(col, 1.0);
}
`


// Particles: the same points take six formations. Two neighbouring formations are blended,
// and a noise billow swells mid-transition so every change of scene reads as fluid.
export const particleVertex = /* glsl */ `
${noise}
${surface}
attribute float aRand;
attribute vec3 aSeed;
uniform float uForm;
uniform float uSize;
uniform vec3 uClusters[4];
uniform vec4 uFocusW;
varying float vRand;
varying float vGlow;

vec3 ring(vec3 n){
  float r = 1.7 + aRand * 1.3 + snoise(n * 1.3 + uTime * 0.05) * 0.25;
  float a = aSeed.x * 6.2831 + uTime * 0.12 / r;
  return vec3(cos(a) * r, (aSeed.y - 0.5) * 0.14 * r, sin(a) * r);
}
vec3 ribbon(){
  float x = (aSeed.x - 0.5) * 12.0;
  float w = aSeed.y - 0.5;
  float y = sin(x * 0.55 + uTime * 0.35) * 0.5 + w * (0.2 + aRand * 0.55);
  float z = cos(x * 0.4 + uTime * 0.25) * 0.8 + (aRand - 0.5) * 0.5;
  return vec3(x, y - 0.35, z - 0.6);
}
vec3 landscape(){
  float x = (aSeed.x - 0.5) * 13.0;
  float z = (aSeed.y - 0.5) * 7.0;
  float h = snoise(vec3(x * 0.25, z * 0.25, uTime * 0.12)) * 0.45 + snoise(vec3(x * 0.7, z * 0.7, uTime * 0.2)) * 0.1;
  return vec3(x, -1.35 + h, z - 1.6);
}
vec3 clusters(vec3 n){
  float k = floor(aSeed.z * 3.999);
  vec3 c = k < 0.5 ? uClusters[0] : k < 1.5 ? uClusters[1] : k < 2.5 ? uClusters[2] : uClusters[3];
  float fw = k < 0.5 ? uFocusW.x : k < 1.5 ? uFocusW.y : k < 2.5 ? uFocusW.z : uFocusW.w;
  if (aRand > 0.9) {
    // bridge particles stream to the neighbouring domain: everything is connected
    vec3 c2 = k < 0.5 ? uClusters[1] : k < 1.5 ? uClusters[2] : k < 2.5 ? uClusters[3] : uClusters[2];
    return mix(c, c2, fract(aSeed.y + uTime * 0.1)) + n * 0.03;
  }
  float a = uTime * (0.25 + aRand * 0.35);
  vec3 q = n * (0.34 + 0.2 * aRand) * (1.0 + fw * 0.22);
  q.xz = mat2(cos(a), -sin(a), sin(a), cos(a)) * q.xz;
  return c + q;
}
vec3 formation(float id, vec3 n){
  if (id < 0.5) return shape(n);
  if (id < 1.5) return ring(n);
  if (id < 2.5) return ribbon();
  if (id < 3.5) return landscape();
  if (id < 4.5) return clusters(n);
  return shape(n);
}

void main(){
  vec3 n = normalize(position);
  float f = floor(uForm);
  float t = smoothstep(0.0, 1.0, uForm - f);
  vec3 p = mix(formation(f, n), formation(f + 1.0, n), t);
  vec3 flow = vec3(
    snoise(n * 1.4 + vec3(0.0, 0.0, uTime * 0.06)),
    snoise(n * 1.4 + vec3(13.1, 0.0, uTime * 0.06)),
    snoise(n * 1.4 + vec3(0.0, 27.3, uTime * 0.06))
  );
  p += flow * sin(t * 3.14159) * 0.9;

  float k = floor(aSeed.z * 3.999);
  float fw = k < 0.5 ? uFocusW.x : k < 1.5 ? uFocusW.y : k < 2.5 ? uFocusW.z : uFocusW.w;
  vGlow = fw * (1.0 - smoothstep(0.0, 0.6, abs(uForm - 4.0)));

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * (0.5 + aRand) * (1.0 + vGlow * 0.6) / -mv.z;
  vRand = aRand;
}
`

export const particleFragment = /* glsl */ `
uniform float uOpacity;
uniform vec3 uTint;
varying float vRand;
varying float vGlow;
void main(){
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.0, d);
  vec3 col = mix(vec3(0.93, 0.91, 0.87), uTint, step(0.7, vRand));
  col += uTint * vGlow * 0.6;
  gl_FragColor = vec4(col, a * uOpacity * (0.75 + vGlow));
}
`
