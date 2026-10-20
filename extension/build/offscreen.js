var U0 = Object.defineProperty;
var Gr = /* @__PURE__ */ ((e) => typeof require < "u" ? require : typeof Proxy < "u" ? new Proxy(e, {
  get: (t, r) => (typeof require < "u" ? require : t)[r]
}) : e)(function(e) {
  if (typeof require < "u") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + e + '" is not supported');
});
var j0 = (e, t) => {
  for (var r in t)
    U0(e, r, { get: t[r], enumerable: !0 });
};

// node_modules/onnxruntime-web/dist/ort.webgpu.bundle.min.mjs
var pi = {};
j0(pi, {
  InferenceSession: () => ei,
  TRACE: () => Hs,
  TRACE_EVENT_BEGIN: () => xr,
  TRACE_EVENT_END: () => kr,
  TRACE_FUNC_BEGIN: () => Hr,
  TRACE_FUNC_END: () => Qr,
  Tensor: () => Ot,
  default: () => vM,
  env: () => ze,
  registerBackend: () => qr
});
var Jo = Object.defineProperty, W0 = Object.getOwnPropertyDescriptor, q0 = Object.getOwnPropertyNames, H0 = Object.prototype.hasOwnProperty, Q0 = ((e) => typeof Gr < "u" ? Gr : typeof Proxy < "u" ? new Proxy(e, { get: (t, r) => (typeof Gr < "u" ? Gr : t)[r] }) : e)(function(e) {
  if (typeof Gr < "u") return Gr.apply(this, arguments);
  throw Error('Dynamic require of "' + e + '" is not supported');
}), we = (e, t, r) => () => {
  if (r) throw r[0];
  try {
    return e && (t = e(e = 0)), t;
  } catch (n) {
    throw r = [n], n;
  }
}, ns = (e, t) => {
  for (var r in t) Jo(e, r, { get: t[r], enumerable: !0 });
}, X0 = (e, t, r, n) => {
  if (t && typeof t == "object" || typeof t == "function") for (let s of q0(t)) !H0.call(e, s) && s !== r && Jo(e, s, { get: () => t[s], enumerable: !(n = W0(t, s)) || n.enumerable });
  return e;
}, qs = (e) => X0(Jo({}, "__esModule", { value: !0 }), e), Yn, yr, qr, Qh, xf, kf = we(() => {
  "use strict";
  Yn = /* @__PURE__ */ new Map(), yr = [], qr = (e, t, r) => {
    if (t && typeof t.init == "function" && typeof t.createInferenceSessionHandler == "function") {
      let n = Yn.get(e);
      if (n === void 0) Yn.set(e, { backend: t, priority: r });
      else {
        if (n.priority > r) return;
        if (n.priority === r && n.backend !== t) throw new Error(`cannot register backend "${e}" using priority ${r}`);
      }
      if (r >= 0) {
        let s = yr.indexOf(e);
        s !== -1 && yr.splice(s, 1);
        for (let a = 0; a < yr.length; a++) if (Yn.get(yr[a]).priority <= r) {
          yr.splice(a, 0, e);
          return;
        }
        yr.push(e);
      }
      return;
    }
    throw new TypeError("not a valid backend");
  }, Qh = async (e) => {
    let t = Yn.get(e);
    if (!t) return "backend not found.";
    if (t.initialized) return t.backend;
    if (t.aborted) return t.error;
    {
      let r = !!t.initPromise;
      try {
        return r || (t.initPromise = t.backend.init(e)), await t.initPromise, t.initialized = !0, t.backend;
      } catch (n) {
        return r || (t.error = `${n}`, t.aborted = !0), t.error;
      } finally {
        delete t.initPromise;
      }
    }
  }, xf = async (e) => {
    let t = e.executionProviders || [], r = t.map((l) => typeof l == "string" ? l : l.name), n = r.length === 0 ? yr : r, s, a = [], o = /* @__PURE__ */ new Set();
    for (let l of n) {
      let c = await Qh(l);
      typeof c == "string" ? a.push({ name: l, err: c }) : (s || (s = c), s === c && o.add(l));
    }
    if (!s) throw new Error(`no available backend found. ERR: ${a.map((l) => `[${l.name}] ${l.err}`).join(", ")}`);
    for (let { name: l, err: c } of a) r.includes(l) && console.warn(`removing requested execution provider "${l}" from session options because it is not available: ${c}`);
    let i = t.filter((l) => o.has(typeof l == "string" ? l : l.name));
    return [s, new Proxy(e, { get: (l, c) => c === "executionProviders" ? i : Reflect.get(l, c) })];
  };
}), Y0 = we(() => {
  "use strict";
  kf();
}), Tf, K0 = we(() => {
  "use strict";
  Tf = "1.31.0-dev.20260911-2a43ec07e";
}), Ao, Ze, Ef = we(() => {
  "use strict";
  K0(), Ao = "warning", Ze = { wasm: {}, webgl: {}, webgpu: {}, versions: { common: Tf }, set logLevel(e) {
    if (e !== void 0) {
      if (typeof e != "string" || ["verbose", "info", "warning", "error", "fatal"].indexOf(e) === -1) throw new Error(`Unsupported logging level: ${e}`);
      Ao = e;
    }
  }, get logLevel() {
    return Ao;
  } }, Object.defineProperty(Ze, "logLevel", { enumerable: !0 });
}), ze, J0 = we(() => {
  "use strict";
  Ef(), ze = Ze;
}), Af, Cf, Z0 = we(() => {
  "use strict";
  Af = (e, t) => {
    let r = typeof document < "u" ? document.createElement("canvas") : new OffscreenCanvas(1, 1);
    r.width = e.dims[3], r.height = e.dims[2];
    let n = r.getContext("2d");
    if (n != null) {
      let s, a;
      t?.tensorLayout !== void 0 && t.tensorLayout === "NHWC" ? (s = e.dims[2], a = e.dims[3]) : (s = e.dims[3], a = e.dims[2]);
      let o = t?.format !== void 0 ? t.format : "RGB", i = t?.norm, l, c;
      i === void 0 || i.mean === void 0 ? l = [255, 255, 255, 255] : typeof i.mean == "number" ? l = [i.mean, i.mean, i.mean, i.mean] : (l = [i.mean[0], i.mean[1], i.mean[2], 0], i.mean[3] !== void 0 && (l[3] = i.mean[3])), i === void 0 || i.bias === void 0 ? c = [0, 0, 0, 0] : typeof i.bias == "number" ? c = [i.bias, i.bias, i.bias, i.bias] : (c = [i.bias[0], i.bias[1], i.bias[2], 0], i.bias[3] !== void 0 && (c[3] = i.bias[3]));
      let d = a * s, h = 0, _ = d, p = d * 2, w = -1;
      o === "RGBA" ? (h = 0, _ = d, p = d * 2, w = d * 3) : o === "RGB" ? (h = 0, _ = d, p = d * 2) : o === "RBG" && (h = 0, p = d, _ = d * 2);
      for (let v = 0; v < a; v++) for (let y = 0; y < s; y++) {
        let b = (e.data[h++] - c[0]) * l[0], k = (e.data[_++] - c[1]) * l[1], A = (e.data[p++] - c[2]) * l[2], E = w === -1 ? 255 : (e.data[w++] - c[3]) * l[3];
        n.fillStyle = "rgba(" + b + "," + k + "," + A + "," + E + ")", n.fillRect(y, v, 1, 1);
      }
      if ("toDataURL" in r) return r.toDataURL();
      throw new Error("toDataURL is not supported");
    } else throw new Error("Can not access image data");
  }, Cf = (e, t) => {
    let r = typeof document < "u" ? document.createElement("canvas").getContext("2d") : new OffscreenCanvas(1, 1).getContext("2d"), n;
    if (r != null) {
      let s, a, o;
      t?.tensorLayout !== void 0 && t.tensorLayout === "NHWC" ? (s = e.dims[2], a = e.dims[1], o = e.dims[3]) : (s = e.dims[3], a = e.dims[2], o = e.dims[1]);
      let i = t !== void 0 && t.format !== void 0 ? t.format : "RGB", l = t?.norm, c, d;
      l === void 0 || l.mean === void 0 ? c = [255, 255, 255, 255] : typeof l.mean == "number" ? c = [l.mean, l.mean, l.mean, l.mean] : (c = [l.mean[0], l.mean[1], l.mean[2], 255], l.mean[3] !== void 0 && (c[3] = l.mean[3])), l === void 0 || l.bias === void 0 ? d = [0, 0, 0, 0] : typeof l.bias == "number" ? d = [l.bias, l.bias, l.bias, l.bias] : (d = [l.bias[0], l.bias[1], l.bias[2], 0], l.bias[3] !== void 0 && (d[3] = l.bias[3]));
      let h = a * s;
      if (t !== void 0 && (t.format !== void 0 && o === 4 && t.format !== "RGBA" || o === 3 && t.format !== "RGB" && t.format !== "BGR")) throw new Error("Tensor format doesn't match input tensor dims");
      let _ = 4, p = 0, w = 1, v = 2, y = 3, b = 0, k = h, A = h * 2, E = -1;
      i === "RGBA" ? (b = 0, k = h, A = h * 2, E = h * 3) : i === "RGB" ? (b = 0, k = h, A = h * 2) : i === "RBG" && (b = 0, A = h, k = h * 2), n = r.createImageData(s, a);
      for (let C = 0; C < a * s; p += _, w += _, v += _, y += _, C++) n.data[p] = (e.data[b++] - d[0]) * c[0], n.data[w] = (e.data[k++] - d[1]) * c[1], n.data[v] = (e.data[A++] - d[2]) * c[2], n.data[y] = E === -1 ? 255 : (e.data[E++] - d[3]) * c[3];
    } else throw new Error("Can not access image data");
    return n;
  };
}), $s, Sf, Pf, Ff, If, Lf, eM = we(() => {
  "use strict";
  Zo(), $s = (e, t) => {
    if (e === void 0) throw new Error("Image buffer must be defined");
    if (t.height === void 0 || t.width === void 0) throw new Error("Image height and width must be defined");
    if (t.tensorLayout === "NHWC") throw new Error("NHWC Tensor layout is not supported yet");
    let { height: r, width: n } = t, s = t.norm ?? { mean: 255, bias: 0 }, a, o;
    typeof s.mean == "number" ? a = [s.mean, s.mean, s.mean, s.mean] : a = [s.mean[0], s.mean[1], s.mean[2], s.mean[3] ?? 255], typeof s.bias == "number" ? o = [s.bias, s.bias, s.bias, s.bias] : o = [s.bias[0], s.bias[1], s.bias[2], s.bias[3] ?? 0];
    let i = t.format !== void 0 ? t.format : "RGBA", l = t.tensorFormat !== void 0 && t.tensorFormat !== void 0 ? t.tensorFormat : "RGB", c = r * n, d = l === "RGBA" ? new Float32Array(c * 4) : new Float32Array(c * 3), h = 4, _ = 0, p = 1, w = 2, v = 3, y = 0, b = c, k = c * 2, A = -1;
    i === "RGB" && (h = 3, _ = 0, p = 1, w = 2, v = -1), l === "RGBA" ? A = c * 3 : l === "RBG" ? (y = 0, k = c, b = c * 2) : l === "BGR" && (k = 0, b = c, y = c * 2);
    for (let E = 0; E < c; E++, _ += h, w += h, p += h, v += h) d[y++] = (e[_] + o[0]) / a[0], d[b++] = (e[p] + o[1]) / a[1], d[k++] = (e[w] + o[2]) / a[2], A !== -1 && v !== -1 && (d[A++] = (e[v] + o[3]) / a[3]);
    return l === "RGBA" ? new bt("float32", d, [1, 4, r, n]) : new bt("float32", d, [1, 3, r, n]);
  }, Sf = async (e, t) => {
    let r = typeof HTMLImageElement < "u" && e instanceof HTMLImageElement, n = typeof ImageData < "u" && e instanceof ImageData, s = typeof ImageBitmap < "u" && e instanceof ImageBitmap, a = typeof e == "string", o, i = t ?? {}, l = () => {
      if (typeof document < "u") return document.createElement("canvas");
      if (typeof OffscreenCanvas < "u") return new OffscreenCanvas(1, 1);
      throw new Error("Canvas is not supported");
    }, c = (d) => typeof HTMLCanvasElement < "u" && d instanceof HTMLCanvasElement || d instanceof OffscreenCanvas ? d.getContext("2d") : null;
    if (r) {
      let d = l();
      d.width = e.width, d.height = e.height;
      let h = c(d);
      if (h != null) {
        let _ = e.height, p = e.width;
        if (t !== void 0 && t.resizedHeight !== void 0 && t.resizedWidth !== void 0 && (_ = t.resizedHeight, p = t.resizedWidth), t !== void 0) {
          if (i = t, t.tensorFormat !== void 0) throw new Error("Image input config format must be RGBA for HTMLImageElement");
          i.tensorFormat = "RGBA", i.height = _, i.width = p;
        } else i.tensorFormat = "RGBA", i.height = _, i.width = p;
        h.drawImage(e, 0, 0), o = h.getImageData(0, 0, p, _).data;
      } else throw new Error("Can not access image data");
    } else if (n) {
      let d, h;
      if (t !== void 0 && t.resizedWidth !== void 0 && t.resizedHeight !== void 0 ? (d = t.resizedHeight, h = t.resizedWidth) : (d = e.height, h = e.width), t !== void 0 && (i = t), i.format = "RGBA", i.height = d, i.width = h, t !== void 0) {
        let _ = l();
        _.width = h, _.height = d;
        let p = c(_);
        if (p != null) p.putImageData(e, 0, 0), o = p.getImageData(0, 0, h, d).data;
        else throw new Error("Can not access image data");
      } else o = e.data;
    } else if (s) {
      if (t === void 0) throw new Error("Please provide image config with format for Imagebitmap");
      let d = l();
      d.width = e.width, d.height = e.height;
      let h = c(d);
      if (h != null) {
        let _ = e.height, p = e.width;
        return h.drawImage(e, 0, 0, p, _), o = h.getImageData(0, 0, p, _).data, i.height = _, i.width = p, $s(o, i);
      } else throw new Error("Can not access image data");
    } else {
      if (a) return new Promise((d, h) => {
        let _ = l(), p = c(_);
        if (!e || !p) return h();
        let w = new Image();
        w.crossOrigin = "Anonymous", w.src = e, w.onload = () => {
          _.width = w.width, _.height = w.height, p.drawImage(w, 0, 0, _.width, _.height);
          let v = p.getImageData(0, 0, _.width, _.height);
          i.height = _.height, i.width = _.width, d($s(v.data, i));
        };
      });
      throw new Error("Input data provided is not supported - aborted tensor creation");
    }
    if (o !== void 0) return $s(o, i);
    throw new Error("Input data provided is not supported - aborted tensor creation");
  }, Pf = (e, t) => {
    let { width: r, height: n, download: s, dispose: a } = t, o = [1, n, r, 4];
    return new bt({ location: "texture", type: "float32", texture: e, dims: o, download: s, dispose: a });
  }, Ff = (e, t) => {
    let { dataType: r, dims: n, download: s, dispose: a } = t;
    return new bt({ location: "gpu-buffer", type: r ?? "float32", gpuBuffer: e, dims: n, download: s, dispose: a });
  }, If = (e, t) => {
    let { dataType: r, dims: n, download: s, dispose: a } = t;
    return new bt({ location: "ml-tensor", type: r ?? "float32", mlTensor: e, dims: n, download: s, dispose: a });
  }, Lf = (e, t, r) => new bt({ location: "cpu-pinned", type: e, data: t, dims: r ?? [t.length] });
}), jr, ts, Co, Of, tM = we(() => {
  "use strict";
  jr = /* @__PURE__ */ new Map([["float32", Float32Array], ["uint8", Uint8Array], ["int8", Int8Array], ["uint16", Uint16Array], ["int16", Int16Array], ["int32", Int32Array], ["bool", Uint8Array], ["float64", Float64Array], ["uint32", Uint32Array], ["int4", Uint8Array], ["uint4", Uint8Array]]), ts = /* @__PURE__ */ new Map([[Float32Array, "float32"], [Uint8Array, "uint8"], [Int8Array, "int8"], [Uint16Array, "uint16"], [Int16Array, "int16"], [Int32Array, "int32"], [Float64Array, "float64"], [Uint32Array, "uint32"]]), Co = !1, Of = () => {
    if (!Co) {
      Co = !0;
      let e = typeof BigInt64Array < "u" && BigInt64Array.from, t = typeof BigUint64Array < "u" && BigUint64Array.from, r = globalThis.Float16Array, n = typeof r < "u" && r.from;
      e && (jr.set("int64", BigInt64Array), ts.set(BigInt64Array, "int64")), t && (jr.set("uint64", BigUint64Array), ts.set(BigUint64Array, "uint64")), n ? (jr.set("float16", r), ts.set(r, "float16")) : jr.set("float16", Uint16Array);
    }
  };
}), Nf, Df, rM = we(() => {
  "use strict";
  Zo(), Nf = (e) => {
    let t = 1;
    for (let r = 0; r < e.length; r++) {
      let n = e[r];
      if (typeof n != "number" || !Number.isSafeInteger(n)) throw new TypeError(`dims[${r}] must be an integer, got: ${n}`);
      if (n < 0) throw new RangeError(`dims[${r}] must be a non-negative integer, got: ${n}`);
      t *= n;
    }
    return t;
  }, Df = (e, t) => {
    switch (e.location) {
      case "cpu":
        return new bt(e.type, e.data, t);
      case "cpu-pinned":
        return new bt({ location: "cpu-pinned", data: e.data, type: e.type, dims: t });
      case "texture":
        return new bt({ location: "texture", texture: e.texture, type: e.type, dims: t });
      case "gpu-buffer":
        return new bt({ location: "gpu-buffer", gpuBuffer: e.gpuBuffer, type: e.type, dims: t });
      case "ml-tensor":
        return new bt({ location: "ml-tensor", mlTensor: e.mlTensor, type: e.type, dims: t });
      default:
        throw new Error(`tensorReshape: tensor location ${e.location} is not supported`);
    }
  };
}), bt, Zo = we(() => {
  "use strict";
  Z0(), eM(), tM(), rM(), bt = class {
    constructor(e, t, r) {
      Of();
      let n, s;
      if (typeof e == "object" && "location" in e) switch (this.dataLocation = e.location, n = e.type, s = e.dims, e.location) {
        case "cpu-pinned": {
          let o = jr.get(n);
          if (!o) throw new TypeError(`unsupported type "${n}" to create tensor from pinned buffer`);
          if (!(e.data instanceof o)) throw new TypeError(`buffer should be of type ${o.name}`);
          this.cpuData = e.data;
          break;
        }
        case "texture": {
          if (n !== "float32") throw new TypeError(`unsupported type "${n}" to create tensor from texture`);
          this.gpuTextureData = e.texture, this.downloader = e.download, this.disposer = e.dispose;
          break;
        }
        case "gpu-buffer": {
          if (n !== "float32" && n !== "float16" && n !== "int32" && n !== "int64" && n !== "uint32" && n !== "uint8" && n !== "bool" && n !== "uint4" && n !== "int4") throw new TypeError(`unsupported type "${n}" to create tensor from gpu buffer`);
          this.gpuBufferData = e.gpuBuffer, this.downloader = e.download, this.disposer = e.dispose;
          break;
        }
        case "ml-tensor": {
          if (n !== "float32" && n !== "float16" && n !== "int32" && n !== "int64" && n !== "uint32" && n !== "uint64" && n !== "int8" && n !== "uint8" && n !== "bool" && n !== "uint4" && n !== "int4") throw new TypeError(`unsupported type "${n}" to create tensor from MLTensor`);
          this.mlTensorData = e.mlTensor, this.downloader = e.download, this.disposer = e.dispose;
          break;
        }
        default:
          throw new Error(`Tensor constructor: unsupported location '${this.dataLocation}'`);
      }
      else {
        let o, i;
        if (typeof e == "string") if (n = e, i = r, e === "string") {
          if (!Array.isArray(t)) throw new TypeError("A string tensor's data must be a string array.");
          o = t;
        } else {
          let l = jr.get(e);
          if (l === void 0) throw new TypeError(`Unsupported tensor type: ${e}.`);
          if (Array.isArray(t)) {
            if (e === "float16" && l === Uint16Array || e === "uint4" || e === "int4") throw new TypeError(`Creating a ${e} tensor from number array is not supported. Please use ${l.name} as data.`);
            e === "uint64" || e === "int64" ? o = l.from(t, BigInt) : o = l.from(t);
          } else if (t instanceof l) o = t;
          else if (t instanceof Uint8ClampedArray) if (e === "uint8") o = Uint8Array.from(t);
          else throw new TypeError("A Uint8ClampedArray tensor's data must be type of uint8");
          else if (e === "float16" && t instanceof Uint16Array && l !== Uint16Array) o = new globalThis.Float16Array(t.buffer, t.byteOffset, t.length);
          else throw new TypeError(`A ${n} tensor's data must be type of ${l}`);
        }
        else if (i = t, Array.isArray(e)) {
          if (e.length === 0) throw new TypeError("Tensor type cannot be inferred from an empty array.");
          let l = typeof e[0];
          if (l === "string") n = "string", o = e;
          else if (l === "boolean") n = "bool", o = Uint8Array.from(e);
          else throw new TypeError(`Invalid element type of data array: ${l}.`);
        } else if (e instanceof Uint8ClampedArray) n = "uint8", o = Uint8Array.from(e);
        else {
          let l = ts.get(e.constructor);
          if (l === void 0) throw new TypeError(`Unsupported type for tensor data: ${e.constructor}.`);
          n = l, o = e;
        }
        if (i === void 0) i = [o.length];
        else if (!Array.isArray(i)) throw new TypeError("A tensor's dims must be a number array");
        s = i, this.cpuData = o, this.dataLocation = "cpu";
      }
      let a = Nf(s);
      if (this.cpuData && a !== this.cpuData.length && !((n === "uint4" || n === "int4") && Math.ceil(a / 2) === this.cpuData.length)) throw new Error(`Tensor's size(${a}) does not match data length(${this.cpuData.length}).`);
      this.type = n, this.dims = s, this.size = a;
    }
    static async fromImage(e, t) {
      return Sf(e, t);
    }
    static fromTexture(e, t) {
      return Pf(e, t);
    }
    static fromGpuBuffer(e, t) {
      return Ff(e, t);
    }
    static fromMLTensor(e, t) {
      return If(e, t);
    }
    static fromPinnedBuffer(e, t, r) {
      return Lf(e, t, r);
    }
    toDataURL(e) {
      return Af(this, e);
    }
    toImageData(e) {
      return Cf(this, e);
    }
    get data() {
      if (this.ensureValid(), !this.cpuData) throw new Error("The data is not on CPU. Use `getData()` to download GPU data to CPU, or use `texture` or `gpuBuffer` property to access the GPU data directly.");
      return this.cpuData;
    }
    get location() {
      return this.dataLocation;
    }
    get texture() {
      if (this.ensureValid(), !this.gpuTextureData) throw new Error("The data is not stored as a WebGL texture.");
      return this.gpuTextureData;
    }
    get gpuBuffer() {
      if (this.ensureValid(), !this.gpuBufferData) throw new Error("The data is not stored as a WebGPU buffer.");
      return this.gpuBufferData;
    }
    get mlTensor() {
      if (this.ensureValid(), !this.mlTensorData) throw new Error("The data is not stored as a WebNN MLTensor.");
      return this.mlTensorData;
    }
    async getData(e) {
      switch (this.ensureValid(), this.dataLocation) {
        case "cpu":
        case "cpu-pinned":
          return this.data;
        case "texture":
        case "gpu-buffer":
        case "ml-tensor": {
          if (!this.downloader) throw new Error("The current tensor is not created with a specified data downloader.");
          if (this.isDownloading) throw new Error("The current tensor is being downloaded.");
          try {
            this.isDownloading = !0;
            let t = await this.downloader();
            return this.downloader = void 0, this.dataLocation = "cpu", this.cpuData = t, e && this.disposer && (this.disposer(), this.disposer = void 0), t;
          } finally {
            this.isDownloading = !1;
          }
        }
        default:
          throw new Error(`cannot get data from location: ${this.dataLocation}`);
      }
    }
    dispose() {
      if (this.isDownloading) throw new Error("The current tensor is being downloaded.");
      this.disposer && (this.disposer(), this.disposer = void 0), this.cpuData = void 0, this.gpuTextureData = void 0, this.gpuBufferData = void 0, this.mlTensorData = void 0, this.downloader = void 0, this.isDownloading = void 0, this.dataLocation = "none";
    }
    ensureValid() {
      if (this.dataLocation === "none") throw new Error("The tensor is disposed.");
    }
    reshape(e) {
      if (this.ensureValid(), this.downloader || this.disposer) throw new Error("Cannot reshape a tensor that owns GPU resource.");
      return Df(this, e);
    }
  };
}), Ot, zf = we(() => {
  "use strict";
  Zo(), Ot = bt;
}), Hs, So, Hr, Qr, xr, kr, Bf = we(() => {
  "use strict";
  Ef(), Hs = (e, t) => {
    (typeof Ze.trace > "u" ? !Ze.wasm.trace : !Ze.trace) || console.timeStamp(`${e}::ORT::${t}`);
  }, So = (e, t) => {
    let r = new Error().stack?.split(/\r\n|\r|\n/g) || [], n = !1;
    for (let s = 0; s < r.length; s++) {
      if (n && !r[s].includes("TRACE_FUNC")) {
        let a = `FUNC_${e}::${r[s].trim().split(" ")[1]}`;
        t && (a += `::${t}`), Hs("CPU", a);
        return;
      }
      r[s].includes("TRACE_FUNC") && (n = !0);
    }
  }, Hr = (e) => {
    (typeof Ze.trace > "u" ? !Ze.wasm.trace : !Ze.trace) || So("BEGIN", e);
  }, Qr = (e) => {
    (typeof Ze.trace > "u" ? !Ze.wasm.trace : !Ze.trace) || So("END", e);
  }, xr = (e) => {
    (typeof Ze.trace > "u" ? !Ze.wasm.trace : !Ze.trace) || console.time(`ORT::${e}`);
  }, kr = (e) => {
    (typeof Ze.trace > "u" ? !Ze.wasm.trace : !Ze.trace) || console.timeEnd(`ORT::${e}`);
  };
}), Rf, nM = we(() => {
  "use strict";
  kf(), zf(), Bf(), Rf = class $f {
    constructor(t) {
      this.handler = t;
    }
    async run(t, r, n) {
      Hr(), xr("InferenceSession.run");
      let s = {}, a = {};
      if (typeof t != "object" || t === null || t instanceof Ot || Array.isArray(t)) throw new TypeError("'feeds' must be an object that use input names as keys and OnnxValue as corresponding values.");
      let o = !0;
      if (typeof r == "object") {
        if (r === null) throw new TypeError("Unexpected argument[1]: cannot be null.");
        if (r instanceof Ot) throw new TypeError("'fetches' cannot be a Tensor");
        if (Array.isArray(r)) {
          if (r.length === 0) throw new TypeError("'fetches' cannot be an empty array.");
          o = !1;
          for (let c of r) {
            if (typeof c != "string") throw new TypeError("'fetches' must be a string array or an object.");
            if (this.outputNames.indexOf(c) === -1) throw new RangeError(`'fetches' contains invalid output name: ${c}.`);
            s[c] = null;
          }
          if (typeof n == "object" && n !== null) a = n;
          else if (typeof n < "u") throw new TypeError("'options' must be an object.");
        } else {
          let c = !1, d = Object.getOwnPropertyNames(r);
          for (let h of this.outputNames) if (d.indexOf(h) !== -1) {
            let _ = r[h];
            (_ === null || _ instanceof Ot) && (c = !0, o = !1, s[h] = _);
          }
          if (c) {
            if (typeof n == "object" && n !== null) a = n;
            else if (typeof n < "u") throw new TypeError("'options' must be an object.");
          } else a = r;
        }
      } else if (typeof r < "u") throw new TypeError("Unexpected argument[1]: must be 'fetches' or 'options'.");
      for (let c of this.inputNames) if (typeof t[c] > "u") throw new Error(`input '${c}' is missing in 'feeds'.`);
      if (o) for (let c of this.outputNames) s[c] = null;
      let i = await this.handler.run(t, s, a), l = {};
      for (let c in i) if (Object.hasOwnProperty.call(i, c)) {
        let d = i[c];
        d instanceof Ot ? l[c] = d : l[c] = new Ot(d.type, d.data, d.dims);
      }
      return kr("InferenceSession.run"), Qr(), l;
    }
    async release() {
      return this.handler.dispose();
    }
    static async create(t, r, n, s) {
      Hr(), xr("InferenceSession.create");
      let a, o = {};
      if (typeof t == "string") {
        if (a = t, typeof r == "object" && r !== null) o = r;
        else if (typeof r < "u") throw new TypeError("'options' must be an object.");
      } else if (t instanceof Uint8Array) {
        if (a = t, typeof r == "object" && r !== null) o = r;
        else if (typeof r < "u") throw new TypeError("'options' must be an object.");
      } else if (t instanceof ArrayBuffer || typeof SharedArrayBuffer < "u" && t instanceof SharedArrayBuffer) {
        let d = t, h = 0, _ = t.byteLength;
        if (typeof r == "object" && r !== null) o = r;
        else if (typeof r == "number") {
          if (h = r, !Number.isSafeInteger(h)) throw new RangeError("'byteOffset' must be an integer.");
          if (h < 0 || h >= d.byteLength) throw new RangeError(`'byteOffset' is out of range [0, ${d.byteLength}).`);
          if (_ = t.byteLength - h, typeof n == "number") {
            if (_ = n, !Number.isSafeInteger(_)) throw new RangeError("'byteLength' must be an integer.");
            if (_ <= 0 || h + _ > d.byteLength) throw new RangeError(`'byteLength' is out of range (0, ${d.byteLength - h}].`);
            if (typeof s == "object" && s !== null) o = s;
            else if (typeof s < "u") throw new TypeError("'options' must be an object.");
          } else if (typeof n < "u") throw new TypeError("'byteLength' must be a number.");
        } else if (typeof r < "u") throw new TypeError("'options' must be an object.");
        a = new Uint8Array(d, h, _);
      } else throw new TypeError("Unexpected argument[0]: must be 'path' or 'buffer'.");
      let [i, l] = await xf(o), c = await i.createInferenceSessionHandler(a, l);
      return kr("InferenceSession.create"), Qr(), new $f(c);
    }
    startProfiling() {
      this.handler.startProfiling();
    }
    endProfiling() {
      this.handler.endProfiling();
    }
    get inputNames() {
      return this.handler.inputNames;
    }
    get outputNames() {
      return this.handler.outputNames;
    }
    get inputMetadata() {
      return this.handler.inputMetadata;
    }
    get outputMetadata() {
      return this.handler.outputMetadata;
    }
  };
}), ei, sM = we(() => {
  "use strict";
  nM(), ei = Rf;
}), aM = we(() => {
  "use strict";
}), oM = we(() => {
  "use strict";
}), iM = we(() => {
  "use strict";
}), lM = we(() => {
  "use strict";
}), Gf = {};
ns(Gf, { InferenceSession: () => ei, TRACE: () => Hs, TRACE_EVENT_BEGIN: () => xr, TRACE_EVENT_END: () => kr, TRACE_FUNC_BEGIN: () => Hr, TRACE_FUNC_END: () => Qr, Tensor: () => Ot, env: () => ze, registerBackend: () => qr });
var Xr = we(() => {
  "use strict";
  Y0(), J0(), sM(), zf(), aM(), oM(), Bf(), iM(), lM();
}), ti = we(() => {
  "use strict";
}), Vf = {};
ns(Vf, { default: () => Uf });
var Po, Fo, Uf, cM = we(() => {
  "use strict";
  s_(), Yr(), ri(), Po = "ort-wasm-proxy-worker", Fo = globalThis.self?.name === Po, Fo && (self.onmessage = (e) => {
    let { type: t, in: r } = e.data;
    try {
      switch (t) {
        case "init-wasm":
          ni(r.wasm).then(() => {
            li(r).then(() => {
              postMessage({ type: t });
            }, (n) => {
              postMessage({ type: t, err: n });
            });
          }, (n) => {
            postMessage({ type: t, err: n });
          });
          break;
        case "init-ep": {
          let { epName: n, env: s } = r;
          ci(s, n).then(() => {
            postMessage({ type: t });
          }, (a) => {
            postMessage({ type: t, err: a });
          });
          break;
        }
        case "copy-from": {
          let { buffer: n } = r, s = Ys(n);
          postMessage({ type: t, out: s });
          break;
        }
        case "create": {
          let { model: n, options: s } = r;
          ui(n, s).then((a) => {
            postMessage({ type: t, out: a });
          }, (a) => {
            postMessage({ type: t, err: a });
          });
          break;
        }
        case "release":
          di(r), postMessage({ type: t });
          break;
        case "run": {
          let { sessionId: n, inputIndices: s, inputs: a, outputIndices: o, options: i } = r;
          hi(n, s, a, o, new Array(o.length).fill(null), i).then((l) => {
            l.some((c) => c[3] !== "cpu") ? postMessage({ type: t, err: "Proxy does not support non-cpu tensor location." }) : postMessage({ type: t, out: l }, _i([...a, ...l]));
          }, (l) => {
            postMessage({ type: t, err: l });
          });
          break;
        }
        case "end-profiling":
          fi(r), postMessage({ type: t });
          break;
        default:
      }
    } catch (n) {
      postMessage({ type: t, err: n });
    }
  }), Uf = Fo ? null : (e) => new Worker(e ?? vt, { type: "module", name: Po });
}), jf = {};
ns(jf, { default: () => Wf });
async function Xh(e = {}) {
  var t = e, r = !!globalThis.window, n = !!globalThis.WorkerGlobalScope, s = n && self.name?.startsWith("em-pthread");
  t.mountExternalData = (u, f) => {
    u.startsWith("./") && (u = u.substring(2)), (t.ed || (t.ed = /* @__PURE__ */ new Map())).set(u, f);
  }, t.unmountExternalData = () => {
    delete t.ed, delete t.Te, delete t.Se, delete t.Ue;
  }, globalThis.SharedArrayBuffer ?? new WebAssembly.Memory({ initial: 0, maximum: 0, shared: !0 }).buffer.constructor;
  let a = () => {
    let u = (f) => (...m) => {
      let g = Ht;
      return m = f(...m), Ht != g ? new Promise((x, T) => {
        lo = { resolve: x, reject: T };
      }) : m;
    };
    (() => {
      for (let f of ["_OrtAppendExecutionProvider", "_OrtCreateSession", "_OrtRun", "_OrtRunWithBinding", "_OrtBindInput"]) t[f] = u(t[f]);
    })(), typeof jsepRunAsync < "u" && (t._OrtRun = jsepRunAsync(t._OrtRun), t._OrtRunWithBinding = jsepRunAsync(t._OrtRunWithBinding)), a = void 0;
  };
  t.asyncInit = () => {
    a?.();
  };
  var o, i, l = (u, f) => {
    throw f;
  }, c = import.meta.url, d = "";
  if (r || n) {
    try {
      d = new URL(".", c).href;
    } catch {
    }
    n && (i = (u) => {
      var f = new XMLHttpRequest();
      return f.open("GET", u, !1), f.responseType = "arraybuffer", f.send(null), new Uint8Array(f.response);
    }), o = async (u) => {
      if (N(u)) return new Promise((m, g) => {
        var x = new XMLHttpRequest();
        x.open("GET", u, !0), x.responseType = "arraybuffer", x.onload = () => {
          x.status == 200 || x.status == 0 && x.response ? m(x.response) : g(x.status);
        }, x.onerror = g, x.send(null);
      });
      var f = await fetch(u, { credentials: "same-origin" });
      if (f.ok) return f.arrayBuffer();
      throw Error(f.status + " : " + f.url);
    };
  }
  var h, _, p, w, v, y, b = console.log.bind(console), k = console.error.bind(console), A = b, E = k, C = !1, N = (u) => u.startsWith("file://");
  function M() {
    wr.buffer != W.buffer && G();
  }
  if (s) {
    let u = function(f) {
      try {
        var m = f.data, g = m.$c;
        if (g === "load") {
          let x = [];
          self.onmessage = (T) => x.push(T), y = () => {
            postMessage({ $c: "loaded" });
            for (let T of x) u(T);
            self.onmessage = u;
          };
          for (let T of m.ue) t[T] && !t[T].proxy || (t[T] = (...F) => {
            postMessage({ $c: "callHandler", te: T, args: F });
          }, T == "print" && (A = t[T]), T == "printErr" && (E = t[T]));
          wr = m.Me, G(), _ = m.Ne, Pe(), Rs();
        } else if (g === "run") {
          (function(x) {
            var T = (M(), P)[x + 52 >>> 2 >>> 0];
            x = (M(), P)[x + 56 >>> 2 >>> 0], rh(T, T - x), te(T);
          })(m.Xc), bo(m.Xc, 0, 0, 1, 0, 0), Du(), ao(m.Xc), R || (zd(), R = !0);
          try {
            Lv(m.ze, m.kd);
          } catch (x) {
            if (x != "unwind") throw x;
          }
        } else m.target !== "setimmediate" && (g === "checkMailbox" ? R && Ss() : g && (E(`worker: received unknown command ${g}`), E(m)));
      } catch (x) {
        throw Kd(), x;
      }
    };
    var $ = u, R = !1;
    self.onunhandledrejection = (f) => {
      throw f.reason || f;
    }, self.onmessage = u;
  }
  var W, Q, H, q, B, P, X, ce, J, ne, L, O = !1;
  function G() {
    var u = wr.buffer;
    t.HEAP8 = W = new Int8Array(u), H = new Int16Array(u), t.HEAPU8 = Q = new Uint8Array(u), q = new Uint16Array(u), t.HEAP32 = B = new Int32Array(u), t.HEAPU32 = P = new Uint32Array(u), X = new Float32Array(u), ce = new Float64Array(u), J = new BigInt64Array(u), ne = new BigUint64Array(u);
  }
  function ue() {
    O = !0, s ? y() : ur.hc();
  }
  function ee(u) {
    throw E(u = "Aborted(" + u + ")"), C = !0, u = new WebAssembly.RuntimeError(u + ". Build with -sASSERTIONS for more info."), v?.(u), u;
  }
  function We() {
    return { a: { qa: n0, f: Ov, K: Nv, k: Dv, p: zv, l: Bv, fa: Rv, b: $v, da: Gv, gc: Vu, q: Vv, ea: qu, Ua: Hu, cc: Qu, ec: Xu, Va: Yu, Sa: Ku, La: Ju, Ra: Zu, oa: ed, dc: td, ac: rd, Ta: nd, bc: sd, _a: Uv, Ba: Wv, Xb: qv, Vb: Qv, Aa: Yv, O: Kv, J: Jv, Wb: Zv, ka: oy, Yb: iy, Oa: ly, _b: uy, Ea: dy, Tb: hy, Ca: fy, Na: ao, Xa: _y, U: wy, n: xy, c: no, qb: ky, w: Ty, N: Ey, A: Ay, j: Cy, o: hd, rb: Sy, H: Py, T: Fy, g: Iy, u: Ly, m: Oy, i: Ny, Ia: Dy, Ja: zy, Ka: By, Ga: md, Ha: gd, Ub: wd, ab: $y, Za: Uy, Z: jy, pb: Wy, Da: qy, Ya: Gy, X: Hy, Wa: Qy, $b: Xy, G: Ry, db: Yy, _: Ky, pa: Os, Zb: Zy, cb: Jy, bb: eb, lb: fb, z: _b, sa: pb, ra: mb, nb: gb, Y: wb, v: vb, kb: yb, jb: bb, ib: Mb, mb: xb, gb: kb, fb: Tb, eb: Eb, Pa: Sd, Qa: Pd, fc: Ja, W: Fd, Fa: Id, ma: Ld, Ma: Od, la: Nd, Fb: G0, va: N0, Gb: $0, wa: O0, E: b0, e: i0, r: a0, x: s0, C: g0, Ib: F0, ca: P0, D: u0, xa: I0, aa: D0, ha: S0, Jb: C0, Kb: A0, za: x0, Lb: T0, ya: E0, Mb: k0, ua: R0, ba: L0, d: o0, B: c0, s: l0, Eb: V0, t: h0, y: v0, F: d0, I: f0, L: y0, Nb: M0, R: z0, ia: m0, $: B0, Pb: p0, Rb: _0, Ob: w0, h: Cb, a: wr, $a: sn, Hb: Sb, V: Pb, M: Fb, na: Ib, Db: Lb, ja: Ob, S: Nb, Ab: Db, Bb: zb, vb: Bb, wb: Rb, P: $b, xb: Gb, yb: Vb, ta: Ub, Sb: jb, ob: Wb, Q: qb, hb: Hb, Cb: Qb, sb: Xb, tb: Kb, ub: Jb, ga: Zb, zb: e0, Qb: t0 } };
  }
  async function Pe() {
    function u(g, x) {
      var T = ur = g.exports;
      g = {};
      for (let [F, S] of Object.entries(T)) typeof S == "function" ? (T = py(S), g[F] = T) : g[F] = S;
      return ur = g, ur = (function() {
        var F = ur, S = (U) => (he) => U(he) >>> 0, D = (U) => () => U() >>> 0;
        return (F = Object.assign({}, F)).ic = S(F.ic), F.Nc = D(F.Nc), F.Pc = S(F.Pc), F.Bd = /* @__PURE__ */ ((U) => (he, _e) => U(he, _e) >>> 0)(F.Bd), F.Gd = S(F.Gd), F.Hd = D(F.Hd), F.Ld = S(F.Ld), F;
      })(), Ou.push(ur.sd), Dd = (g = ur).ic, zd = g.jc, t._OrtInit = g.kc, t._OrtGetLastError = g.lc, t._OrtCreateSessionOptions = g.mc, t._OrtAppendExecutionProvider = g.nc, t._OrtAddFreeDimensionOverride = g.oc, t._OrtAddSessionConfigEntry = g.pc, t._OrtReleaseSessionOptions = g.qc, t._OrtCreateSession = g.rc, t._OrtReleaseSession = g.sc, t._OrtGetInputOutputCount = g.tc, t._OrtGetInputOutputMetadata = g.uc, t._OrtFree = g.vc, t._OrtCreateTensor = g.wc, t._OrtGetTensorData = g.xc, t._OrtReleaseTensor = g.yc, t._OrtCreateRunOptions = g.zc, t._OrtAddRunConfigEntry = g.Ac, t._OrtReleaseRunOptions = g.Bc, t._OrtCreateBinding = g.Cc, t._OrtBindInput = g.Dc, t._OrtBindOutput = g.Ec, t._OrtClearBoundOutputs = g.Fc, t._OrtReleaseBinding = g.Gc, t._OrtRunWithBinding = g.Hc, t._OrtRun = g.Ic, t._OrtEndProfiling = g.Jc, Bd = t._OrtCreateWebGpuInstance = g.Kc, t._wgpuCreateInstance = g.Lc, po = t._OrtGetWebGpuDevice = g.Mc, zs = g.Nc, Et = t._free = g.Oc, Br = t._malloc = g.Pc, Rd = t._wgpuBufferRelease = g.Qc, $d = g.Rc, Gd = g.Sc, Vd = g.Tc, Ud = g.Uc, jd = g.Vc, Wd = g.Yc, qd = g.Zc, Hd = g.hd, Qd = g.id, Xd = g.jd, mo = g.ld, go = g.md, wo = g.nd, vo = g.od, Qn = g.pd, yo = g.qd, Yd = g.rd, bo = g.ud, Kd = g.vd, Jd = g.wd, Zd = g.xd, Mo = g.yd, eh = g.zd, th = g.Ad, xo = g.Bd, fe = g.Cd, Xn = g.Dd, rh = g.Ed, te = g.Fd, Bs = g.Gd, re = g.Hd, nh = g.Id, ko = g.Jd, sh = g.Kd, ah = g.Ld, oh = g.Md, To = g.Nd, ih = g.Od, lh = g.Pd, ch = g.Qd, uh = g.Rd, dh = g.Sd, hh = g.Td, fh = g.Ud, _h = g.Vd, ph = g.Wd, mh = g.Xd, gh = g.Yd, wh = g.Zd, vh = g._d, yh = g.$d, bh = g.ae, Mh = g.be, xh = g.ce, kh = g.de, Th = g.fe, Eh = g.ge, Ah = g.he, Ch = g.ie, Sh = g.je, Ph = g.ke, Fh = g.le, Ih = g.me, Lh = g.Ae, Oh = g.Be, Nh = g.Ce, Dh = g.De, zh = g.Ee, Bh = g.Fe, Rh = g.Ge, $h = g.He, Gh = g.Ie, Vh = g.Je, Uh = g.Ke, jh = g.nf, Wh = g.of, qh = g.pf, Hh = g.qf, _ = x, ur;
    }
    var f, m = We();
    return t.instantiateWasm ? new Promise((g) => {
      t.instantiateWasm(m, (x, T) => {
        g(u(x, T));
      });
    }) : s ? u(new WebAssembly.Instance(_, We()), _) : (L ??= t.locateFile ? t.locateFile ? t.locateFile("ort-wasm-simd-threaded.asyncify.wasm", d) : d + "ort-wasm-simd-threaded.asyncify.wasm" : new URL("ort-wasm-simd-threaded.asyncify.wasm", import.meta.url).href, f = await (async function(g) {
      var x = L;
      if (!h && !N(x)) try {
        var T = fetch(x, { credentials: "same-origin" });
        return await WebAssembly.instantiateStreaming(T, g);
      } catch (F) {
        E(`wasm streaming compile failed: ${F}`), E("falling back to ArrayBuffer instantiation");
      }
      return (async function(F, S) {
        try {
          var D = await (async function(U) {
            if (!h) try {
              var he = await o(U);
              return new Uint8Array(he);
            } catch {
            }
            if (U == L && h) U = new Uint8Array(h);
            else {
              if (!i) throw "both async and sync fetching of the wasm failed";
              U = i(U);
            }
            return U;
          })(F);
          return await WebAssembly.instantiate(D, S);
        } catch (U) {
          E(`failed to asynchronously prepare wasm: ${U}`), ee(U);
        }
      })(x, g);
    })(m), u(f.instance, f.module));
  }
  class be {
    name = "ExitStatus";
    constructor(f) {
      this.message = `Program terminated with exit(${f})`, this.status = f;
    }
  }
  var $e = (u) => {
    u.terminate(), u.onmessage = () => {
    };
  }, Le = [], ye = 0, Ye = null, Wt = (u) => {
    gr.length == 0 && (Bu(), zu(gr[0]));
    var f = gr.pop();
    if (!f) return 6;
    qn.push(f), Nr[u.Xc] = f, f.Xc = u.Xc;
    var m = { $c: "run", ze: u.ye, kd: u.kd, Xc: u.Xc };
    return f.postMessage(m, u.oe), 0;
  }, Me = 0, Fe = (u, f, ...m) => {
    var g, x = 16 * m.length, T = re(), F = Bs(x), S = F >>> 3;
    for (g of m) typeof g == "bigint" ? ((M(), J)[S++ >>> 0] = 1n, (M(), J)[S++ >>> 0] = g) : ((M(), J)[S++ >>> 0] = 0n, (M(), ce)[S++ >>> 0] = g);
    return u = Jd(u, 0, x, F, f), te(T), u;
  };
  function sn(u) {
    if (s) return Fe(0, 1, u);
    if (p = u, !(0 < Me)) {
      for (var f of qn) $e(f);
      for (f of gr) $e(f);
      gr = [], qn = [], Nr = {}, C = !0;
    }
    l(0, new be(u));
  }
  function Wn(u) {
    if (s) return Fe(1, 0, u);
    Ja(u);
  }
  var Ja = (u) => {
    if (p = u, s) throw Wn(u), "unwind";
    sn(u);
  }, gr = [], qn = [], Ou = [], Nr = {}, Nu = (u) => {
    var f = u.Xc;
    delete Nr[f], gr.push(u), qn.splice(qn.indexOf(u), 1), u.Xc = 0, Zd(f);
  };
  function Du() {
    Ou.forEach((u) => u());
  }
  var zu = (u) => new Promise((f) => {
    u.onmessage = (x) => {
      var T = x.data;
      if (x = T.$c, T.gd && T.gd != zs()) {
        var F = Nr[T.gd];
        F ? F.postMessage(T, T.oe) : E(`Internal error! Worker sent a message "${x}" to target pthread ${T.gd}, but that thread no longer exists!`);
      } else x === "checkMailbox" ? Ss() : x === "spawnThread" ? Wt(T) : x === "cleanupThread" ? ft(() => {
        Nu(Nr[T.Le]);
      }) : x === "loaded" ? (u.loaded = !0, f(u)) : T.target === "setimmediate" ? u.postMessage(T) : x === "uncaughtException" ? u.onerror(T.error) : x === "callHandler" ? t[T.te](...T.args) : x && E(`worker sent an unknown command ${x}`);
    }, u.onerror = (x) => {
      throw E(`worker sent an error! ${x.filename}:${x.lineno}: ${x.message}`), x;
    };
    var m, g = [];
    for (m of []) t.propertyIsEnumerable(m) && g.push(m);
    u.postMessage({ $c: "load", ue: g, Me: wr, Ne: _ });
  });
  function Bu() {
    var u = new Worker((() => {
      let f = URL;
      return import.meta.url > "file:" && import.meta.url < "file;" ? new f("ort.webgpu.bundle.min.mjs", import.meta.url) : new URL(import.meta.url);
    })(), { type: "module", workerData: "em-pthread", name: "em-pthread" });
    gr.push(u);
  }
  var wr, Lv = (u, f) => {
    Me = 0, u = To(u, f), 0 < Me ? p = u : Mo(u);
  }, As = [], Cs = 0, tt = (u) => -9007199254740992 > u || 9007199254740992 < u ? NaN : Number(u);
  function Ov(u) {
    var f = new Za(u >>>= 0);
    return (M(), W)[f.ad + 12 >>> 0] == 0 && (Ru(f, !0), Cs--), $u(f, !1), As.push(f), ah(u);
  }
  var an = 0, Nv = () => {
    fe(0, 0);
    var u = As.pop();
    nh(u.td), an = 0;
  };
  function Ru(u, f) {
    f = f ? 1 : 0, (M(), W)[u.ad + 12 >>> 0] = f;
  }
  function $u(u, f) {
    f = f ? 1 : 0, (M(), W)[u.ad + 13 >>> 0] = f;
  }
  class Za {
    constructor(f) {
      this.td = f, this.ad = f - 24;
    }
  }
  var eo = (u) => {
    var f = an;
    if (!f) return Xn(0), 0;
    var m = new Za(f);
    (M(), P)[m.ad + 16 >>> 2 >>> 0] = f;
    var g = (M(), P)[m.ad + 4 >>> 2 >>> 0];
    if (!g) return Xn(0), f;
    for (var x of u) {
      if (x === 0 || x === g) break;
      if (sh(x, g, m.ad + 16)) return Xn(x), f;
    }
    return Xn(g), f;
  };
  function Dv() {
    return eo([]);
  }
  function zv(u) {
    return eo([u >>> 0]);
  }
  function Bv(u, f, m, g) {
    return eo([u >>> 0, f >>> 0, m >>> 0, g >>> 0]);
  }
  var Rv = () => {
    var u = As.pop();
    u || ee("no exception to throw");
    var f = u.td;
    throw (M(), W)[u.ad + 13 >>> 0] == 0 && (As.push(u), $u(u, !0), Ru(u, !1), Cs++), ko(f), an = f;
  };
  function $v(u, f, m) {
    var g = new Za(u >>>= 0);
    throw f >>>= 0, m >>>= 0, (M(), P)[g.ad + 16 >>> 2 >>> 0] = 0, (M(), P)[g.ad + 4 >>> 2 >>> 0] = f, (M(), P)[g.ad + 8 >>> 2 >>> 0] = m, ko(u), Cs++, an = u;
  }
  var Gv = () => Cs;
  function Gu(u, f, m, g) {
    return s ? Fe(2, 1, u, f, m, g) : Vu(u, f, m, g);
  }
  function Vu(u, f, m, g) {
    if (u >>>= 0, f >>>= 0, m >>>= 0, g >>>= 0, !globalThis.SharedArrayBuffer) return 6;
    var x = [];
    return s && x.length === 0 ? Gu(u, f, m, g) : (u = { ye: m, Xc: u, kd: g, oe: x }, s ? (u.$c = "spawnThread", postMessage(u, x), 0) : Wt(u));
  }
  function Vv(u) {
    throw an ||= u >>> 0, an;
  }
  var Uu = globalThis.TextDecoder && new TextDecoder(), ju = (u, f, m, g) => {
    if (m = f + m, g) return m;
    for (; u[f] && !(f >= m); ) ++f;
    return f;
  }, Wu = (u, f = 0, m, g) => {
    if (16 < (m = ju(u, f >>>= 0, m, g)) - f && u.buffer && Uu) return Uu.decode(u.buffer instanceof ArrayBuffer ? u.subarray(f, m) : u.slice(f, m));
    for (g = ""; f < m; ) {
      var x = u[f++];
      if (128 & x) {
        var T = 63 & u[f++];
        if ((224 & x) == 192) g += String.fromCharCode((31 & x) << 6 | T);
        else {
          var F = 63 & u[f++];
          65536 > (x = (240 & x) == 224 ? (15 & x) << 12 | T << 6 | F : (7 & x) << 18 | T << 12 | F << 6 | 63 & u[f++]) ? g += String.fromCharCode(x) : (x -= 65536, g += String.fromCharCode(55296 | x >> 10, 56320 | 1023 & x));
        }
      } else g += String.fromCharCode(x);
    }
    return g;
  }, on = (u, f, m) => (u >>>= 0) ? Wu((M(), Q), u, f, m) : "";
  function qu(u, f, m) {
    return s ? Fe(3, 1, u, f, m) : 0;
  }
  function Hu(u, f) {
    if (s) return Fe(4, 1, u, f);
  }
  function Qu(u, f) {
    if (s) return Fe(5, 1, u, f);
  }
  function Xu(u, f, m) {
    if (s) return Fe(6, 1, u, f, m);
  }
  function Yu(u, f, m) {
    return s ? Fe(7, 1, u, f, m) : 0;
  }
  function Ku(u, f) {
    if (s) return Fe(8, 1, u, f);
  }
  function Ju(u, f, m) {
    if (s) return Fe(9, 1, u, f, m);
  }
  function Zu(u, f, m, g) {
    if (s) return Fe(10, 1, u, f, m, g);
  }
  function ed(u, f, m, g) {
    if (s) return Fe(11, 1, u, f, m, g);
  }
  function td(u, f, m, g) {
    if (s) return Fe(12, 1, u, f, m, g);
  }
  function rd(u) {
    if (s) return Fe(13, 1, u);
  }
  function nd(u, f) {
    if (s) return Fe(14, 1, u, f);
  }
  function sd(u, f, m) {
    if (s) return Fe(15, 1, u, f, m);
  }
  var Uv = () => ee(""), qt = (u) => {
    u >>>= 0;
    for (var f = ""; ; ) {
      var m = (M(), Q)[u++ >>> 0];
      if (!m) return f;
      f += String.fromCharCode(m);
    }
  }, to = {}, ro = {}, jv = {}, ln = class extends Error {
    constructor(u) {
      super(u), this.name = "BindingError";
    }
  };
  function or(u, f, m = {}) {
    return (function(g, x, T = {}) {
      var F = x.name;
      if (!g) throw new ln(`type "${F}" must have a positive integer typeid pointer`);
      if (ro.hasOwnProperty(g)) {
        if (T.ve) return;
        throw new ln(`Cannot register type '${F}' twice`);
      }
      ro[g] = x, delete jv[g], to.hasOwnProperty(g) && (x = to[g], delete to[g], x.forEach((S) => S()));
    })(u, f, m);
  }
  var ad = (u, f, m) => {
    switch (f) {
      case 1:
        return m ? (g) => (M(), W)[g >>> 0] : (g) => (M(), Q)[g >>> 0];
      case 2:
        return m ? (g) => (M(), H)[g >>> 1 >>> 0] : (g) => (M(), q)[g >>> 1 >>> 0];
      case 4:
        return m ? (g) => (M(), B)[g >>> 2 >>> 0] : (g) => (M(), P)[g >>> 2 >>> 0];
      case 8:
        return m ? (g) => (M(), J)[g >>> 3 >>> 0] : (g) => (M(), ne)[g >>> 3 >>> 0];
      default:
        throw new TypeError(`invalid integer width (${f}): ${u}`);
    }
  };
  function Wv(u, f, m, g, x) {
    u >>>= 0, m >>>= 0, f = qt(f >>> 0);
    let T = (F) => F;
    if (g = g === 0n) {
      let F = 8 * m;
      T = (S) => BigInt.asUintN(F, S), x = T(x);
    }
    or(u, { name: f, Wc: T, cd: (F, S) => (typeof S == "number" && (S = BigInt(S)), S), bd: ad(f, m, !g), dd: null });
  }
  function qv(u, f, m, g) {
    or(u >>>= 0, { name: f = qt(f >>> 0), Wc: function(x) {
      return !!x;
    }, cd: function(x, T) {
      return T ? m : g;
    }, bd: function(x) {
      return this.Wc((M(), Q)[x >>> 0]);
    }, dd: null });
  }
  var od = [], Dr = [0, 1, , 1, null, 1, !0, 1, !1, 1];
  function no(u) {
    9 < (u >>>= 0) && --Dr[u + 1] === 0 && (Dr[u] = void 0, od.push(u));
  }
  var Tt = (u) => {
    if (!u) throw new ln(`Cannot use deleted val. handle = ${u}`);
    return Dr[u];
  }, It = (u) => {
    switch (u) {
      case void 0:
        return 2;
      case null:
        return 4;
      case !0:
        return 6;
      case !1:
        return 8;
      default:
        let f = od.pop() || Dr.length;
        return Dr[f] = u, Dr[f + 1] = 1, f;
    }
  };
  function so(u) {
    return this.Wc((M(), P)[u >>> 2 >>> 0]);
  }
  var Hv = { name: "emscripten::val", Wc: (u) => {
    var f = Tt(u);
    return no(u), f;
  }, cd: (u, f) => It(f), bd: so, dd: null };
  function Qv(u) {
    return or(u >>> 0, Hv);
  }
  var Xv = (u, f) => {
    switch (f) {
      case 4:
        return function(m) {
          return this.Wc((M(), X)[m >>> 2 >>> 0]);
        };
      case 8:
        return function(m) {
          return this.Wc((M(), ce)[m >>> 3 >>> 0]);
        };
      default:
        throw new TypeError(`invalid float width (${f}): ${u}`);
    }
  };
  function Yv(u, f, m) {
    m >>>= 0, or(u >>>= 0, { name: f = qt(f >>> 0), Wc: (g) => g, cd: (g, x) => x, bd: Xv(f, m), dd: null });
  }
  function Kv(u, f, m, g, x) {
    u >>>= 0, m >>>= 0, f = qt(f >>> 0);
    let T = (S) => S;
    if (g === 0) {
      var F = 32 - 8 * m;
      T = (S) => S << F >>> F, x = T(x);
    }
    or(u, { name: f, Wc: T, cd: (S, D) => D, bd: ad(f, m, g !== 0), dd: null });
  }
  function Jv(u, f, m) {
    function g(T) {
      var F = (M(), P)[T >>> 2 >>> 0];
      return T = (M(), P)[T + 4 >>> 2 >>> 0], new x((M(), W).buffer, T, F);
    }
    var x = [Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array, BigInt64Array, BigUint64Array][f];
    or(u >>>= 0, { name: m = qt(m >>> 0), Wc: g, bd: g }, { ve: !0 });
  }
  var ir = (u, f, m) => {
    var g = (M(), Q);
    if (f >>>= 0, 0 < m) {
      var x = f;
      m = f + m - 1;
      for (var T = 0; T < u.length; ++T) {
        var F = u.codePointAt(T);
        if (127 >= F) {
          if (f >= m) break;
          g[f++ >>> 0] = F;
        } else if (2047 >= F) {
          if (f + 1 >= m) break;
          g[f++ >>> 0] = 192 | F >> 6, g[f++ >>> 0] = 128 | 63 & F;
        } else if (65535 >= F) {
          if (f + 2 >= m) break;
          g[f++ >>> 0] = 224 | F >> 12, g[f++ >>> 0] = 128 | F >> 6 & 63, g[f++ >>> 0] = 128 | 63 & F;
        } else {
          if (f + 3 >= m) break;
          g[f++ >>> 0] = 240 | F >> 18, g[f++ >>> 0] = 128 | F >> 12 & 63, g[f++ >>> 0] = 128 | F >> 6 & 63, g[f++ >>> 0] = 128 | 63 & F, T++;
        }
      }
      g[f >>> 0] = 0, u = f - x;
    } else u = 0;
    return u;
  }, lr = (u) => {
    for (var f = 0, m = 0; m < u.length; ++m) {
      var g = u.charCodeAt(m);
      127 >= g ? f++ : 2047 >= g ? f += 2 : 55296 <= g && 57343 >= g ? (f += 4, ++m) : f += 3;
    }
    return f;
  };
  function Zv(u, f) {
    or(u >>>= 0, { name: f = qt(f >>> 0), Wc(m) {
      var g = (M(), P)[m >>> 2 >>> 0];
      return g = on(m + 4, g, !0), Et(m), g;
    }, cd(m, g) {
      g instanceof ArrayBuffer && (g = new Uint8Array(g));
      var x = typeof g == "string";
      if (!(x || ArrayBuffer.isView(g) && g.BYTES_PER_ELEMENT == 1)) throw new ln("Cannot pass non-string to std::string");
      var T = x ? lr(g) : g.length, F = Br(4 + T + 1), S = F + 4;
      return (M(), P)[F >>> 2 >>> 0] = T, x ? ir(g, S, T + 1) : (M(), Q).set(g, S >>> 0), m !== null && m.push(Et, F), F;
    }, bd: so, dd(m) {
      Et(m);
    } });
  }
  var id = globalThis.TextDecoder ? new TextDecoder("utf-16le") : void 0, ey = (u, f, m) => {
    if (u >>>= 1, 16 < (f = ju((M(), q), u, f / 2, m)) - u && id) return id.decode((M(), q).slice(u, f));
    for (m = ""; u < f; ++u) {
      var g = (M(), q)[u >>> 0];
      m += String.fromCharCode(g);
    }
    return m;
  }, ty = (u, f, m) => {
    if (m ??= 2147483647, 2 > m) return 0;
    var g = f;
    m = (m -= 2) < 2 * u.length ? m / 2 : u.length;
    for (var x = 0; x < m; ++x) {
      var T = u.charCodeAt(x);
      (M(), H)[f >>> 1 >>> 0] = T, f += 2;
    }
    return (M(), H)[f >>> 1 >>> 0] = 0, f - g;
  }, ry = (u) => 2 * u.length, ny = (u, f, m) => {
    var g = "";
    u >>>= 2;
    for (var x = 0; !(x >= f / 4); x++) {
      var T = (M(), P)[u + x >>> 0];
      if (!T && !m) break;
      g += String.fromCodePoint(T);
    }
    return g;
  }, sy = (u, f, m) => {
    if (f >>>= 0, m ??= 2147483647, 4 > m) return 0;
    var g = f;
    m = g + m - 4;
    for (var x = 0; x < u.length; ++x) {
      var T = u.codePointAt(x);
      if (65535 < T && x++, (M(), B)[f >>> 2 >>> 0] = T, (f += 4) + 4 > m) break;
    }
    return (M(), B)[f >>> 2 >>> 0] = 0, f - g;
  }, ay = (u) => {
    for (var f = 0, m = 0; m < u.length; ++m) 65535 < u.codePointAt(m) && m++, f += 4;
    return f;
  };
  function oy(u, f, m) {
    if (u >>>= 0, f >>>= 0, m = qt(m >>>= 0), f === 2) var g = ey, x = ty, T = ry;
    else g = ny, x = sy, T = ay;
    or(u, { name: m, Wc: (F) => {
      var S = (M(), P)[F >>> 2 >>> 0];
      return S = g(F + 4, S * f, !0), Et(F), S;
    }, cd: (F, S) => {
      if (typeof S != "string") throw new ln(`Cannot pass non-string to C++ string type ${m}`);
      var D = T(S), U = Br(4 + D + f);
      return (M(), P)[U >>> 2 >>> 0] = D / f, x(S, U + 4, D + f), F !== null && F.push(Et, U), U;
    }, bd: so, dd(F) {
      Et(F);
    } });
  }
  function iy(u, f) {
    or(u >>>= 0, { we: !0, name: f = qt(f >>> 0), Wc: () => {
    }, cd: () => {
    } });
  }
  function ly(u) {
    bo(u >>> 0, !n, 1, !r, 131072, !1), Du();
  }
  var ft = (u) => {
    if (!C) try {
      if (u(), !(0 < Me)) try {
        s ? zs() && Mo(p) : Ja(p);
      } catch (f) {
        f instanceof be || f == "unwind" || l(0, f);
      }
    } catch (f) {
      f instanceof be || f == "unwind" || l(0, f);
    }
  }, cy = !Atomics.waitAsync || globalThis.navigator?.userAgent && 91 > Number((navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./) || [])[2]);
  function ao(u) {
    u >>>= 0, cy || (Atomics.waitAsync((M(), B), u >>> 2, u).value.then(Ss), u += 128, Atomics.store((M(), B), u >>> 2, 1));
  }
  var Ss = () => ft(() => {
    var u = zs();
    u && (ao(u), th());
  });
  function uy(u, f) {
    (u >>>= 0) == f >>> 0 ? setTimeout(Ss) : s ? postMessage({ gd: u, $c: "checkMailbox" }) : (u = Nr[u]) && u.postMessage({ $c: "checkMailbox" });
  }
  var oo = [];
  function dy(u, f, m, g, x) {
    for (f >>>= 0, x >>>= 0, oo.length = 0, m = x >>> 3, g = x + g >>> 3; m < g; ) {
      var T;
      T = (M(), J)[m++ >>> 0] ? (M(), J)[m++ >>> 0] : (M(), ce)[m++ >>> 0], oo.push(T);
    }
    return (f ? Eo[f] : r0[u])(...oo);
  }
  var hy = () => {
    Me = 0;
  };
  function fy(u) {
    u >>>= 0, s ? postMessage({ $c: "cleanupThread", Le: u }) : Nu(Nr[u]);
  }
  function _y(u) {
  }
  var Ps = (u) => {
    try {
      u();
    } catch (f) {
      ee(f);
    }
  };
  function py(u) {
    var f = (...m) => {
      Fs.push(u);
      try {
        return u(...m);
      } finally {
        C || (Fs.pop(), Ht && vr === 1 && Fs.length === 0 && (vr = 0, Me += 1, Ps(Wh), typeof Fibers < "u" && Fibers.We()));
      }
    };
    return ud.set(u, f), f;
  }
  var vr = 0, Ht = null, ld = 0, Fs = [], io = /* @__PURE__ */ new Map(), cd = /* @__PURE__ */ new Map(), ud = /* @__PURE__ */ new Map(), my = 0, lo = null, gy = [], dd = (u) => (function(f) {
    if (!C) {
      if (vr === 0) {
        var m = !1, g = !1;
        f((x = 0) => {
          if (!C && (ld = x, m = !0, g)) {
            vr = 2, Ps(() => qh(Ht)), typeof MainLoop < "u" && MainLoop.se && MainLoop.resume(), x = !1;
            try {
              var T = (function() {
                var D = (M(), B)[Ht + 8 >>> 2 >>> 0];
                return D = cd.get(D), D = ud.get(D), --Me, D();
              })();
            } catch (D) {
              T = D, x = !0;
            }
            var F = !1;
            if (!Ht) {
              var S = lo;
              S && (lo = null, (x ? S.reject : S.resolve)(T), F = !0);
            }
            if (x && !F) throw T;
          }
        }), g = !0, m || (vr = 1, Ht = (function() {
          var x = Br(65548), T = x + 12;
          if ((M(), P)[x >>> 2 >>> 0] = T, (M(), P)[x + 4 >>> 2 >>> 0] = T + 65536, T = Fs[0], !io.has(T)) {
            var F = my++;
            io.set(T, F), cd.set(F, T);
          }
          return T = io.get(T), (M(), B)[x + 8 >>> 2 >>> 0] = T, x;
        })(), typeof MainLoop < "u" && MainLoop.se && MainLoop.pause(), Ps(() => jh(Ht)));
      } else vr === 2 ? (vr = 0, Ps(Hh), Et(Ht), Ht = null, gy.forEach(ft)) : ee(`invalid state: ${vr}`);
      return ld;
    }
  })((f) => {
    u().then(f);
  });
  function wy(u) {
    return u >>>= 0, dd(async () => {
      var f = await Tt(u);
      return It(f);
    });
  }
  var co = [], vy = (u) => {
    var f = co.length;
    return co.push(u), f;
  }, yy = (u, f) => {
    for (var m = Array(u), g = 0; g < u; ++g) {
      var x = g, T = (M(), P)[f + 4 * g >>> 2 >>> 0], F = ro[T];
      if (F === void 0) throw u = `parameter ${g}`, T = Dd(T), f = qt(T), Et(T), new ln(`${u} has unknown type ${f}`);
      m[x] = F;
    }
    return m;
  }, by = (u, f, m) => {
    var g = [];
    return u = u(g, m), g.length && ((M(), P)[f >>> 2 >>> 0] = It(g)), u;
  }, My = {}, Is = (u) => {
    var f = My[u];
    return f === void 0 ? qt(u) : f;
  };
  function xy(u, f, m) {
    var [g, ...x] = yy(u, f >>> 0);
    f = g.cd.bind(g);
    var T = x.map((D) => D.bd.bind(D));
    u--;
    var F = { toValue: Tt };
    switch (u = T.map((D, U) => {
      var he = `argFromPtr${U}`;
      return F[he] = D, `${he}(args${U ? "+" + 8 * U : ""})`;
    }), m) {
      case 0:
        var S = "toValue(handle)";
        break;
      case 2:
        S = "new (toValue(handle))";
        break;
      case 3:
        S = "";
        break;
      case 1:
        F.getStringOrSymbol = Is, S = "toValue(handle)[getStringOrSymbol(methodName)]";
    }
    return S += `(${u})`, g.we || (F.toReturnWire = f, F.emval_returnValue = by, S = `return emval_returnValue(toReturnWire, destructorsRef, ${S})`), S = `return function (handle, methodName, destructorsRef, args) {
  ${S}
  }`, m = new Function(Object.keys(F), S)(...Object.values(F)), S = `methodCaller<(${x.map((D) => D.name)}) => ${g.name}>`, vy(Object.defineProperty(m, "name", { value: S }));
  }
  function ky(u, f) {
    return f >>>= 0, (u = Tt(u >>> 0)) == Tt(f);
  }
  function Ty(u) {
    return (u >>>= 0) ? (u = Is(u), It(globalThis[u])) : It(globalThis);
  }
  function Ey(u) {
    return u = Is(u >>> 0), It(t[u]);
  }
  function Ay(u, f) {
    return f >>>= 0, u = Tt(u >>> 0), f = Tt(f), It(u[f]);
  }
  function Cy(u) {
    9 < (u >>>= 0) && (Dr[u + 1] += 1);
  }
  function hd(u, f, m, g, x) {
    return co[u >>> 0](f >>> 0, m >>> 0, g >>> 0, x >>> 0);
  }
  function Sy(u, f, m, g, x) {
    return hd(u >>> 0, f >>> 0, m >>> 0, g >>> 0, x >>> 0);
  }
  function Py() {
    return It([]);
  }
  function Fy(u) {
    u = Tt(u >>> 0);
    for (var f = Array(u.length), m = 0; m < u.length; m++) f[m] = u[m];
    return It(f);
  }
  function Iy(u) {
    return It(Is(u >>> 0));
  }
  function Ly() {
    return It({});
  }
  function Oy(u) {
    for (var f = Tt(u >>>= 0); f.length; ) {
      var m = f.pop();
      f.pop()(m);
    }
    no(u);
  }
  function Ny(u, f, m) {
    f >>>= 0, m >>>= 0, u = Tt(u >>> 0), f = Tt(f), m = Tt(m), u[f] = m;
  }
  function Dy(u, f) {
    u = tt(u), f >>>= 0, u = new Date(1e3 * u), (M(), B)[f >>> 2 >>> 0] = u.getUTCSeconds(), (M(), B)[f + 4 >>> 2 >>> 0] = u.getUTCMinutes(), (M(), B)[f + 8 >>> 2 >>> 0] = u.getUTCHours(), (M(), B)[f + 12 >>> 2 >>> 0] = u.getUTCDate(), (M(), B)[f + 16 >>> 2 >>> 0] = u.getUTCMonth(), (M(), B)[f + 20 >>> 2 >>> 0] = u.getUTCFullYear() - 1900, (M(), B)[f + 24 >>> 2 >>> 0] = u.getUTCDay(), u = (u.getTime() - Date.UTC(u.getUTCFullYear(), 0, 1, 0, 0, 0, 0)) / 864e5 | 0, (M(), B)[f + 28 >>> 2 >>> 0] = u;
  }
  var fd = (u) => u % 4 == 0 && (u % 100 != 0 || u % 400 == 0), _d = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335], pd = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  function zy(u, f) {
    u = tt(u), f >>>= 0, u = new Date(1e3 * u), (M(), B)[f >>> 2 >>> 0] = u.getSeconds(), (M(), B)[f + 4 >>> 2 >>> 0] = u.getMinutes(), (M(), B)[f + 8 >>> 2 >>> 0] = u.getHours(), (M(), B)[f + 12 >>> 2 >>> 0] = u.getDate(), (M(), B)[f + 16 >>> 2 >>> 0] = u.getMonth(), (M(), B)[f + 20 >>> 2 >>> 0] = u.getFullYear() - 1900, (M(), B)[f + 24 >>> 2 >>> 0] = u.getDay();
    var m = (fd(u.getFullYear()) ? _d : pd)[u.getMonth()] + u.getDate() - 1 | 0;
    (M(), B)[f + 28 >>> 2 >>> 0] = m, (M(), B)[f + 36 >>> 2 >>> 0] = -60 * u.getTimezoneOffset(), m = new Date(u.getFullYear(), 6, 1).getTimezoneOffset();
    var g = new Date(u.getFullYear(), 0, 1).getTimezoneOffset();
    u = 0 | (m != g && u.getTimezoneOffset() == Math.min(g, m)), (M(), B)[f + 32 >>> 2 >>> 0] = u;
  }
  function By(u) {
    u >>>= 0;
    var f = new Date((M(), B)[u + 20 >>> 2 >>> 0] + 1900, (M(), B)[u + 16 >>> 2 >>> 0], (M(), B)[u + 12 >>> 2 >>> 0], (M(), B)[u + 8 >>> 2 >>> 0], (M(), B)[u + 4 >>> 2 >>> 0], (M(), B)[u >>> 2 >>> 0], 0), m = (M(), B)[u + 32 >>> 2 >>> 0], g = f.getTimezoneOffset(), x = new Date(f.getFullYear(), 6, 1).getTimezoneOffset(), T = new Date(f.getFullYear(), 0, 1).getTimezoneOffset(), F = Math.min(T, x);
    return 0 > m ? (M(), B)[u + 32 >>> 2 >>> 0] = +(x != T && F == g) : 0 < m != (F == g) && (x = Math.max(T, x), f.setTime(f.getTime() + 6e4 * ((0 < m ? F : x) - g))), (M(), B)[u + 24 >>> 2 >>> 0] = f.getDay(), m = (fd(f.getFullYear()) ? _d : pd)[f.getMonth()] + f.getDate() - 1 | 0, (M(), B)[u + 28 >>> 2 >>> 0] = m, (M(), B)[u >>> 2 >>> 0] = f.getSeconds(), (M(), B)[u + 4 >>> 2 >>> 0] = f.getMinutes(), (M(), B)[u + 8 >>> 2 >>> 0] = f.getHours(), (M(), B)[u + 12 >>> 2 >>> 0] = f.getDate(), (M(), B)[u + 16 >>> 2 >>> 0] = f.getMonth(), (M(), B)[u + 20 >>> 2 >>> 0] = f.getYear(), u = f.getTime(), BigInt(isNaN(u) ? -1 : u / 1e3);
  }
  function md(u, f, m, g, x, T, F) {
    return s ? Fe(16, 1, u, f, m, g, x, T, F) : -52;
  }
  function gd(u, f, m, g, x, T) {
    if (s) return Fe(17, 1, u, f, m, g, x, T);
  }
  var Hn = {}, Ry = () => performance.timeOrigin + performance.now();
  function wd(u, f) {
    if (s) return Fe(18, 1, u, f);
    if (Hn[u] && (clearTimeout(Hn[u].id), delete Hn[u]), !f) return 0;
    var m = setTimeout(() => {
      delete Hn[u], ft(() => eh(u, performance.timeOrigin + performance.now()));
    }, f);
    return Hn[u] = { id: m, Ve: f }, 0;
  }
  function $y(u, f, m, g) {
    u >>>= 0, f >>>= 0, m >>>= 0, g >>>= 0;
    var x = (/* @__PURE__ */ new Date()).getFullYear(), T = new Date(x, 0, 1).getTimezoneOffset();
    x = new Date(x, 6, 1).getTimezoneOffset();
    var F = Math.max(T, x);
    (M(), P)[u >>> 2 >>> 0] = 60 * F, (M(), B)[f >>> 2 >>> 0] = +(T != x), u = (f = (S) => {
      var D = Math.abs(S);
      return `UTC${0 <= S ? "-" : "+"}${String(Math.floor(D / 60)).padStart(2, "0")}${String(D % 60).padStart(2, "0")}`;
    })(T), f = f(x), x < T ? (ir(u, m, 17), ir(f, g, 17)) : (ir(u, g, 17), ir(f, m, 17));
  }
  var Gy = () => Date.now(), Vy = 1;
  function Uy(u, f, m) {
    if (m >>>= 0, !(0 <= u && 3 >= u)) return 28;
    if (u === 0) u = Date.now();
    else {
      if (!Vy) return 52;
      u = performance.timeOrigin + performance.now();
    }
    return u = Math.round(1e6 * u), (M(), J)[m >>> 3 >>> 0] = BigInt(u), 0;
  }
  var uo = [], vd = (u, f) => {
    uo.length = 0;
    for (var m; m = (M(), Q)[u++ >>> 0]; ) {
      var g = m != 105;
      f += (g &= m != 112) && f % 8 ? 4 : 0, uo.push(m == 112 ? (M(), P)[f >>> 2 >>> 0] : m == 106 ? (M(), J)[f >>> 3 >>> 0] : m == 105 ? (M(), B)[f >>> 2 >>> 0] : (M(), ce)[f >>> 3 >>> 0]), f += g ? 8 : 4;
    }
    return uo;
  };
  function jy(u, f, m) {
    return u >>>= 0, f = vd(f >>> 0, m >>> 0), Eo[u](...f);
  }
  function Wy(u, f, m) {
    return u >>>= 0, f = vd(f >>> 0, m >>> 0), Eo[u](...f);
  }
  var qy = () => {
  };
  function Hy(u, f) {
    return E(on(u >>> 0, f >>> 0));
  }
  var Qy = () => {
    throw Me += 1, "unwind";
  };
  function Xy() {
    return 4294901760;
  }
  var Yy = () => 1, Ky = () => navigator.hardwareConcurrency, zr = {}, yd = (u) => {
    var f = lr(u) + 1, m = Br(f);
    return m && ir(u, m, f), m;
  }, Ls = (u) => {
    var f;
    return (f = /\bwasm-function\[\d+\]:(0x[0-9a-f]+)/.exec(u)) ? +f[1] : (f = /:(\d+):\d+(?:\)|$)/.exec(u)) ? 2147483648 | +f[1] : 0;
  }, bd = (u) => {
    for (var f of u) (u = Ls(f)) && (zr[u] = f);
  };
  function Jy() {
    var u = Error().stack.toString().split(`
`);
    return u[0] == "Error" && u.shift(), bd(u), zr.ee = Ls(u[3]), zr.xe = u, zr.ee;
  }
  function Os(u) {
    if (!(u = zr[u >>> 0])) return 0;
    var f;
    if (f = /^\s+at .*\.wasm\.(.*) \(.*\)$/.exec(u)) u = f[1];
    else if (f = /^\s+at (.*) \(.*\)$/.exec(u)) u = f[1];
    else {
      if (!(f = /^(.+?)@/.exec(u))) return 0;
      u = f[1];
    }
    return Et(Os.ne ?? 0), Os.ne = yd(u), Os.ne;
  }
  function Zy(u) {
    u >>>= 0;
    var f = (M(), Q).length;
    if (u <= f || 4294901760 < u) return !1;
    for (var m = 1; 4 >= m; m *= 2) {
      var g = f * (1 + 0.2 / m);
      g = Math.min(g, u + 100663296);
      e: {
        g = (Math.min(4294901760, 65536 * Math.ceil(Math.max(u, g) / 65536)) - wr.buffer.byteLength + 65535) / 65536 | 0;
        try {
          wr.grow(g), G();
          var x = 1;
          break e;
        } catch {
        }
        x = void 0;
      }
      if (x) return !0;
    }
    return !1;
  }
  function eb(u, f, m) {
    if (u >>>= 0, f >>>= 0, zr.ee == u) var g = zr.xe;
    else (g = Error().stack.toString().split(`
`))[0] == "Error" && g.shift(), bd(g);
    for (var x = 3; g[x] && Ls(g[x]) != u; ) ++x;
    for (u = 0; u < m && g[u + x]; ++u) (M(), B)[f + 4 * u >>> 2 >>> 0] = Ls(g[u + x]);
    return u;
  }
  var Qt = (u) => {
    var f = lr(u) + 1, m = Bs(f);
    return ir(u, m, f), m;
  }, cn = (u) => (M(), P)[u >>> 2 >>> 0] + 4294967296 * (M(), B)[u + 4 >>> 2 >>> 0], rt = [], Md = (u, f) => {
    rt[u >>> 0] = f;
  }, cr = [], Ns = [], un = (u, f) => {
    Ns[u] = new Promise((m) => f.finally(() => m(u)));
  }, Z = (u) => {
    if (u) return rt[u >>> 0];
  }, ho = (u, f) => {
    for (u = (M(), P)[u >>> 2 >>> 0]; u; u = (M(), P)[u >>> 2 >>> 0]) f[(M(), B)[u + 4 >>> 2 >>> 0]](u);
  }, Ds = (u, f, m) => {
    (M(), P)[u >>> 2 >>> 0] = f, (M(), P)[u + 4 >>> 2 >>> 0] = m;
  }, xd = (u) => {
    var f = (M(), P)[u >>> 2 >>> 0];
    return u = (M(), P)[u + 4 >>> 2 >>> 0], on(f, u);
  }, Lt = (u) => {
    var f = (M(), P)[u >>> 2 >>> 0];
    return u = (M(), P)[u + 4 >>> 2 >>> 0], f ? on(f, u) : u === 0 ? "" : void 0;
  }, tb = (u) => {
    var f = Lt(u + 4), m = (m = (M(), P)[u + 12 >>> 2 >>> 0]) ? Z(m) : "auto";
    if (u += 16) {
      var g = Z((M(), P)[u + 4 >>> 2 >>> 0]), x = (M(), P)[u + 16 >>> 2 >>> 0], T = (M(), P)[u + 20 >>> 2 >>> 0];
      if (x) {
        for (var F = {}, S = 0; S < x; ++S) {
          var D = T + 24 * S;
          F[xd(D + 4)] = (M(), ce)[D + 16 >>> 3 >>> 0];
        }
        x = F;
      } else x = void 0;
      u = { module: g, constants: x, entryPoint: Lt(u + 8) };
    } else u = void 0;
    return { label: f, layout: m, compute: u };
  }, kd = (u, f) => {
    function m(T, F, S, D = 0) {
      T = u[T] ?? D, (M(), P)[F + S >>> 2 >>> 0] = T;
    }
    function g(T, F, S, D = 0) {
      F += S, T = u[T] ?? D, (M(), P)[F >>> 2 >>> 0] = T, D = (M(), P)[F >>> 2 >>> 0], (M(), P)[F + 4 >>> 2 >>> 0] = (T - D) / 4294967296;
    }
    var x = (M(), P)[f >>> 2 >>> 0];
    m("maxTextureDimension1D", f, 4), m("maxTextureDimension2D", f, 8), m("maxTextureDimension3D", f, 12), m("maxTextureArrayLayers", f, 16), m("maxBindGroups", f, 20), m("maxBindGroupsPlusVertexBuffers", f, 24), m("maxBindingsPerBindGroup", f, 28), m("maxDynamicUniformBuffersPerPipelineLayout", f, 32), m("maxDynamicStorageBuffersPerPipelineLayout", f, 36), m("\u006daxSampledTexturesPerShaderStage", f, 40), m("maxSamplersPerShaderStage", f, 44), m("maxStorageBuffersPerShaderStage", f, 48), m("\u006daxStorageTexturesPerShaderStage", f, 52), m("maxUniformBuffersPerShaderStage", f, 56), m("minUniformBufferOffsetAlignment", f, 80), m("minStorageBufferOffsetAlignment", f, 84), g("maxUniformBufferBindingSize", f, 64), g("maxStorageBufferBindingSize", f, 72), m("maxVertexBuffers", f, 88), g("maxBufferSize", f, 96), m("maxVertexAttributes", f, 104), m("maxVertexBufferArrayStride", f, 108), m("maxInterStageShaderVariables", f, 112), m("maxColorAttachments", f, 116), m("\u006daxColorAttachmentBytesPerSample", f, 120), m("maxComputeWorkgroupStorageSize", f, 124), m("maxComputeInvocationsPerWorkgroup", f, 128), m("maxComputeWorkgroupSizeX", f, 132), m("maxComputeWorkgroupSizeY", f, 136), m("maxComputeWorkgroupSizeZ", f, 140), m("\u006daxComputeWorkgroupsPerDimension", f, 144), m("maxImmediateSize", f, 148), x !== 0 && (M(), m("maxStorageBuffersInVertexStage", x, 8, u.maxStorageBuffersPerShaderStage), m("\u006daxStorageBuffersInFragmentStage", x, 16, u.maxStorageBuffersPerShaderStage), m("maxStorageTexturesInVertexStage", x, 12, u.\u006daxStorageTexturesPerShaderStage), m("maxStorageTexturesInFragmentStage", x, 20, u.\u006daxStorageTexturesPerShaderStage));
  }, rb = (u, f) => {
    (M(), P)[f + 52 >>> 2 >>> 0] = u.subgroupMinSize, (M(), P)[f + 56 >>> 2 >>> 0] = u.subgroupMaxSize;
    var m = yd(u.vendor + u.architecture + u.device + u.description), g = lr(u.vendor);
    Ds(f + 4, m, g), m += g, g = lr(u.architecture), Ds(f + 12, m, g), m += g, g = lr(u.device), Ds(f + 20, m, g), m += g, g = lr(u.description), Ds(f + 28, m, g), m += g, (M(), B)[f + 36 >>> 2 >>> 0] = 2, m = u.isFallbackAdapter ? 3 : 4, (M(), B)[f + 40 >>> 2 >>> 0] = m, (M(), P)[f + 44 >>> 2 >>> 0] = 0, (M(), P)[f + 48 >>> 2 >>> 0] = 0, ho(f, { 327739: (x) => {
      let T = 0, F = 0;
      if (u.subgroupMatrixConfigs) {
        T = u.subgroupMatrixConfigs.length, F = Br(20 * T);
        for (let [S, D] of u.subgroupMatrixConfigs.entries()) {
          let U = F + 20 * S, he = Ed.indexOf(D.componentType), _e = Ed.indexOf(D.resultComponentType);
          (M(), B)[U >>> 2 >>> 0] = he, (M(), B)[U + 4 >>> 2 >>> 0] = _e, (M(), P)[U + 8 >>> 2 >>> 0] = D.M, (M(), P)[U + 12 >>> 2 >>> 0] = D.N, (M(), P)[U + 16 >>> 2 >>> 0] = D.K;
        }
      }
      (M(), P)[x + 12 >>> 2 >>> 0] = F, (M(), P)[x + 8 >>> 2 >>> 0] = T;
    } });
  }, nb = [, , "uniform", "storage", "read-only-storage"], sb = [, "validation", "out-of-memory", "internal"], ab = [, "compatibility", "core"], Td = { 1: "core-features-and-limits", 2: "depth-clip-control", 3: "depth32float-stencil8", 4: "texture-compression-bc", 5: "texture-compression-bc-sliced-3d", 6: "texture-compression-etc2", 7: "texture-compression-astc", 8: "texture-compression-astc-sliced-3d", 9: "timestamp-query", 10: "indirect-first-instance", 11: "shader-f16", 12: "rg11b10ufloat-renderable", 13: "bgra8unorm-storage", 14: "float32-filterable", 15: "float32-blendable", 16: "clip-distances", 17: "dual-source-blending", 18: "subgroups", 19: "texture-formats-tier1", 20: "texture-formats-tier2", 21: "primitive-index", 22: "texture-component-swizzle", 23: "subgroup-size-control", 327692: "chromium-experimental-unorm16-texture-formats", 327729: "chromium-experimental-multi-draw-indirect", 327732: "chromium-experimental-subgroup-matrix" }, ob = [, "low-power", "high-performance"], ib = [, "occlusion", "timestamp"], lb = [, , "filtering", "non-filtering", "comparison"], cb = [, , "write-only", "read-only", "read-write"], Ed = [, "f32", "f16", "u32", "i32", "u8", "i8"], ub = [, "r8unorm", "r8snorm", "r8uint", "r8sint", "r16unorm", "r16snorm", "r16uint", "r16sint", "r16float", "rg8unorm", "rg8snorm", "rg8uint", "rg8sint", "r32float", "r32uint", "r32sint", "rg16unorm", "rg16snorm", "rg16uint", "rg16sint", "rg16float", "rgba8unorm", "rgba8unorm-srgb", "rgba8snorm", "rgba8uint", "rgba8sint", "bgra8unorm", "bgra8unorm-srgb", "rgb10a2uint", "rgb10a2unorm", "rg11b10ufloat", "rgb9e5ufloat", "rg32float", "rg32uint", "rg32sint", "rgba16unorm", "rgba16snorm", "rgba16uint", "rgba16sint", "rgba16float", "rgba32float", "rgba32uint", "rgba32sint", "stencil8", "depth16unorm", "depth24plus", "depth24plus-stencil8", "depth32float", "depth32float-stencil8", "bc1-rgba-unorm", "bc1-rgba-unorm-srgb", "bc2-rgba-unorm", "bc2-rgba-unorm-srgb", "bc3-rgba-unorm", "bc3-rgba-unorm-srgb", "bc4-r-unorm", "bc4-r-snorm", "bc5-rg-unorm", "bc5-rg-snorm", "bc6h-rgb-ufloat", "bc6h-rgb-float", "bc7-rgba-unorm", "bc7-rgba-unorm-srgb", "etc2-rgb8unorm", "etc2-rgb8unorm-srgb", "etc2-rgb8a1unorm", "etc2-rgb8a1unorm-srgb", "etc2-rgba8unorm", "etc2-rgba8unorm-srgb", "eac-r11unorm", "eac-r11snorm", "eac-rg11unorm", "eac-rg11snorm", "astc-4x4-unorm", "astc-4x4-unorm-srgb", "astc-5x4-unorm", "astc-5x4-unorm-srgb", "astc-5x5-unorm", "astc-5x5-unorm-srgb", "astc-6x5-unorm", "astc-6x5-unorm-srgb", "astc-6x6-unorm", "astc-6x6-unorm-srgb", "astc-8x5-unorm", "astc-8x5-unorm-srgb", "astc-8x6-unorm", "astc-8x6-unorm-srgb", "astc-8x8-unorm", "astc-8x8-unorm-srgb", "astc-10x5-unorm", "astc-10x5-unorm-srgb", "astc-10x6-unorm", "astc-10x6-unorm-srgb", "astc-10x8-unorm", "astc-10x8-unorm-srgb", "astc-10x10-unorm", "astc-10x10-unorm-srgb", "astc-12x10-unorm", "astc-12x10-unorm-srgb", "astc-12x12-unorm", "astc-12x12-unorm-srgb"], db = [, , "float", "unfilterable-float", "depth", "sint", "uint"], Ad = [, "1d", "2d", "2d-array", "cube", "cube-array", "3d"], hb = { undefined: 1, unknown: 1, destroyed: 2 };
  function fb(u, f, m, g, x, T) {
    f = tt(f), m = tt(m), g >>>= 0, x >>>= 0, T >>>= 0;
    var F = Z(u >>> 0);
    if (u = {}, T) {
      var S = (M(), P)[T + 12 >>> 2 >>> 0];
      if (S) {
        var D = (M(), P)[T + 16 >>> 2 >>> 0];
        u.requiredFeatures = Array.from((M(), P).subarray(D >>> 2 >>> 0, D + 4 * S >>> 2 >>> 0), (Y) => Td[Y]);
      }
      if (S = (M(), P)[T + 20 >>> 2 >>> 0]) {
        let Y = function(_t, lt, Rr, $r = !1) {
          lt += Rr, (lt = (M(), P)[lt >>> 2 >>> 0]) == 4294967295 || $r && lt == 0 || (_e[_t] = lt);
        }, ke = function(_t, lt, Rr) {
          lt += Rr, Rr = (M(), P)[lt >>> 2 >>> 0];
          var $r = (M(), P)[lt + 4 >>> 2 >>> 0];
          Rr == 4294967295 && $r == 4294967295 || (_e[_t] = cn(lt));
        };
        var U = Y, he = ke;
        D = (M(), P)[S >>> 2 >>> 0];
        var _e = {};
        Y("maxTextureDimension1D", S, 4), Y("maxTextureDimension2D", S, 8), Y("maxTextureDimension3D", S, 12), Y("maxTextureArrayLayers", S, 16), Y("maxBindGroups", S, 20), Y("maxBindGroupsPlusVertexBuffers", S, 24), Y("maxBindingsPerBindGroup", S, 28), Y("maxDynamicUniformBuffersPerPipelineLayout", S, 32), Y("maxDynamicStorageBuffersPerPipelineLayout", S, 36), Y("\u006daxSampledTexturesPerShaderStage", S, 40), Y("maxSamplersPerShaderStage", S, 44), Y("maxStorageBuffersPerShaderStage", S, 48), Y("\u006daxStorageTexturesPerShaderStage", S, 52), Y("maxUniformBuffersPerShaderStage", S, 56), Y("minUniformBufferOffsetAlignment", S, 80), Y("minStorageBufferOffsetAlignment", S, 84), ke("maxUniformBufferBindingSize", S, 64), ke("maxStorageBufferBindingSize", S, 72), Y("maxVertexBuffers", S, 88), ke("maxBufferSize", S, 96), Y("maxVertexAttributes", S, 104), Y("maxVertexBufferArrayStride", S, 108), Y("maxInterStageShaderVariables", S, 112), Y("maxColorAttachments", S, 116), Y("\u006daxColorAttachmentBytesPerSample", S, 120), Y("maxComputeWorkgroupStorageSize", S, 124), Y("maxComputeInvocationsPerWorkgroup", S, 128), Y("maxComputeWorkgroupSizeX", S, 132), Y("maxComputeWorkgroupSizeY", S, 136), Y("maxComputeWorkgroupSizeZ", S, 140), Y("\u006daxComputeWorkgroupsPerDimension", S, 144), Y("maxImmediateSize", S, 148, !0), D !== 0 && (M(), "maxStorageBuffersInVertexStage" in GPUSupportedLimits.prototype && (Y("maxStorageBuffersInVertexStage", D, 8), Y("maxStorageTexturesInVertexStage", D, 12), Y("\u006daxStorageBuffersInFragmentStage", D, 16), Y("maxStorageTexturesInFragmentStage", D, 20))), u.requiredLimits = _e;
      }
      (S = (M(), P)[T + 24 >>> 2 >>> 0]) && (S = { label: Lt(S + 4) }, u.defaultQueue = S), u.label = Lt(T + 4);
    }
    Me += 1, un(f, F.requestDevice(u).then((Y) => {
      --Me, ft(() => {
        rt[x >>> 0] = Y.queue, rt[g >>> 0] = Y, Me += 1, un(m, Y.lost.then((ke) => {
          ft(() => {
            Y.onuncapturederror = () => {
            };
            var _t = re(), lt = Qt(ke.message);
            go(m, hb[ke.reason], lt), te(_t);
          }), --Me;
        })), Y.onuncapturederror = (ke) => {
          var _t = 5;
          ke.error instanceof GPUValidationError ? _t = 2 : ke.error instanceof GPUOutOfMemoryError ? _t = 3 : ke.error instanceof GPUInternalError && (_t = 4);
          var lt = re();
          ke = Qt(ke.error.message), Yd(g, _t, ke), te(lt);
        }, "adapterInfo" in Y || (Y.adapterInfo = F.info), yo(f, 1, g, 0);
      });
    }, (Y) => {
      --Me, ft(() => {
        var ke = re(), _t = Qt(Y.message);
        yo(f, 3, g, _t), m && go(m, 4, _t), te(ke);
      });
    }));
  }
  function _b(u) {
    var f = Z(u >>>= 0), m = cr[u];
    if (m) {
      for (var g = 0; g < m.length; ++g) m[g]();
      delete cr[u];
    }
    f.destroy();
  }
  function pb(u, f, m) {
    m >>>= 0;
    var g = Z(u >>>= 0);
    m == 4294967295 && (m = void 0);
    try {
      var x = g.getMappedRange(f >>> 0, m);
    } catch {
      return 0;
    }
    var T = xo(16, x.byteLength);
    return (M(), Q).set(new Uint8Array(x), T >>> 0), cr[u].push(() => Et(T)), T;
  }
  function mb(u, f, m) {
    m >>>= 0;
    var g = Z(u >>>= 0);
    m == 4294967295 && (m = void 0);
    try {
      var x = g.getMappedRange(f >>> 0, m);
    } catch {
      return 0;
    }
    var T = xo(16, x.byteLength);
    return (M(), Q).fill(0, T, x.byteLength), cr[u].push(() => {
      new Uint8Array(x).set((M(), Q).subarray(T >>> 0, T + x.byteLength >>> 0)), Et(T);
    }), T;
  }
  function gb(u, f, m, g, x) {
    u >>>= 0, f = tt(f), m = tt(m), x >>>= 0;
    var T = Z(u);
    cr[u] = [], x == 4294967295 && (x = void 0), Me += 1, un(f, T.mapAsync(m, g >>> 0, x).then(() => {
      --Me, ft(() => {
        wo(f, 1, 0);
      });
    }, (F) => {
      --Me, ft(() => {
        re();
        var S = Qt(F.message);
        wo(f, F.name === "AbortError" ? 4 : F.name === "OperationError" ? 3 : 0, S), delete cr[u];
      });
    }));
  }
  function wb(u) {
    var f = Z(u >>>= 0), m = cr[u];
    if (m) {
      for (var g = 0; g < m.length; ++g) m[g]();
      delete cr[u], f.unmap();
    }
  }
  function vb(u) {
    delete rt[u >>> 0];
  }
  function yb(u, f, m) {
    u >>>= 0, f >>>= 0, m >>>= 0;
    var g = !!(M(), P)[f + 32 >>> 2 >>> 0];
    f = { label: Lt(f + 4), usage: (M(), P)[f + 16 >>> 2 >>> 0], size: cn(f + 24), mappedAtCreation: g }, u = Z(u);
    try {
      var x = u.createBuffer(f);
    } catch {
      return !1;
    }
    return rt[m >>> 0] = x, g && (cr[m] = []), !0;
  }
  function bb(u, f, m, g) {
    u >>>= 0, f = tt(f), g >>>= 0, m = tb(m >>> 0), u = Z(u), Me += 1, un(f, u.createComputePipelineAsync(m).then((x) => {
      --Me, ft(() => {
        rt[g >>> 0] = x, mo(f, 1, g, 0);
      });
    }, (x) => {
      --Me, ft(() => {
        var T = re(), F = Qt(x.message);
        mo(f, x.reason === "validation" ? 3 : x.reason === "internal" ? 4 : 0, g, F), te(T);
      });
    }));
  }
  function Mb(u, f, m) {
    u >>>= 0, f >>>= 0, m >>>= 0;
    var g = (M(), P)[f >>> 2 >>> 0], x = (M(), B)[g + 4 >>> 2 >>> 0];
    f = { label: Lt(f + 4), code: "" }, x === 2 && (f.code = xd(g + 8)), u = Z(u).createShaderModule(f), rt[m >>> 0] = u;
  }
  var xb = (u) => {
    (u = Z(u)).onuncapturederror = null, u.destroy();
  };
  function kb(u, f) {
    f = tt(f), u = Z(u >>> 0), Me += 1, un(f, u.popErrorScope().then((m) => {
      --Me, ft(() => {
        var g = 5;
        m ? m instanceof GPUValidationError ? g = 2 : m instanceof GPUOutOfMemoryError ? g = 3 : m instanceof GPUInternalError && (g = 4) : g = 1;
        var x = re(), T = m ? Qt(m.message) : 0;
        vo(f, 1, g, T), te(x);
      });
    }, (m) => {
      --Me, ft(() => {
        var g = re(), x = Qt(m.message);
        vo(f, 1, 5, x), te(g);
      });
    }));
  }
  function Tb(u, f, m, g) {
    if (f = tt(f), g >>>= 0, m >>>= 0) {
      var x = { featureLevel: ab[(M(), B)[m + 4 >>> 2 >>> 0]], powerPreference: ob[(M(), B)[m + 8 >>> 2 >>> 0]], forceFallbackAdapter: !!(M(), P)[m + 12 >>> 2 >>> 0] };
      (u = (M(), P)[m >>> 2 >>> 0]) !== 0 && (M(), x.Ye = !!(M(), P)[u + 8 >>> 2 >>> 0]);
    }
    "gpu" in navigator ? (Me += 1, un(f, navigator.gpu.requestAdapter(x).then((T) => {
      --Me, ft(() => {
        if (T) rt[g >>> 0] = T, Qn(f, 1, g, 0);
        else {
          var F = re(), S = Qt("WebGPU not available on this browser (requestAdapter returned null)");
          Qn(f, 3, g, S), te(F);
        }
      });
    }, (T) => {
      --Me, ft(() => {
        var F = re(), S = Qt(T.message);
        Qn(f, 4, g, S), te(F);
      });
    }))) : (x = re(), u = Qt("WebGPU not available on this browser (navigator.gpu is not available)"), Qn(f, 3, g, u), te(x));
  }
  function Eb(u, f, m) {
    return u >>>= 0, f >>>= 0, m >>>= 0, dd(async () => {
      var g = [];
      if (m) {
        var x = (M(), B)[m >>> 2 >>> 0];
        g.length = f + 1, g[f] = new Promise((S) => setTimeout(S, x, 0));
      } else g.length = f;
      for (var T = 0; T < f; ++T) {
        var F = cn(u + 8 * T);
        if (!(F in Ns)) return F;
        g[T] = Ns[F];
      }
      return g = await Promise.race(g), delete Ns[g], g;
    });
  }
  var fo, _o = {}, Cd = () => {
    if (!fo) {
      var u, f = { USER: "web_user", LOGNAME: "web_user", PATH: "/", PWD: "/", HOME: "/home/web_user", LANG: (globalThis.navigator?.language ?? "C").replace("-", "_") + ".UTF-8", _: "./this.program" };
      for (u in _o) _o[u] === void 0 ? delete f[u] : f[u] = _o[u];
      var m = [];
      for (u in f) m.push(`${u}=${f[u]}`);
      fo = m;
    }
    return fo;
  };
  function Sd(u, f) {
    if (s) return Fe(19, 1, u, f);
    u >>>= 0, f >>>= 0;
    var m, g = 0, x = 0;
    for (m of Cd()) {
      var T = f + g;
      (M(), P)[u + x >>> 2 >>> 0] = T, g += ir(m, T, 1 / 0) + 1, x += 4;
    }
    return 0;
  }
  function Pd(u, f) {
    if (s) return Fe(20, 1, u, f);
    u >>>= 0, f >>>= 0;
    var m = Cd();
    for (var g of ((M(), P)[u >>> 2 >>> 0] = m.length, u = 0, m)) u += lr(g) + 1;
    return (M(), P)[f >>> 2 >>> 0] = u, 0;
  }
  function Fd(u) {
    return s ? Fe(21, 1, u) : 52;
  }
  function Id(u, f, m, g, x) {
    return s ? Fe(22, 1, u, f, m, g, x) : 52;
  }
  function Ld(u, f, m, g) {
    return s ? Fe(23, 1, u, f, m, g) : 52;
  }
  function Od(u, f, m, g) {
    return s ? Fe(24, 1, u, f, m, g) : 70;
  }
  var Ab = [null, [], []];
  function Nd(u, f, m, g) {
    if (s) return Fe(25, 1, u, f, m, g);
    f >>>= 0, m >>>= 0, g >>>= 0;
    for (var x = 0, T = 0; T < m; T++) {
      var F = (M(), P)[f >>> 2 >>> 0], S = (M(), P)[f + 4 >>> 2 >>> 0];
      f += 8;
      for (var D = 0; D < S; D++) {
        var U = u, he = (M(), Q)[F + D >>> 0], _e = Ab[U];
        he === 0 || he === 10 ? ((U === 1 ? A : E)(Wu(_e)), _e.length = 0) : _e.push(he);
      }
      x += S;
    }
    return (M(), P)[g >>> 2 >>> 0] = x, 0;
  }
  function Cb(u) {
    return u >>> 0;
  }
  function Sb(u, f) {
    return kd(Z(u >>> 0).limits, f >>> 0), 1;
  }
  function Pb(u, f) {
    return Z(u >>> 0).features.has(Td[f]);
  }
  function Fb(u) {
    return BigInt(Z(u >>> 0).size);
  }
  function Ib(u) {
    return BigInt(Z(u >>> 0).usage);
  }
  function Lb(u, f) {
    if (u >>>= 0, f >>>= 0) {
      var m = Lt(f + 4);
      m = { label: m, timestampWrites: f = (f = (M(), P)[f + 12 >>> 2 >>> 0]) !== 0 ? { querySet: Z((M(), P)[f + 4 >>> 2 >>> 0]), beginningOfPassWriteIndex: (M(), P)[f + 8 >>> 2 >>> 0], endOfPassWriteIndex: (M(), P)[f + 12 >>> 2 >>> 0] } : void 0 };
    }
    return f = Z(u), u = jd(0), m = f.beginComputePass(m), rt[u >>> 0] = m, u;
  }
  function Ob(u, f, m, g) {
    m = tt(m), (g = tt(g)) == -1 && (g = void 0), (u = Z(u >>> 0)).clearBuffer(Z(f >>> 0), m, g);
  }
  function Nb(u, f, m, g, x, T) {
    m = tt(m), x = tt(x), T = tt(T), Z(u >>> 0).copyBufferToBuffer(Z(f >>> 0), m, Z(g >>> 0), x, T);
  }
  function Db(u) {
    var f = Z(u >>> 0);
    return u = Vd(0), f = f.finish(), rt[u >>> 0] = f, u;
  }
  function zb(u, f, m, g, x, T) {
    T = tt(T), Z(u >>> 0).resolveQuerySet(Z(f >>> 0), m, g, Z(x >>> 0), T);
  }
  function Bb(u, f, m, g) {
    Z(u >>> 0).dispatchWorkgroups(f, m, g);
  }
  function Rb(u, f, m) {
    m = tt(m), Z(u >>> 0).dispatchWorkgroupsIndirect(Z(f >>> 0), m);
  }
  function $b(u) {
    Z(u >>> 0).end();
  }
  function Gb(u, f, m, g, x) {
    g >>>= 0, x >>>= 0, u = Z(u >>> 0), m = Z(m >>> 0), g == 0 ? u.setBindGroup(f, m) : u.setBindGroup(f, m, (M(), P), x >>> 2, g);
  }
  function Vb(u, f) {
    Z(u >>> 0).setPipeline(Z(f >>> 0));
  }
  function Ub(u, f, m) {
    Z(u >>> 0).Xe(Z(f >>> 0), m);
  }
  function jb(u, f) {
    function m(x) {
      var T = (M(), P)[x + 8 >>> 2 >>> 0], F = (M(), P)[x + 32 >>> 2 >>> 0], S = (M(), P)[x + 36 >>> 2 >>> 0], D = 0;
      return ho(x, { 14: (U) => {
        D = (M(), P)[U + 8 >>> 2 >>> 0];
      } }), T ? ((F = cn(x + 24)) == -1 && (F = void 0), T = { buffer: Z(T), offset: cn(x + 16), size: F }) : T = Z(F || S || D), { binding: (M(), P)[x + 4 >>> 2 >>> 0], resource: T };
    }
    u >>>= 0, f = { label: Lt((f >>>= 0) + 4), layout: Z((M(), P)[f + 12 >>> 2 >>> 0]), entries: (function(x, T) {
      for (var F = [], S = 0; S < x; ++S) F.push(m(T + 40 * S));
      return F;
    })((M(), P)[f + 16 >>> 2 >>> 0], (M(), P)[f + 20 >>> 2 >>> 0]) }, u = Z(u);
    var g = $d(0);
    return Md(g, u.createBindGroup(f)), g;
  }
  function Wb(u, f) {
    function m(D) {
      var U = (M(), P)[D + 4 >>> 2 >>> 0];
      if (U) return { type: nb[U], hasDynamicOffset: !!(M(), P)[D + 8 >>> 2 >>> 0], minBindingSize: cn(D + 16) };
    }
    function g(D) {
      if (D = (M(), P)[D + 4 >>> 2 >>> 0]) return { type: lb[D] };
    }
    function x(D) {
      var U = (M(), P)[D + 4 >>> 2 >>> 0];
      if (U) return { sampleType: db[U], viewDimension: Ad[(M(), B)[D + 8 >>> 2 >>> 0]], multisampled: !!(M(), P)[D + 12 >>> 2 >>> 0] };
    }
    function T(D) {
      var U = (M(), P)[D + 4 >>> 2 >>> 0];
      if (U) return { access: cb[U], format: ub[(M(), B)[D + 8 >>> 2 >>> 0]], viewDimension: Ad[(M(), B)[D + 12 >>> 2 >>> 0]] };
    }
    function F(D) {
      var U = { binding: (M(), P)[D + 4 >>> 2 >>> 0], visibility: (M(), P)[D + 8 >>> 2 >>> 0], buffer: m(D + 24), sampler: g(D + 48), texture: x(D + 56), storageTexture: T(D + 72) };
      return ho(D, { 13: () => {
        U.externalTexture = {};
      } }), U;
    }
    u >>>= 0, f = { label: Lt((f >>>= 0) + 4), entries: (function(D, U) {
      for (var he = [], _e = 0; _e < D; ++_e) he.push(F(U + 88 * _e));
      return he;
    })((M(), P)[f + 12 >>> 2 >>> 0], (M(), P)[f + 16 >>> 2 >>> 0]) }, u = Z(u);
    var S = Gd(0);
    return Md(S, u.createBindGroupLayout(f)), S;
  }
  function qb(u, f) {
    var m;
    return u >>>= 0, (f >>>= 0) && (m = { label: Lt(f + 4) }), f = Z(u), u = Ud(0), m = f.createCommandEncoder(m), rt[u >>> 0] = m, u;
  }
  function Hb(u, f) {
    u >>>= 0, f >>>= 0;
    for (var m = (M(), P)[f + 12 >>> 2 >>> 0], g = (M(), P)[f + 16 >>> 2 >>> 0], x = [], T = 0; T < m; ++T) x.push(Z((M(), P)[g + 4 * T >>> 2 >>> 0]));
    return f = { label: Lt(f + 4), bindGroupLayouts: x, immediateSize: (M(), P)[f + 20 >>> 2 >>> 0] }, m = Z(u), u = Wd(0), f = m.createPipelineLayout(f), rt[u >>> 0] = f, u;
  }
  function Qb(u, f) {
    u >>>= 0, f >>>= 0, f = { type: ib[(M(), B)[f + 12 >>> 2 >>> 0]], count: (M(), P)[f + 16 >>> 2 >>> 0] };
    var m = Z(u);
    return u = qd(0), f = m.createQuerySet(f), rt[u >>> 0] = f, u;
  }
  function Xb(u, f) {
    return rb(Z(u >>> 0).adapterInfo, f >>> 0), 1;
  }
  var Yb = { "core-features-and-limits": 1, "depth-clip-control": 2, "depth32float-stencil8": 3, "texture-compression-bc": 4, "texture-compression-bc-sliced-3d": 5, "texture-compression-etc2": 6, "texture-compression-astc": 7, "texture-compression-astc-sliced-3d": 8, "timestamp-query": 9, "indirect-first-instance": 10, "shader-f16": 11, "rg11b10ufloat-renderable": 12, "bgra8unorm-storage": 13, "float32-filterable": 14, "float32-blendable": 15, "clip-distances": 16, "dual-source-blending": 17, subgroups: 18, "texture-formats-tier1": 19, "texture-formats-tier2": 20, "primitive-index": 21, "texture-component-swizzle": 22, "subgroup-size-control": 23, "chromium-experimental-unorm16-texture-formats": 327692, "chromium-experimental-multi-draw-indirect": 327729, "chromium-experimental-subgroup-matrix": 327732 };
  function Kb(u, f) {
    f >>>= 0;
    var m = Z(u >>> 0);
    u = Br(4 * m.features.size);
    var g = 0, x = 0;
    for (let T of m.features) 0 <= (m = Yb[T]) && ((M(), B)[u + g >>> 2 >>> 0] = m, g += 4, x++);
    (M(), P)[f + 4 >>> 2 >>> 0] = u, (M(), P)[f >>> 2 >>> 0] = x;
  }
  function Jb(u, f) {
    return kd(Z(u >>> 0).limits, f >>> 0), 1;
  }
  function Zb(u, f) {
    Z(u >>> 0).pushErrorScope(sb[f]);
  }
  function e0(u, f, m) {
    f >>>= 0, m >>>= 0, u = Z(u >>> 0), f = Array.from((M(), B).subarray(m >>> 2 >>> 0, m + 4 * f >>> 2 >>> 0), (g) => Z(g)), u.submit(f);
  }
  function t0(u, f, m, g, x) {
    m = tt(m), g >>>= 0, x >>>= 0, u = Z(u >>> 0), f = Z(f >>> 0), g = (M(), Q).subarray(g >>> 0, g + x >>> 0), u.writeBuffer(f, m, g, 0, x);
  }
  s || (function() {
    for (var u = t.numThreads - 1; u--; ) Bu();
    Le.push(async () => {
      var f = (async function() {
        if (!s) return Promise.all(gr.map(zu));
      })();
      ye++, await f, --ye == 0 && Ye && (f = Ye, Ye = null, f());
    });
  })(), s || (wr = new WebAssembly.Memory({ initial: 256, maximum: 65536, shared: !0 }), G()), t.wasmBinary && (h = t.wasmBinary), t.stackSave = () => re(), t.stackRestore = (u) => te(u), t.stackAlloc = (u) => Bs(u), t.setValue = function(u, f, m = "i8") {
    switch (m.endsWith("*") && (m = "*"), m) {
      case "i1":
      case "i8":
        (M(), W)[u >>> 0] = f;
        break;
      case "i16":
        (M(), H)[u >>> 1 >>> 0] = f;
        break;
      case "i32":
        (M(), B)[u >>> 2 >>> 0] = f;
        break;
      case "i64":
        (M(), J)[u >>> 3 >>> 0] = BigInt(f);
        break;
      case "float":
        (M(), X)[u >>> 2 >>> 0] = f;
        break;
      case "double":
        (M(), ce)[u >>> 3 >>> 0] = f;
        break;
      case "*":
        (M(), P)[u >>> 2 >>> 0] = f;
        break;
      default:
        ee(`invalid type for setValue: ${m}`);
    }
  }, t.getValue = function(u, f = "i8") {
    switch (f.endsWith("*") && (f = "*"), f) {
      case "i1":
      case "i8":
        return (M(), W)[u >>> 0];
      case "i16":
        return (M(), H)[u >>> 1 >>> 0];
      case "i32":
        return (M(), B)[u >>> 2 >>> 0];
      case "i64":
        return (M(), J)[u >>> 3 >>> 0];
      case "float":
        return (M(), X)[u >>> 2 >>> 0];
      case "double":
        return (M(), ce)[u >>> 3 >>> 0];
      case "*":
        return (M(), P)[u >>> 2 >>> 0];
      default:
        ee(`invalid type for getValue: ${f}`);
    }
  }, t.UTF8ToString = on, t.stringToUTF8 = ir, t.lengthBytesUTF8 = lr;
  var Dd, zd, Bd, po, zs, Et, Br, Rd, $d, Gd, Vd, Ud, jd, Wd, qd, Hd, Qd, Xd, mo, go, wo, vo, Qn, yo, Yd, bo, Kd, Jd, Zd, Mo, eh, th, xo, fe, Xn, rh, te, Bs, re, nh, ko, sh, ah, oh, To, ih, lh, ch, uh, dh, hh, fh, _h, ph, mh, gh, wh, vh, yh, bh, Mh, xh, kh, Th, Eh, Ah, Ch, Sh, Ph, Fh, Ih, Lh, Oh, Nh, Dh, zh, Bh, Rh, $h, Gh, Vh, Uh, jh, Wh, qh, Hh, ur, r0 = [sn, Wn, Gu, qu, Hu, Qu, Xu, Yu, Ku, Ju, Zu, ed, td, rd, nd, sd, md, gd, wd, Sd, Pd, Fd, Id, Ld, Od, Nd], Eo = { 1280444: (u, f, m, g, x) => {
    if (t === void 0 || !t.ed) return 1;
    if ((u = on(Number(u >>> 0))).startsWith("./") && (u = u.substring(2)), !(u = t.ed.get(u))) return 2;
    if (f = Number(f >>> 0), m = Number(m >>> 0), g = Number(g >>> 0), f + m > u.byteLength) return 3;
    try {
      let T = u.subarray(f, f + m);
      switch (x) {
        case 0:
          (M(), Q).set(T, g >>> 0);
          break;
        case 1:
          t.pe ? t.pe(g, T) : t.Re(g, T);
          break;
        default:
          return 4;
      }
      return 0;
    } catch {
      return 4;
    }
  }, 1281268: (u, f, m) => {
    t.re(u, (M(), Q).subarray(f >>> 0, f + m >>> 0));
  }, 1281332: () => t.Pe(), 1281374: (u) => {
    t.qe(u);
  }, 1281411: () => typeof wasmOffsetConverter < "u" };
  function n0() {
    return typeof wasmOffsetConverter < "u";
  }
  function s0(u, f, m, g) {
    var x = re();
    try {
      return _h(u, f, m, g);
    } catch (T) {
      if (te(x), T !== T + 0) throw T;
      fe(1, 0);
    }
  }
  function a0(u, f, m) {
    var g = re();
    try {
      return dh(u, f, m);
    } catch (x) {
      if (te(g), x !== x + 0) throw x;
      fe(1, 0);
    }
  }
  function o0(u) {
    var f = re();
    try {
      ih(u);
    } catch (m) {
      if (te(f), m !== m + 0) throw m;
      fe(1, 0);
    }
  }
  function i0(u, f) {
    var m = re();
    try {
      return To(u, f);
    } catch (g) {
      if (te(m), g !== g + 0) throw g;
      fe(1, 0);
    }
  }
  function l0(u, f, m) {
    var g = re();
    try {
      oh(u, f, m);
    } catch (x) {
      if (te(g), x !== x + 0) throw x;
      fe(1, 0);
    }
  }
  function c0(u, f) {
    var m = re();
    try {
      ph(u, f);
    } catch (g) {
      if (te(m), g !== g + 0) throw g;
      fe(1, 0);
    }
  }
  function u0(u, f, m, g, x, T, F) {
    var S = re();
    try {
      return uh(u, f, m, g, x, T, F);
    } catch (D) {
      if (te(S), D !== D + 0) throw D;
      fe(1, 0);
    }
  }
  function d0(u, f, m, g, x, T) {
    var F = re();
    try {
      lh(u, f, m, g, x, T);
    } catch (S) {
      if (te(F), S !== S + 0) throw S;
      fe(1, 0);
    }
  }
  function h0(u, f, m, g) {
    var x = re();
    try {
      fh(u, f, m, g);
    } catch (T) {
      if (te(x), T !== T + 0) throw T;
      fe(1, 0);
    }
  }
  function f0(u, f, m, g, x, T, F) {
    var S = re();
    try {
      gh(u, f, m, g, x, T, F);
    } catch (D) {
      if (te(S), D !== D + 0) throw D;
      fe(1, 0);
    }
  }
  function _0(u, f, m, g, x, T, F) {
    var S = re();
    try {
      wh(u, f, m, g, x, T, F);
    } catch (D) {
      if (te(S), D !== D + 0) throw D;
      fe(1, 0);
    }
  }
  function p0(u, f, m, g, x, T, F, S) {
    var D = re();
    try {
      Ch(u, f, m, g, x, T, F, S);
    } catch (U) {
      if (te(D), U !== U + 0) throw U;
      fe(1, 0);
    }
  }
  function m0(u, f, m, g, x, T, F, S, D, U, he, _e) {
    var Y = re();
    try {
      vh(u, f, m, g, x, T, F, S, D, U, he, _e);
    } catch (ke) {
      if (te(Y), ke !== ke + 0) throw ke;
      fe(1, 0);
    }
  }
  function g0(u, f, m, g, x) {
    var T = re();
    try {
      return mh(u, f, m, g, x);
    } catch (F) {
      if (te(T), F !== F + 0) throw F;
      fe(1, 0);
    }
  }
  function w0(u, f, m, g, x, T) {
    var F = re();
    try {
      Sh(u, f, m, g, x, T);
    } catch (S) {
      if (te(F), S !== S + 0) throw S;
      fe(1, 0);
    }
  }
  function v0(u, f, m, g, x) {
    var T = re();
    try {
      ch(u, f, m, g, x);
    } catch (F) {
      if (te(T), F !== F + 0) throw F;
      fe(1, 0);
    }
  }
  function y0(u, f, m, g, x, T, F, S) {
    var D = re();
    try {
      hh(u, f, m, g, x, T, F, S);
    } catch (U) {
      if (te(D), U !== U + 0) throw U;
      fe(1, 0);
    }
  }
  function b0(u) {
    var f = re();
    try {
      return Ph(u);
    } catch (m) {
      if (te(f), m !== m + 0) throw m;
      fe(1, 0);
    }
  }
  function M0(u, f, m, g, x, T, F, S, D) {
    var U = re();
    try {
      bh(u, f, m, g, x, T, F, S, D);
    } catch (he) {
      if (te(U), he !== he + 0) throw he;
      fe(1, 0);
    }
  }
  function x0(u, f, m) {
    var g = re();
    try {
      return Fh(u, f, m);
    } catch (x) {
      if (te(g), x !== x + 0) throw x;
      fe(1, 0);
    }
  }
  function k0(u, f) {
    var m = re();
    try {
      return Uh(u, f);
    } catch (g) {
      if (te(m), g !== g + 0) throw g;
      return fe(1, 0), 0n;
    }
  }
  function T0(u, f, m, g) {
    var x = re();
    try {
      return Ih(u, f, m, g);
    } catch (T) {
      if (te(x), T !== T + 0) throw T;
      fe(1, 0);
    }
  }
  function E0(u) {
    var f = re();
    try {
      return yh(u);
    } catch (m) {
      if (te(f), m !== m + 0) throw m;
      return fe(1, 0), 0n;
    }
  }
  function A0(u, f, m, g) {
    var x = re();
    try {
      return Lh(u, f, m, g);
    } catch (T) {
      if (te(x), T !== T + 0) throw T;
      fe(1, 0);
    }
  }
  function C0(u, f, m, g, x) {
    var T = re();
    try {
      return Oh(u, f, m, g, x);
    } catch (F) {
      if (te(T), F !== F + 0) throw F;
      fe(1, 0);
    }
  }
  function S0(u, f, m, g, x, T) {
    var F = re();
    try {
      return Nh(u, f, m, g, x, T);
    } catch (S) {
      if (te(F), S !== S + 0) throw S;
      fe(1, 0);
    }
  }
  function P0(u, f, m, g, x, T) {
    var F = re();
    try {
      return Eh(u, f, m, g, x, T);
    } catch (S) {
      if (te(F), S !== S + 0) throw S;
      fe(1, 0);
    }
  }
  function F0(u, f, m, g, x, T) {
    var F = re();
    try {
      return Dh(u, f, m, g, x, T);
    } catch (S) {
      if (te(F), S !== S + 0) throw S;
      fe(1, 0);
    }
  }
  function I0(u, f, m, g, x, T, F, S) {
    var D = re();
    try {
      return Ah(u, f, m, g, x, T, F, S);
    } catch (U) {
      if (te(D), U !== U + 0) throw U;
      fe(1, 0);
    }
  }
  function L0(u, f, m, g, x) {
    var T = re();
    try {
      return zh(u, f, m, g, x);
    } catch (F) {
      if (te(T), F !== F + 0) throw F;
      return fe(1, 0), 0n;
    }
  }
  function O0(u, f, m, g) {
    var x = re();
    try {
      return Bh(u, f, m, g);
    } catch (T) {
      if (te(x), T !== T + 0) throw T;
      fe(1, 0);
    }
  }
  function N0(u, f, m, g) {
    var x = re();
    try {
      return Rh(u, f, m, g);
    } catch (T) {
      if (te(x), T !== T + 0) throw T;
      fe(1, 0);
    }
  }
  function D0(u, f, m, g, x, T, F, S, D, U, he, _e) {
    var Y = re();
    try {
      return $h(u, f, m, g, x, T, F, S, D, U, he, _e);
    } catch (ke) {
      if (te(Y), ke !== ke + 0) throw ke;
      fe(1, 0);
    }
  }
  function z0(u, f, m, g, x, T, F, S, D, U, he) {
    var _e = re();
    try {
      Gh(u, f, m, g, x, T, F, S, D, U, he);
    } catch (Y) {
      if (te(_e), Y !== Y + 0) throw Y;
      fe(1, 0);
    }
  }
  function B0(u, f, m, g, x, T, F, S, D, U, he, _e, Y, ke, _t, lt) {
    var Rr = re();
    try {
      Vh(u, f, m, g, x, T, F, S, D, U, he, _e, Y, ke, _t, lt);
    } catch ($r) {
      if (te(Rr), $r !== $r + 0) throw $r;
      fe(1, 0);
    }
  }
  function R0(u, f, m) {
    var g = re();
    try {
      return xh(u, f, m);
    } catch (x) {
      if (te(g), x !== x + 0) throw x;
      return fe(1, 0), 0n;
    }
  }
  function $0(u, f, m) {
    var g = re();
    try {
      return Mh(u, f, m);
    } catch (x) {
      if (te(g), x !== x + 0) throw x;
      fe(1, 0);
    }
  }
  function G0(u, f, m) {
    var g = re();
    try {
      return kh(u, f, m);
    } catch (x) {
      if (te(g), x !== x + 0) throw x;
      fe(1, 0);
    }
  }
  function V0(u, f, m, g) {
    var x = re();
    try {
      Th(u, f, m, g);
    } catch (T) {
      if (te(x), T !== T + 0) throw T;
      fe(1, 0);
    }
  }
  function Rs() {
    if (0 < ye) Ye = Rs;
    else if (s) w?.(t), ue();
    else {
      for (var u = Le; 0 < u.length; ) u.shift()(t);
      0 < ye ? Ye = Rs : (t.calledRun = !0, C || (ue(), w?.(t)));
    }
  }
  return s || (ur = await Pe(), Rs()), t.PTR_SIZE = 4, t.webgpuInit = (u) => {
    let f = /* @__PURE__ */ new WeakMap(), m, g, x = 1;
    t.webgpuRegisterDevice = (S) => {
      if (g !== void 0) throw Error("another WebGPU EP inference session is being created.");
      if (S) {
        var D = f.get(S);
        if (!D) {
          let U = ((he, _e = 0) => {
            var Y = Xd(_e);
            return _e = Qd(_e, Y), rt[Y >>> 0] = he.queue, rt[_e >>> 0] = he, _e;
          })(S, D = Bd());
          D = [x++, D, U], f.set(S, D);
        }
        return m = S, g = D[0], D;
      }
      m = void 0, g = 0;
    };
    let T = /* @__PURE__ */ new Map();
    t.webgpuOnCreateSession = (S) => {
      if (g !== void 0) {
        var D = g;
        if (g = void 0, S) {
          let U = po(D);
          T.set(S, U), D === 0 && u(m ?? Z(U));
        }
        m = void 0;
      }
    }, t.webgpuOnReleaseSession = (S) => {
      T.delete(S);
    };
    let F = /* @__PURE__ */ Symbol("gpuBufferMetadata");
    t.webgpuRegisterBuffer = (S, D, U) => {
      if (U) return S[F] = [U, NaN], U;
      if (U = S[F]) return U[1]++, U[0];
      if ((D = T.get(D)) === void 0) throw Error("Invalid session handle passed to webgpuRegisterBuffer");
      return D = ((he, _e = 0) => (he.mapState === "unmapped" || ee(), _e = Hd(_e), rt[_e >>> 0] = he, _e))(S, D), S[F] = [D, 1], D;
    }, t.webgpuUnregisterBuffer = (S) => {
      let D = S[F];
      if (!D) throw Error("Buffer is not registered");
      D[1]--, D[1] === 0 && (Rd(D[0]), delete S[F]);
    }, t.webgpuGetBuffer = (S) => Z(S), t.webgpuCreateDownloader = (S, D, U) => {
      if ((U = T.get(U)) === void 0) throw Error("Invalid session handle passed to webgpuRegisterBuffer");
      let he = Z(U), _e = 16 * Math.ceil(Number(D) / 16);
      return async () => {
        let Y = he.createBuffer({ size: _e, usage: 9 });
        try {
          let ke = he.createCommandEncoder();
          return ke.copyBufferToBuffer(S, 0, Y, 0, _e), he.queue.submit([ke.finish()]), await Y.mapAsync(GPUMapMode.READ), Y.getMappedRange().slice(0, D);
        } finally {
          Y.destroy();
        }
      };
    }, t.pe = (S, D) => {
      var U = D.buffer;
      let he = D.byteOffset, _e = D.byteLength;
      if (D = 16 * Math.ceil(Number(_e) / 16), S = Z(S), !m) {
        var Y = po(g);
        m = Z(Y);
      }
      let ke = (Y = m.createBuffer({ mappedAtCreation: !0, size: D, usage: 6 })).getMappedRange();
      new Uint8Array(ke).set(new Uint8Array(U, he, _e)), Y.unmap(), (U = m.createCommandEncoder()).copyBufferToBuffer(Y, 0, S, 0, D), m.queue.submit([U.finish()]), Y.destroy();
    };
  }, t.webnnInit = (u) => {
    let f = u[0];
    [t.Pe, t.qe, t.webnnEnsureTensor, t.re, t.webnnDownloadTensor, t.Oe, t.webnnEnableTraceEvent] = u.slice(1), t.webnnReleaseTensorId = t.qe, t.webnnUploadTensor = t.re, t.webnnRegisterMLContext = t.Oe, t.webnnOnRunStart = (m) => f.onRunStart(m), t.webnnOnRunEnd = f.onRunEnd.bind(f), t.webnnOnReleaseSession = (m) => {
      f.onReleaseSession(m);
    }, t.webnnCreateMLTensorDownloader = (m, g) => f.createMLTensorDownloader(m, g), t.webnnRegisterMLTensor = (m, g, x, T) => f.registerMLTensor(m, g, x, T), t.webnnCreateMLContext = (m) => f.createMLContext(m), t.webnnRegisterGraphInput = f.registerGraphInput.bind(f), t.webnnIsGraphInput = f.isGraphInput.bind(f), t.webnnRegisterGraphOutput = f.registerGraphOutput.bind(f), t.webnnIsGraphOutput = f.isGraphOutput.bind(f), t.webnnCreateTemporaryTensor = f.createTemporaryTensor.bind(f), t.webnnIsGraphInputOutputTypeSupported = f.isGraphInputOutputTypeSupported.bind(f);
  }, O ? t : new Promise((u, f) => {
    w = u, v = f;
  });
}
var Wf, Yh, uM = we(() => {
  "use strict";
  Wf = Xh, Yh = globalThis.self?.name?.startsWith("em-pthread"), Yh && Xh();
}), Io, Qo, Kh, vt, qf, Gs, Jh, Zh, Lo, ef, Oo, Hf, No, Qf, ri = we(() => {
  "use strict";
  ti(), Io = typeof location > "u" ? void 0 : location.origin, Qo = import.meta.url > "file:" && import.meta.url < "file;", Kh = () => {
    if (Qo) {
      let e = URL;
      return new URL(new e("ort.webgpu.bundle.min.mjs", import.meta.url).href, Io).href;
    }
    return import.meta.url;
  }, vt = Kh(), qf = () => {
    if (vt && !vt.startsWith("blob:")) return vt.substring(0, vt.lastIndexOf("/") + 1);
  }, Gs = (e, t) => {
    try {
      let r = t ?? vt;
      return (r ? new URL(e, r) : new URL(e)).origin === Io;
    } catch {
      return !1;
    }
  }, Jh = (e, t) => {
    let r = t ?? vt;
    try {
      return (r ? new URL(e, r) : new URL(e)).href;
    } catch {
      return;
    }
  }, Zh = (e, t) => `${t ?? "./"}${e}`, Lo = async (e) => {
    let t = await (await fetch(e, { credentials: "same-origin" })).blob();
    return URL.createObjectURL(t);
  }, ef = async (e) => (await import(
    /*webpackIgnore:true*/
    /*@vite-ignore*/
    e
  )).default, Oo = (cM(), qs(Vf)).default, Hf = async () => {
    if (!vt) throw new Error("Failed to load proxy worker: cannot determine the script source URL.");
    if (Gs(vt)) return [void 0, Oo()];
    let e = await Lo(vt);
    return [e, Oo(e)];
  }, No = (uM(), qs(jf)).default, Qf = async (e, t, r, n) => {
    let s = No && !(e || t);
    if (s) if (vt) s = Gs(vt) || n && !r;
    else if (n && !r) s = !0;
    else throw new Error("cannot determine the script source URL.");
    if (s) return [void 0, No];
    {
      let a = "ort-wasm-simd-threaded.asyncify.mjs", o = e ?? Jh(a, t), i = r && o && !Gs(o, t), l = i ? await Lo(o) : o ?? Zh(a, t);
      return [i ? l : void 0, await ef(l)];
    }
  };
}), Do, Vs, Kn, zo, tf, rf, nf, ni, Ie, Yr = we(() => {
  "use strict";
  ri(), Vs = !1, Kn = !1, zo = !1, tf = () => {
    if (typeof SharedArrayBuffer > "u") return !1;
    try {
      return typeof MessageChannel < "u" && new MessageChannel().port1.postMessage(new SharedArrayBuffer(1)), WebAssembly.validate(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 4, 1, 96, 0, 0, 3, 2, 1, 0, 5, 4, 1, 3, 1, 1, 10, 11, 1, 9, 0, 65, 0, 254, 16, 2, 0, 26, 11]));
    } catch {
      return !1;
    }
  }, rf = () => {
    try {
      return WebAssembly.validate(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 4, 1, 96, 0, 0, 3, 2, 1, 0, 10, 30, 1, 28, 0, 65, 0, 253, 15, 253, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 253, 186, 1, 26, 11]));
    } catch {
      return !1;
    }
  }, nf = () => {
    try {
      return WebAssembly.validate(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 5, 1, 96, 0, 1, 123, 3, 2, 1, 0, 10, 19, 1, 17, 0, 65, 1, 253, 15, 65, 2, 253, 15, 65, 3, 253, 15, 253, 147, 2, 11]));
    } catch {
      return !1;
    }
  }, ni = async (e) => {
    if (Vs) return Promise.resolve();
    if (Kn) throw new Error("multiple calls to 'initializeWebAssembly()' detected.");
    if (zo) throw new Error("previous call to 'initializeWebAssembly()' failed.");
    Kn = !0;
    let t = e.initTimeout, r = e.numThreads;
    if (e.simd !== !1) {
      if (e.simd === "relaxed") {
        if (!nf()) throw new Error("Relaxed WebAssembly SIMD is not supported in the current environment.");
      } else if (!rf()) throw new Error("WebAssembly SIMD is not supported in the current environment.");
    }
    let n = tf();
    r > 1 && !n && (typeof self < "u" && !self.crossOriginIsolated && console.warn("env.wasm.numThreads is set to " + r + ", but this will not work unless you enable crossOriginIsolated mode. See https://web.dev/cross-origin-isolation-guide/ for more info."), console.warn("WebAssembly multi-threading is not supported in the current environment. Falling back to single-threading."), e.numThreads = r = 1);
    let s = e.wasmPaths, a = typeof s == "string" ? s : void 0, o = s?.mjs, i = o?.href ?? o, l = s?.wasm, c = l?.href ?? l, d = e.wasmBinary, [h, _] = await Qf(i, a, r > 1, !!d || !!c), p = !1, w = [];
    if (t > 0 && w.push(new Promise((v) => {
      setTimeout(() => {
        p = !0, v();
      }, t);
    })), w.push(new Promise((v, y) => {
      let b = { numThreads: r };
      if (d) b.wasmBinary = d, b.locateFile = (k) => k;
      else if (c || a) b.locateFile = (k) => c ?? a + k;
      else if (i && i.indexOf("blob:") !== 0) b.locateFile = (k) => new URL(k, i).href;
      else if (h) {
        let k = qf();
        k && (b.locateFile = (A) => k + A);
      }
      _(b).then((k) => {
        Kn = !1, Vs = !0, Do = k, v(), h && URL.revokeObjectURL(h);
      }, (k) => {
        Kn = !1, zo = !0, y(k);
      });
    })), await Promise.race(w), p) throw new Error(`WebAssembly backend initializing failed due to timeout: ${t}ms`);
  }, Ie = () => {
    if (Vs && Do) return Do;
    throw new Error("WebAssembly is not initialized yet.");
  };
}), yt, Qs, xe, si = we(() => {
  "use strict";
  Yr(), yt = (e, t) => {
    let r = Ie(), n = r.lengthBytesUTF8(e) + 1, s = r._malloc(n);
    return r.stringToUTF8(e, s, n), t.push(s), s;
  }, Qs = (e, t, r, n) => {
    if (typeof e == "object" && e !== null) {
      if (r.has(e)) throw new Error("Circular reference in options");
      r.add(e);
    }
    Object.entries(e).forEach(([s, a]) => {
      let o = t ? t + s : s;
      if (typeof a == "object") Qs(a, o + ".", r, n);
      else if (typeof a == "string" || typeof a == "number") n(o, a.toString());
      else if (typeof a == "boolean") n(o, a ? "1" : "0");
      else throw new Error(`Can't handle extra config type: ${typeof a}`);
    });
  }, xe = (e) => {
    let t = Ie(), r = t.stackSave();
    try {
      let n = t.PTR_SIZE, s = t.stackAlloc(2 * n);
      t._OrtGetLastError(s, s + n);
      let a = Number(t.getValue(s, n === 4 ? "i32" : "i64")), o = t.getValue(s + n, "*"), i = o ? t.UTF8ToString(o) : "";
      throw new Error(`${e} ERROR_CODE: ${a}, ERROR_MESSAGE: ${i}`);
    } finally {
      t.stackRestore(r);
    }
  };
}), Xf, dM = we(() => {
  "use strict";
  Yr(), si(), Xf = (e) => {
    let t = Ie(), r = 0, n = [], s = e || {};
    try {
      if (e?.logSeverityLevel === void 0) s.logSeverityLevel = 2;
      else if (typeof e.logSeverityLevel != "number" || !Number.isInteger(e.logSeverityLevel) || e.logSeverityLevel < 0 || e.logSeverityLevel > 4) throw new Error(`log severity level is not valid: ${e.logSeverityLevel}`);
      if (e?.logVerbosityLevel === void 0) s.logVerbosityLevel = 0;
      else if (typeof e.logVerbosityLevel != "number" || !Number.isInteger(e.logVerbosityLevel)) throw new Error(`log verbosity level is not valid: ${e.logVerbosityLevel}`);
      e?.terminate === void 0 && (s.terminate = !1);
      let a = 0;
      return e?.tag !== void 0 && (a = yt(e.tag, n)), r = t._OrtCreateRunOptions(s.logSeverityLevel, s.logVerbosityLevel, !!s.terminate, a), r === 0 && xe("Can't create run options."), e?.extra !== void 0 && Qs(e.extra, "", /* @__PURE__ */ new WeakSet(), (o, i) => {
        let l = yt(o, n), c = yt(i, n);
        t._OrtAddRunConfigEntry(r, l, c) !== 0 && xe(`Can't set a run config entry: ${o} - ${i}.`);
      }), [r, n];
    } catch (a) {
      throw r !== 0 && t._OrtReleaseRunOptions(r), n.forEach((o) => t._free(o)), a;
    }
  };
}), sf, af, of, dn, Xt, lf, Yf, hM = we(() => {
  "use strict";
  Yr(), si(), sf = (e) => {
    switch (e) {
      case "disabled":
        return 0;
      case "basic":
        return 1;
      case "extended":
        return 2;
      case "layout":
        return 3;
      case "all":
        return 99;
      default:
        throw new Error(`unsupported graph optimization level: ${e}`);
    }
  }, af = (e) => {
    switch (e) {
      case "sequential":
        return 0;
      case "parallel":
        return 1;
      default:
        throw new Error(`unsupported execution mode: ${e}`);
    }
  }, of = (e) => {
    e.extra || (e.extra = {}), e.extra.session || (e.extra.session = {});
    let t = e.extra.session;
    t.use_ort_model_bytes_directly || (t.use_ort_model_bytes_directly = "1"), e.executionProviders && e.executionProviders.some((r) => (typeof r == "string" ? r : r.name) === "webgpu") && (e.enableMemPattern = !1);
  }, dn = (e, t, r, n) => {
    let s = yt(t, n), a = yt(r, n);
    Ie()._OrtAddSessionConfigEntry(e, s, a) !== 0 && xe(`Can't set a session config entry: ${t} - ${r}.`);
  }, Xt = (e, t, r, n) => {
    let s = yt(t, n), a = yt(r, n);
    e.push([s, a]);
  }, lf = async (e, t, r) => {
    let n = t.executionProviders;
    for (let s of n) {
      let a = typeof s == "string" ? s : s.name, o = [];
      switch (a) {
        case "webnn":
          if (a = "WEBNN", dn(e, "session.disable_quant_qdq", "1", r), dn(e, "session.disable_qdq_constant_folding", "1", r), typeof s != "string") {
            let h = s?.deviceType;
            h && dn(e, "deviceType", h, r);
          }
          break;
        case "webgpu":
          {
            a = "WebGPU";
            let h;
            if (typeof s != "string") {
              let p = s;
              if (p.device) if (typeof GPUDevice < "u" && p.device instanceof GPUDevice) h = p.device;
              else throw new Error("Invalid GPU device set in WebGPU EP options.");
              let { enableGraphCapture: w } = t;
              if (typeof w == "boolean" && w && Xt(o, "enableGraphCapture", "1", r), typeof p.preferredLayout == "string" && Xt(o, "preferredLayout", p.preferredLayout, r), p.forceCpuNodeNames) {
                let v = Array.isArray(p.forceCpuNodeNames) ? p.forceCpuNodeNames : [p.forceCpuNodeNames];
                Xt(o, "forceCpuNodeNames", v.join(`
`), r);
              }
              p.validationMode && Xt(o, "validationMode", p.validationMode, r), typeof p.enableMatmulFp32Accumulation == "boolean" && Xt(o, "enableMatmulFp32Accumulation", p.enableMatmulFp32Accumulation ? "1" : "0", r);
              for (let v of ["storageBufferCacheMode", "uniformBufferCacheMode", "queryResolveBufferCacheMode", "defaultBufferCacheMode"]) {
                let y = p[v];
                if (y) {
                  if (y !== "disabled" && y !== "lazyRelease" && y !== "simple" && y !== "bucket") throw new Error(`${v} must be one of 'disabled', 'lazyRelease', 'simple' or 'bucket': ${y}`);
                  Xt(o, v, y, r);
                }
              }
            }
            let _ = Ie().webgpuRegisterDevice(h);
            if (_) {
              let [p, w, v] = _;
              Xt(o, "deviceId", p.toString(), r), Xt(o, "webgpuInstance", w.toString(), r), Xt(o, "webgpuDevice", v.toString(), r);
            }
          }
          break;
        case "wasm":
        case "cpu":
          continue;
        default:
          throw new Error(`not supported execution provider: ${a}`);
      }
      let i = yt(a, r), l = o.length, c = 0, d = 0;
      if (l > 0) {
        c = Ie()._malloc(l * Ie().PTR_SIZE), r.push(c), d = Ie()._malloc(l * Ie().PTR_SIZE), r.push(d);
        for (let h = 0; h < l; h++) Ie().setValue(c + h * Ie().PTR_SIZE, o[h][0], "*"), Ie().setValue(d + h * Ie().PTR_SIZE, o[h][1], "*");
      }
      await Ie()._OrtAppendExecutionProvider(e, i, c, d, l) !== 0 && xe(`Can't append execution provider: ${a}.`);
    }
  }, Yf = async (e) => {
    let t = Ie(), r = 0, n = [], s = e || {};
    of(s);
    try {
      let a = sf(s.graphOptimizationLevel ?? "all"), o = af(s.executionMode ?? "sequential"), i = typeof s.logId == "string" ? yt(s.logId, n) : 0, l = s.logSeverityLevel ?? 2;
      if (!Number.isInteger(l) || l < 0 || l > 4) throw new Error(`log severity level is not valid: ${l}`);
      let c = s.logVerbosityLevel ?? 0;
      if (!Number.isInteger(c) || c < 0 || c > 4) throw new Error(`log verbosity level is not valid: ${c}`);
      let d = typeof s.optimizedModelFilePath == "string" ? yt(s.optimizedModelFilePath, n) : 0;
      if (r = t._OrtCreateSessionOptions(a, !!s.enableCpuMemArena, !!s.enableMemPattern, o, !!s.enableProfiling, 0, i, l, c, d), r === 0 && xe("Can't create session options."), s.executionProviders && await lf(r, s, n), s.enableGraphCapture !== void 0) {
        if (typeof s.enableGraphCapture != "boolean") throw new Error(`enableGraphCapture must be a boolean value: ${s.enableGraphCapture}`);
        dn(r, "enableGraphCapture", s.enableGraphCapture.toString(), n);
      }
      if (s.freeDimensionOverrides) for (let [h, _] of Object.entries(s.freeDimensionOverrides)) {
        if (typeof h != "string") throw new Error(`free dimension override name must be a string: ${h}`);
        if (typeof _ != "number" || !Number.isInteger(_) || _ < 0) throw new Error(`free dimension override value must be a non-negative integer: ${_}`);
        let p = yt(h, n);
        t._OrtAddFreeDimensionOverride(r, p, _) !== 0 && xe(`Can't set a free dimension override: ${h} - ${_}.`);
      }
      return s.extra !== void 0 && Qs(s.extra, "", /* @__PURE__ */ new WeakSet(), (h, _) => {
        dn(r, h, _, n);
      }), [r, n];
    } catch (a) {
      throw r !== 0 && t._OrtReleaseSessionOptions(r) !== 0 && xe("Can't release session options."), n.forEach((o) => t._free(o)), a;
    }
  };
}), Wr, Ws, fn, rs, Xs, ai, oi, Xo, _n = we(() => {
  "use strict";
  Wr = (e) => {
    switch (e) {
      case "int8":
        return 3;
      case "uint8":
        return 2;
      case "bool":
        return 9;
      case "int16":
        return 5;
      case "uint16":
        return 4;
      case "int32":
        return 6;
      case "uint32":
        return 12;
      case "float16":
        return 10;
      case "float32":
        return 1;
      case "float64":
        return 11;
      case "string":
        return 8;
      case "int64":
        return 7;
      case "uint64":
        return 13;
      case "int4":
        return 22;
      case "uint4":
        return 21;
      default:
        throw new Error(`unsupported data type: ${e}`);
    }
  }, Ws = (e) => {
    switch (e) {
      case 3:
        return "int8";
      case 2:
        return "uint8";
      case 9:
        return "bool";
      case 5:
        return "int16";
      case 4:
        return "uint16";
      case 6:
        return "int32";
      case 12:
        return "uint32";
      case 10:
        return "float16";
      case 1:
        return "float32";
      case 11:
        return "float64";
      case 8:
        return "string";
      case 7:
        return "int64";
      case 13:
        return "uint64";
      case 22:
        return "int4";
      case 21:
        return "uint4";
      default:
        throw new Error(`unsupported data type: ${e}`);
    }
  }, fn = (e, t) => {
    let r = [-1, 4, 1, 1, 2, 2, 4, 8, -1, 1, 2, 8, 4, 8, -1, -1, -1, -1, -1, -1, -1, 0.5, 0.5][e], n = typeof t == "number" ? t : t.reduce((s, a) => s * a, 1);
    return r > 0 ? Math.ceil(n * r) : void 0;
  }, rs = (e) => {
    switch (e) {
      case "float16":
        return typeof Float16Array < "u" ? Float16Array : Uint16Array;
      case "float32":
        return Float32Array;
      case "uint8":
        return Uint8Array;
      case "int8":
        return Int8Array;
      case "uint16":
        return Uint16Array;
      case "int16":
        return Int16Array;
      case "int32":
        return Int32Array;
      case "bool":
        return Uint8Array;
      case "float64":
        return Float64Array;
      case "uint32":
        return Uint32Array;
      case "int64":
        return BigInt64Array;
      case "uint64":
        return BigUint64Array;
      default:
        throw new Error(`unsupported type: ${e}`);
    }
  }, Xs = (e) => {
    switch (e) {
      case "verbose":
        return 0;
      case "info":
        return 1;
      case "warning":
        return 2;
      case "error":
        return 3;
      case "fatal":
        return 4;
      default:
        throw new Error(`unsupported logging level: ${e}`);
    }
  }, ai = (e) => e === "float32" || e === "float16" || e === "int32" || e === "int64" || e === "uint32" || e === "uint8" || e === "bool" || e === "uint4" || e === "int4", oi = (e) => e === "float32" || e === "float16" || e === "int32" || e === "int64" || e === "uint32" || e === "uint64" || e === "int8" || e === "uint8" || e === "bool" || e === "uint4" || e === "int4", Xo = (e) => {
    switch (e) {
      case "none":
        return 0;
      case "cpu":
        return 1;
      case "cpu-pinned":
        return 2;
      case "texture":
        return 3;
      case "gpu-buffer":
        return 4;
      case "ml-tensor":
        return 5;
      default:
        throw new Error(`unsupported data location: ${e}`);
    }
  };
}), ii, Kf = we(() => {
  "use strict";
  ti(), ii = async (e) => {
    if (typeof e == "string") {
      let t = await fetch(e);
      if (!t.ok) throw new Error(`failed to load external data file: ${e}`);
      let r = t.headers.get("Content-Length"), n = r ? parseInt(r, 10) : 0;
      if (n < 1073741824) return new Uint8Array(await t.arrayBuffer());
      {
        if (!t.body) throw new Error(`failed to load external data file: ${e}, no response body.`);
        let s = t.body.getReader(), a;
        try {
          a = new ArrayBuffer(n);
        } catch (i) {
          if (i instanceof RangeError) {
            let l = Math.ceil(n / 65536);
            a = new WebAssembly.Memory({ initial: l, maximum: l }).buffer;
          } else throw i;
        }
        let o = 0;
        for (; ; ) {
          let { done: i, value: l } = await s.read();
          if (i) break;
          let c = l.byteLength;
          new Uint8Array(a, o, c).set(l), o += c;
        }
        return new Uint8Array(a, 0, n);
      }
    } else return e instanceof Blob ? new Uint8Array(await e.arrayBuffer()) : e instanceof Uint8Array ? e : new Uint8Array(e);
  };
}), Jf, fM = we(() => {
  "use strict";
  _n(), Jf = (e, t) => new (rs(t))(e);
}), cf, uf, df, hf, Zf, ff, pt, e_ = we(() => {
  "use strict";
  _n(), cf = ["V", "I", "W", "E", "F"], uf = (e, t) => {
    console.log(`[${cf[e]},${(/* @__PURE__ */ new Date()).toISOString()}]${t}`);
  }, Zf = (e, t) => {
    df = e, hf = t;
  }, ff = (e, t) => {
    let r = Xs(e), n = Xs(df);
    r >= n && uf(r, typeof t == "function" ? t() : t);
  }, pt = (...e) => {
    hf && ff(...e);
  };
}), Bo, _f, Ro, pf, $o, mf, Go, Vo, Uo, gf, t_, _M = we(() => {
  "use strict";
  _n(), e_(), Bo = /* @__PURE__ */ new Map([["float32", 32], ["float16", 16], ["int32", 32], ["uint32", 32], ["int64", 64], ["uint64", 64], ["int8", 8], ["uint8", 8], ["int4", 4], ["uint4", 4]]), _f = (e, t) => {
    if (t === "int32") return e;
    let r = Bo.get(t);
    if (!r) throw new Error(`WebNN backend does not support data type: ${t}`);
    let n = r / 8;
    if (e.byteLength % n !== 0) throw new Error(`Invalid Uint8Array length - must be a multiple of ${n}.`);
    let s = e.byteLength / n, a = new (rs(t))(e.buffer, e.byteOffset, s);
    switch (t) {
      case "int64":
      case "uint64": {
        let o = new Int32Array(s);
        for (let i = 0; i < s; i++) {
          let l = a[i];
          if (l > 2147483647n || l < -2147483648n) throw new Error("Can not convert int64 data to int32 - value out of range.");
          o[i] = Number(l);
        }
        return new Uint8Array(o.buffer);
      }
      case "int8":
      case "uint8":
      case "uint32": {
        if (t === "uint32" && a.some((i) => i > 2147483647)) throw new Error("Can not convert uint32 data to int32 - value out of range.");
        let o = Int32Array.from(a, Number);
        return new Uint8Array(o.buffer);
      }
      default:
        throw new Error(`Unsupported data conversion from ${t} to 'int32'`);
    }
  }, Ro = (e, t) => {
    if (t === "int32") return e;
    if (e.byteLength % 4 !== 0) throw new Error("Invalid Uint8Array length - must be a multiple of 4 (int32).");
    let r = e.byteLength / 4, n = new Int32Array(e.buffer, e.byteOffset, r);
    switch (t) {
      case "int64": {
        let s = BigInt64Array.from(n, BigInt);
        return new Uint8Array(s.buffer);
      }
      case "uint64": {
        if (n.some((a) => a < 0)) throw new Error("Can not convert int32 data to uin64 - negative value found.");
        let s = BigUint64Array.from(n, BigInt);
        return new Uint8Array(s.buffer);
      }
      case "int8": {
        if (n.some((a) => a < -128 || a > 127)) throw new Error("Can not convert int32 data to int8 - value out of range.");
        let s = Int8Array.from(n, Number);
        return new Uint8Array(s.buffer);
      }
      case "uint8": {
        if (n.some((s) => s < 0 || s > 255)) throw new Error("Can not convert int32 data to uint8 - value out of range.");
        return Uint8Array.from(n, Number);
      }
      case "uint32": {
        if (n.some((a) => a < 0)) throw new Error("Can not convert int32 data to uint32 - negative value found.");
        let s = Uint32Array.from(n, Number);
        return new Uint8Array(s.buffer);
      }
      default:
        throw new Error(`Unsupported data conversion from 'int32' to ${t}`);
    }
  }, pf = 1, $o = () => pf++, mf = /* @__PURE__ */ new Map([["int8", "int32"], ["uint8", "int32"], ["uint32", "int32"], ["int64", "int32"]]), Go = (e, t) => {
    let r = Bo.get(e);
    if (!r) throw new Error(`WebNN backend does not support data type: ${e}`);
    return t.length > 0 ? Math.ceil(t.reduce((n, s) => n * s) * r / 8) : 0;
  }, Vo = class {
    constructor(e) {
      this.isDataConverted = !1;
      let { sessionId: t, context: r, tensor: n, dataType: s, shape: a, fallbackDataType: o } = e;
      this.sessionId = t, this.mlContext = r, this.mlTensor = n, this.dataType = s, this.tensorShape = a, this.fallbackDataType = o;
    }
    get tensor() {
      return this.mlTensor;
    }
    get type() {
      return this.dataType;
    }
    get fallbackType() {
      return this.fallbackDataType;
    }
    get shape() {
      return this.tensorShape;
    }
    get byteLength() {
      return Go(this.dataType, this.tensorShape);
    }
    destroy() {
      pt("verbose", () => "[WebNN] TensorWrapper.destroy"), this.mlTensor.destroy();
    }
    write(e) {
      this.mlContext.writeTensor(this.mlTensor, e);
    }
    async read(e) {
      if (this.fallbackDataType) {
        let t = await this.mlContext.readTensor(this.mlTensor), r = Ro(new Uint8Array(t), this.dataType);
        if (e) {
          (e instanceof ArrayBuffer ? new Uint8Array(e) : new Uint8Array(e.buffer, e.byteOffset, e.byteLength)).set(r);
          return;
        } else return new Uint8Array(r).buffer;
      } else return e ? this.mlContext.readTensor(this.mlTensor, e) : this.mlContext.readTensor(this.mlTensor);
    }
    canReuseTensor(e, t, r) {
      return this.mlContext === e && this.dataType === t && this.tensorShape.length === r.length && this.tensorShape.every((n, s) => n === r[s]);
    }
    setIsDataConverted(e) {
      this.isDataConverted = e;
    }
  }, Uo = class {
    constructor(e, t) {
      this.tensorManager = e, this.wrapper = t;
    }
    get tensorWrapper() {
      return this.wrapper;
    }
    releaseTensor() {
      this.tensorWrapper && (this.tensorManager.releaseTensor(this.tensorWrapper), this.wrapper = void 0);
    }
    async ensureTensor(e, t, r, n) {
      let s = this.tensorManager.getMLContext(e), a = this.tensorManager.getMLOpSupportLimits(e), o;
      if (!a?.input.dataTypes.includes(t)) {
        if (o = mf.get(t), !o || !a?.input.dataTypes.includes(o)) throw new Error(`WebNN backend does not support data type: ${t}`);
        pt("verbose", () => `[WebNN] TensorIdTracker.ensureTensor: fallback dataType from ${t} to ${o}`);
      }
      if (this.wrapper) {
        if (this.wrapper.canReuseTensor(s, t, r)) return this.wrapper.tensor;
        if (n) {
          if (this.wrapper.byteLength !== Go(t, r)) throw new Error("Unable to copy data to tensor with different size.");
          this.activeUpload = new Uint8Array(await this.wrapper.read());
        }
        this.tensorManager.releaseTensor(this.wrapper);
      }
      let i = typeof MLTensorUsage > "u" ? void 0 : MLTensorUsage.READ | MLTensorUsage.WRITE;
      return this.wrapper = await this.tensorManager.getCachedTensor(e, t, r, i, !0, !0, o), n && this.activeUpload && (this.wrapper.write(this.activeUpload), this.activeUpload = void 0), this.wrapper.tensor;
    }
    upload(e) {
      let t = e;
      if (this.wrapper) {
        if (this.wrapper.fallbackType) if (this.wrapper.fallbackType === "int32") t = _f(e, this.wrapper.type), this.wrapper.setIsDataConverted(!0);
        else throw new Error(`Unsupported fallback data type: ${this.wrapper.fallbackType}`);
        if (e.byteLength === this.wrapper.byteLength) {
          this.wrapper.write(t);
          return;
        } else pt("verbose", () => "Data size does not match tensor size. Releasing tensor."), this.releaseTensor();
      }
      this.activeUpload ? this.activeUpload.set(t) : this.activeUpload = new Uint8Array(t);
    }
    async download(e) {
      if (this.activeUpload) {
        let t = this.wrapper?.isDataConverted ? Ro(this.activeUpload, this.wrapper?.type) : this.activeUpload;
        if (e) {
          e instanceof ArrayBuffer ? new Uint8Array(e).set(t) : new Uint8Array(e.buffer, e.byteOffset, e.byteLength).set(t);
          return;
        } else return t.buffer;
      }
      if (!this.wrapper) throw new Error("Tensor has not been created.");
      return e ? this.wrapper.read(e) : this.wrapper.read();
    }
  }, gf = class {
    constructor(e) {
      this.backend = e, this.tensorTrackersById = /* @__PURE__ */ new Map(), this.freeTensors = [], this.externalTensors = /* @__PURE__ */ new Set();
    }
    getMLContext(e) {
      let t = this.backend.getMLContext(e);
      if (!t) throw new Error("MLContext not found for session.");
      return t;
    }
    getMLOpSupportLimits(e) {
      return this.backend.getMLOpSupportLimits(e);
    }
    reserveTensorId() {
      let e = $o();
      return this.tensorTrackersById.set(e, new Uo(this)), e;
    }
    releaseTensorId(e) {
      let t = this.tensorTrackersById.get(e);
      t && (this.tensorTrackersById.delete(e), t.tensorWrapper && this.releaseTensor(t.tensorWrapper));
    }
    async ensureTensor(e, t, r, n, s) {
      pt("verbose", () => `[WebNN] TensorManager.ensureTensor {tensorId: ${t}, dataType: ${r}, shape: ${n}, copyOld: ${s}}`);
      let a = this.tensorTrackersById.get(t);
      if (!a) throw new Error("Tensor not found.");
      return a.ensureTensor(e, r, n, s);
    }
    upload(e, t) {
      let r = this.tensorTrackersById.get(e);
      if (!r) throw new Error("Tensor not found.");
      r.upload(t);
    }
    async download(e, t) {
      pt("verbose", () => `[WebNN] TensorManager.download {tensorId: ${e}, dstBuffer: ${t?.byteLength}}`);
      let r = this.tensorTrackersById.get(e);
      if (!r) throw new Error("Tensor not found.");
      return r.download(t);
    }
    releaseTensorsForSession(e) {
      for (let t of this.freeTensors) t.sessionId === e && t.destroy();
      this.freeTensors = this.freeTensors.filter((t) => t.sessionId !== e);
    }
    registerTensor(e, t, r, n) {
      let s = this.getMLContext(e), a = $o(), o = new Vo({ sessionId: e, context: s, tensor: t, dataType: r, shape: n });
      return this.tensorTrackersById.set(a, new Uo(this, o)), this.externalTensors.add(o), a;
    }
    async getCachedTensor(e, t, r, n, s, a, o) {
      let i = this.getMLContext(e);
      for (let [c, d] of this.freeTensors.entries()) if (d.canReuseTensor(i, t, r)) {
        pt("verbose", () => `[WebNN] Reusing tensor {dataType: ${t}, ${o ? `fallbackDataType: ${o},` : ""} shape: ${r}`);
        let h = this.freeTensors.splice(c, 1)[0];
        return h.sessionId = e, h;
      }
      pt("verbose", () => `[WebNN] MLContext.createTensor {dataType: ${t}, ${o ? `fallbackDataType: ${o},` : ""} shape: ${r}}`);
      let l = await i.createTensor({ dataType: o ?? t, shape: r, dimensions: r, usage: n, writable: s, readable: a });
      return new Vo({ sessionId: e, context: i, tensor: l, dataType: t, shape: r, fallbackDataType: o });
    }
    releaseTensor(e) {
      this.externalTensors.has(e) && this.externalTensors.delete(e), this.freeTensors.push(e);
    }
  }, t_ = (...e) => new gf(...e);
}), r_ = {};
ns(r_, { WebNNBackend: () => n_ });
var Jn, wf, n_, pM = we(() => {
  "use strict";
  _n(), Yr(), fM(), _M(), e_(), Jn = /* @__PURE__ */ new Map([[1, "float32"], [10, "float16"], [6, "int32"], [12, "uint32"], [7, "int64"], [13, "uint64"], [22, "int4"], [21, "uint4"], [3, "int8"], [2, "uint8"], [9, "uint8"]]), wf = (e, t) => {
    if (e === t) return !0;
    if (e === void 0 || t === void 0) return !1;
    let r = Object.keys(e).sort(), n = Object.keys(t).sort();
    return r.length === n.length && r.every((s, a) => s === n[a] && e[s] === t[s]);
  }, n_ = class {
    constructor(e) {
      this.tensorManager = t_(this), this.mlContextBySessionId = /* @__PURE__ */ new Map(), this.sessionIdsByMLContext = /* @__PURE__ */ new Map(), this.mlContextCache = [], this.sessionGraphInputs = /* @__PURE__ */ new Map(), this.sessionGraphOutputs = /* @__PURE__ */ new Map(), this.temporaryGraphInputs = [], this.temporaryGraphOutputs = [], this.temporarySessionTensorIds = /* @__PURE__ */ new Map(), this.mlOpSupportLimitsBySessionId = /* @__PURE__ */ new Map(), Zf(e.logLevel, !!e.debug);
    }
    get currentSessionId() {
      if (this.activeSessionId === void 0) throw new Error("No active session");
      return this.activeSessionId;
    }
    onRunStart(e) {
      pt("verbose", () => `[WebNN] onRunStart {sessionId: ${e}}`), this.activeSessionId = e;
    }
    onRunEnd(e) {
      pt("verbose", () => `[WebNN] onRunEnd {sessionId: ${e}}`);
      let t = this.temporarySessionTensorIds.get(e);
      if (t) {
        for (let r of t) pt("verbose", () => `[WebNN] releasing temporary tensor {tensorId: ${r}}`), this.tensorManager.releaseTensorId(r);
        this.temporarySessionTensorIds.delete(e), this.activeSessionId = void 0;
      }
    }
    async createMLContext(e) {
      if (e instanceof GPUDevice) {
        let r = this.mlContextCache.findIndex((n) => n.gpuDevice === e);
        if (r !== -1) return this.mlContextCache[r].mlContext;
        {
          let n = await navigator.ml.createContext(e);
          return this.mlContextCache.push({ gpuDevice: e, mlContext: n }), n;
        }
      } else if (e === void 0) {
        let r = this.mlContextCache.findIndex((n) => n.options === void 0 && n.gpuDevice === void 0);
        if (r !== -1) return this.mlContextCache[r].mlContext;
        {
          let n = await navigator.ml.createContext();
          return this.mlContextCache.push({ mlContext: n }), n;
        }
      }
      let t = this.mlContextCache.findIndex((r) => wf(r.options, e));
      if (t !== -1) return this.mlContextCache[t].mlContext;
      {
        let r = await navigator.ml.createContext(e);
        return this.mlContextCache.push({ options: e, mlContext: r }), r;
      }
    }
    registerMLContext(e, t) {
      this.mlContextBySessionId.set(e, t);
      let r = this.sessionIdsByMLContext.get(t);
      r || (r = /* @__PURE__ */ new Set(), this.sessionIdsByMLContext.set(t, r)), r.add(e), this.mlOpSupportLimitsBySessionId.has(e) || this.mlOpSupportLimitsBySessionId.set(e, t.opSupportLimits()), this.temporaryGraphInputs.length > 0 && (this.sessionGraphInputs.set(e, this.temporaryGraphInputs), this.temporaryGraphInputs = []), this.temporaryGraphOutputs.length > 0 && (this.sessionGraphOutputs.set(e, this.temporaryGraphOutputs), this.temporaryGraphOutputs = []);
    }
    onReleaseSession(e) {
      this.sessionGraphInputs.delete(e), this.sessionGraphOutputs.delete(e);
      let t = this.mlContextBySessionId.get(e);
      if (!t) return;
      this.tensorManager.releaseTensorsForSession(e), this.mlContextBySessionId.delete(e), this.mlOpSupportLimitsBySessionId.delete(e);
      let r = this.sessionIdsByMLContext.get(t);
      if (r.delete(e), r.size === 0) {
        this.sessionIdsByMLContext.delete(t);
        let n = this.mlContextCache.findIndex((s) => s.mlContext === t);
        n !== -1 && this.mlContextCache.splice(n, 1);
      }
    }
    getMLContext(e) {
      return this.mlContextBySessionId.get(e);
    }
    getMLOpSupportLimits(e) {
      return this.mlOpSupportLimitsBySessionId.get(e);
    }
    reserveTensorId() {
      return this.tensorManager.reserveTensorId();
    }
    releaseTensorId(e) {
      pt("verbose", () => `[WebNN] releaseTensorId {tensorId: ${e}}`), this.tensorManager.releaseTensorId(e);
    }
    async ensureTensor(e, t, r, n, s) {
      let a = Jn.get(r);
      if (!a) throw new Error(`Unsupported ONNX data type: ${r}`);
      return this.tensorManager.ensureTensor(e ?? this.currentSessionId, t, a, n, s);
    }
    async createTemporaryTensor(e, t, r) {
      pt("verbose", () => `[WebNN] createTemporaryTensor {onnxDataType: ${t}, shape: ${r}}`);
      let n = Jn.get(t);
      if (!n) throw new Error(`Unsupported ONNX data type: ${t}`);
      let s = this.tensorManager.reserveTensorId();
      await this.tensorManager.ensureTensor(e, s, n, r, !1);
      let a = this.temporarySessionTensorIds.get(e);
      return a ? a.push(s) : this.temporarySessionTensorIds.set(e, [s]), s;
    }
    uploadTensor(e, t) {
      if (!Ie().shouldTransferToMLTensor) throw new Error("Trying to upload to a MLTensor while shouldTransferToMLTensor is false");
      pt("verbose", () => `[WebNN] uploadTensor {tensorId: ${e}, data: ${t.byteLength}}`), this.tensorManager.upload(e, t);
    }
    async downloadTensor(e, t) {
      return this.tensorManager.download(e, t);
    }
    createMLTensorDownloader(e, t) {
      return async () => {
        let r = await this.tensorManager.download(e);
        return Jf(r, t);
      };
    }
    registerMLTensor(e, t, r, n) {
      let s = Jn.get(r);
      if (!s) throw new Error(`Unsupported ONNX data type: ${r}`);
      let a = this.tensorManager.registerTensor(e, t, s, n);
      return pt("verbose", () => `[WebNN] registerMLTensor {tensor: ${t}, dataType: ${s}, dimensions: ${n}} -> {tensorId: ${a}}`), a;
    }
    registerGraphInput(e) {
      this.temporaryGraphInputs.push(e);
    }
    registerGraphOutput(e) {
      this.temporaryGraphOutputs.push(e);
    }
    isGraphInput(e, t) {
      let r = this.sessionGraphInputs.get(e);
      return r ? r.includes(t) : !1;
    }
    isGraphOutput(e, t) {
      let r = this.sessionGraphOutputs.get(e);
      return r ? r.includes(t) : !1;
    }
    isGraphInputOutputTypeSupported(e, t, r = !0) {
      let n = Jn.get(Wr(t)), s = this.mlOpSupportLimitsBySessionId.get(e);
      return typeof n > "u" ? !1 : r ? !!s?.input.dataTypes.includes(n) : !!s?.output.dataTypes.includes(n);
    }
    flush() {
    }
  };
}), vf, li, ci, br, yf, jo, Ys, ui, di, Wo, hi, fi, _i, s_ = we(() => {
  "use strict";
  Xr(), dM(), hM(), _n(), Yr(), si(), Kf(), vf = (e, t) => {
    Ie()._OrtInit(e, t) !== 0 && xe("Can't initialize onnxruntime.");
  }, li = async (e) => {
    vf(e.wasm.numThreads, Xs(e.logLevel));
  }, ci = async (e, t) => {
    Ie().asyncInit?.();
    let r = e.webgpu.adapter;
    if (t === "webgpu") {
      if (typeof navigator > "u" || !navigator.gpu) throw new Error("WebGPU is not supported in current environment");
      if (r) {
        if (typeof r.limits != "object" || typeof r.features != "object" || typeof r.requestDevice != "function") throw new Error("Invalid GPU adapter set in `env.webgpu.adapter`. It must be a GPUAdapter object.");
      } else {
        let n = e.webgpu.powerPreference;
        if (n !== void 0 && n !== "low-power" && n !== "high-performance") throw new Error(`Invalid powerPreference setting: "${n}"`);
        let s = e.webgpu.forceFallbackAdapter;
        if (s !== void 0 && typeof s != "boolean") throw new Error(`Invalid forceFallbackAdapter setting: "${s}"`);
        if (r = await navigator.gpu.requestAdapter({ powerPreference: n, forceFallbackAdapter: s }), !r) throw new Error('Failed to get GPU adapter. You may need to enable flag "--enable-unsafe-webgpu" if you are using Chrome.');
      }
    }
    if (t === "webnn" && (typeof navigator > "u" || !navigator.ml)) throw new Error("WebNN is not supported in current environment");
    if (t === "webgpu" && Ie().webgpuInit((n) => {
      e.webgpu.device = n;
    }), t === "webnn") {
      let n = new (pM(), qs(r_)).WebNNBackend(e);
      Ie().webnnInit([n, () => n.reserveTensorId(), (s) => n.releaseTensorId(s), async (s, a, o, i, l) => n.ensureTensor(s, a, o, i, l), (s, a) => {
        n.uploadTensor(s, a);
      }, async (s, a) => n.downloadTensor(s, a), (s, a) => n.registerMLContext(s, a), !!e.trace]);
    }
  }, br = /* @__PURE__ */ new Map(), yf = (e) => {
    let t = Ie(), r = t.stackSave();
    try {
      let n = t.PTR_SIZE, s = t.stackAlloc(2 * n);
      t._OrtGetInputOutputCount(e, s, s + n) !== 0 && xe("Can't get session input/output count.");
      let a = n === 4 ? "i32" : "i64";
      return [Number(t.getValue(s, a)), Number(t.getValue(s + n, a))];
    } finally {
      t.stackRestore(r);
    }
  }, jo = (e, t) => {
    let r = Ie(), n = r.stackSave(), s = 0;
    try {
      let a = r.PTR_SIZE, o = r.stackAlloc(2 * a);
      r._OrtGetInputOutputMetadata(e, t, o, o + a) !== 0 && xe("Can't get session input/output metadata.");
      let i = Number(r.getValue(o, "*"));
      s = Number(r.getValue(o + a, "*"));
      let l = r.HEAP32[s / 4];
      if (l === 0) return [i, 0];
      let c = r.HEAPU32[s / 4 + 1], d = [];
      for (let h = 0; h < c; h++) {
        let _ = Number(r.getValue(s + 8 + h * a, "*"));
        d.push(_ !== 0 ? r.UTF8ToString(_) : Number(r.getValue(s + 8 + (h + c) * a, "*")));
      }
      return [i, l, d];
    } finally {
      r.stackRestore(n), s !== 0 && r._OrtFree(s);
    }
  }, Ys = (e) => {
    let t = Ie(), r = t._malloc(e.byteLength);
    if (r === 0) throw new Error(`Can't create a session. failed to allocate a buffer of size ${e.byteLength}.`);
    return t.HEAPU8.set(e, r), [r, e.byteLength];
  }, ui = async (e, t) => {
    let r, n, s = Ie();
    Array.isArray(e) ? [r, n] = e : e.buffer === s.HEAPU8.buffer ? [r, n] = [e.byteOffset, e.byteLength] : [r, n] = Ys(e);
    let a = 0, o = 0, i = 0, l = [], c = [], d = [];
    try {
      if ([o, l] = await Yf(t), t?.externalData && s.mountExternalData) {
        let E = [];
        for (let C of t.externalData) {
          let N = typeof C == "string" ? C : C.path, M = typeof C == "string" ? C : C.data;
          E.push(ii(M).then(($) => {
            s.mountExternalData(N, $);
          }));
        }
        await Promise.all(E);
      }
      for (let E of t?.executionProviders ?? []) if ((typeof E == "string" ? E : E.name) === "webnn") {
        if (s.shouldTransferToMLTensor = !1, typeof E != "string") {
          let C = E, N = C?.context, M = C?.gpuDevice, $ = C?.deviceType, R = C?.powerPreference;
          N ? s.currentContext = N : M ? s.currentContext = await s.webnnCreateMLContext(M) : s.currentContext = await s.webnnCreateMLContext({ deviceType: $, powerPreference: R });
        } else s.currentContext = await s.webnnCreateMLContext();
        break;
      }
      a = await s._OrtCreateSession(r, n, o), s.webgpuOnCreateSession?.(a), a === 0 && xe("Can't create a session."), s.jsepOnCreateSession?.(), s.currentContext && (s.webnnRegisterMLContext(a, s.currentContext), s.currentContext = void 0, s.shouldTransferToMLTensor = !0);
      let [h, _] = yf(a), p = !!t?.enableGraphCapture, w = [], v = [], y = [], b = [], k = [];
      for (let E = 0; E < h; E++) {
        let [C, N, M] = jo(a, E);
        C === 0 && xe("Can't get an input name."), c.push(C);
        let $ = s.UTF8ToString(C);
        w.push($), y.push(N === 0 ? { name: $, isTensor: !1 } : { name: $, isTensor: !0, type: Ws(N), shape: M });
      }
      for (let E = 0; E < _; E++) {
        let [C, N, M] = jo(a, E + h);
        C === 0 && xe("Can't get an output name."), d.push(C);
        let $ = s.UTF8ToString(C);
        v.push($), b.push(N === 0 ? { name: $, isTensor: !1 } : { name: $, isTensor: !0, type: Ws(N), shape: M });
        {
          if (p && t?.preferredOutputLocation === void 0) {
            k.push("gpu-buffer");
            continue;
          }
          let R = typeof t?.preferredOutputLocation == "string" ? t.preferredOutputLocation : t?.preferredOutputLocation?.[$] ?? "cpu", W = s.webnnIsGraphOutput;
          if (R === "cpu" && W && W(a, $)) {
            k.push("ml-tensor-cpu-output");
            continue;
          }
          if (R !== "cpu" && R !== "cpu-pinned" && R !== "gpu-buffer" && R !== "ml-tensor") throw new Error(`Not supported preferred output location: ${R}.`);
          if (p && R !== "gpu-buffer") throw new Error(`Not supported preferred output location: ${R}. Only 'gpu-buffer' location is supported when enableGraphCapture is true.`);
          k.push(R);
        }
      }
      let A = null;
      return k.some((E) => E === "gpu-buffer" || E === "ml-tensor" || E === "ml-tensor-cpu-output") && (i = s._OrtCreateBinding(a), i === 0 && xe("Can't create IO binding."), A = { handle: i, outputPreferredLocations: k, outputPreferredLocationsEncoded: k.map((E) => E === "ml-tensor-cpu-output" ? "ml-tensor" : E).map((E) => Xo(E)) }), br.set(a, [a, c, d, A, p, !1]), [a, w, v, y, b];
    } catch (h) {
      throw c.forEach((_) => s._OrtFree(_)), d.forEach((_) => s._OrtFree(_)), i !== 0 && s._OrtReleaseBinding(i) !== 0 && xe("Can't release IO binding."), a !== 0 && s._OrtReleaseSession(a) !== 0 && xe("Can't release session."), h;
    } finally {
      s._free(r), o !== 0 && s._OrtReleaseSessionOptions(o) !== 0 && xe("Can't release session options."), l.forEach((h) => s._free(h)), s.unmountExternalData?.();
    }
  }, di = (e) => {
    let t = Ie(), r = br.get(e);
    if (!r) throw new Error(`cannot release session. invalid session id: ${e}`);
    let [n, s, a, o, i] = r;
    o && (i && t._OrtClearBoundOutputs(o.handle) !== 0 && xe("Can't clear bound outputs."), t._OrtReleaseBinding(o.handle) !== 0 && xe("Can't release IO binding.")), t.jsepOnReleaseSession?.(e), t.webnnOnReleaseSession?.(e), t.webgpuOnReleaseSession?.(e), s.forEach((l) => t._OrtFree(l)), a.forEach((l) => t._OrtFree(l)), t._OrtReleaseSession(n) !== 0 && xe("Can't release session."), br.delete(e);
  }, Wo = async (e, t, r, n, s, a, o = !1) => {
    if (!e) {
      t.push(0);
      return;
    }
    let i = Ie(), l = i.PTR_SIZE, c = e[0], d = e[1], h = e[3], _ = h, p, w;
    if (c === "string" && (h === "gpu-buffer" || h === "ml-tensor")) throw new Error("String tensor is not supported on GPU.");
    if (o && h !== "gpu-buffer") throw new Error(`External buffer must be provided for input/output index ${a} when enableGraphCapture is true.`);
    if (h === "gpu-buffer") {
      let b = e[2].gpuBuffer;
      w = fn(Wr(c), d);
      {
        let k = i.webgpuRegisterBuffer;
        if (!k) throw new Error('Tensor location "gpu-buffer" is not supported without using WebGPU.');
        p = k(b, n);
      }
    } else if (h === "ml-tensor") {
      let b = e[2].mlTensor;
      w = fn(Wr(c), d);
      let k = i.webnnRegisterMLTensor;
      if (!k) throw new Error('Tensor location "ml-tensor" is not supported without using WebNN.');
      p = k(n, b, Wr(c), d);
    } else {
      let b = e[2];
      if (Array.isArray(b)) {
        w = l * b.length, p = i._malloc(w), r.push(p);
        for (let k = 0; k < b.length; k++) {
          if (typeof b[k] != "string") throw new TypeError(`tensor data at index ${k} is not a string`);
          i.setValue(p + k * l, yt(b[k], r), "*");
        }
      } else {
        let k = i.webnnIsGraphInput, A = i.webnnIsGraphOutput;
        if (c !== "string" && k && A) {
          let E = i.UTF8ToString(s);
          if (k(n, E) || A(n, E)) {
            let C = Wr(c);
            w = fn(C, d), _ = "ml-tensor";
            let N = i.webnnCreateTemporaryTensor, M = i.webnnUploadTensor;
            if (!N || !M) throw new Error('Tensor location "ml-tensor" is not supported without using WebNN.');
            let $ = await N(n, C, d);
            M($, new Uint8Array(b.buffer, b.byteOffset, b.byteLength)), p = $;
          } else w = b.byteLength, p = i._malloc(w), r.push(p), i.HEAPU8.set(new Uint8Array(b.buffer, b.byteOffset, w), p);
        } else w = b.byteLength, p = i._malloc(w), r.push(p), i.HEAPU8.set(new Uint8Array(b.buffer, b.byteOffset, w), p);
      }
    }
    let v = i.stackSave(), y = i.stackAlloc(4 * d.length);
    try {
      d.forEach((k, A) => i.setValue(y + A * l, k, l === 4 ? "i32" : "i64"));
      let b = i._OrtCreateTensor(Wr(c), p, w, y, d.length, Xo(_));
      b === 0 && xe(`Can't create tensor for input/output. session=${n}, index=${a}.`), t.push(b);
    } finally {
      i.stackRestore(v);
    }
  }, hi = async (e, t, r, n, s, a) => {
    let o = Ie(), i = o.PTR_SIZE, l = br.get(e);
    if (!l) throw new Error(`cannot run inference. invalid session id: ${e}`);
    let c = l[0], d = l[1], h = l[2], _ = l[3], p = l[4], w = l[5], v = t.length, y = n.length, b = 0, k = [], A = [], E = [], C = [], N = [], M = o.stackSave(), $ = o.stackAlloc(v * i), R = o.stackAlloc(v * i), W = o.stackAlloc(y * i), Q = o.stackAlloc(y * i);
    try {
      [b, k] = Xf(a), xr("wasm prepareInputOutputTensor");
      for (let P = 0; P < v; P++) await Wo(r[P], A, C, e, d[t[P]], t[P], p);
      for (let P = 0; P < y; P++) await Wo(s[P], E, C, e, h[n[P]], v + n[P], p);
      kr("wasm prepareInputOutputTensor");
      for (let P = 0; P < v; P++) o.setValue($ + P * i, A[P], "*"), o.setValue(R + P * i, d[t[P]], "*");
      for (let P = 0; P < y; P++) o.setValue(W + P * i, E[P], "*"), o.setValue(Q + P * i, h[n[P]], "*");
      if (_ && !w) {
        let { handle: P, outputPreferredLocations: X, outputPreferredLocationsEncoded: ce } = _;
        if (d.length !== v) throw new Error(`input count from feeds (${v}) is expected to be always equal to model's input count (${d.length}).`);
        xr("wasm bindInputsOutputs");
        for (let J = 0; J < v; J++) {
          let ne = t[J];
          await o._OrtBindInput(P, d[ne], A[J]) !== 0 && xe(`Can't bind input[${J}] for session=${e}.`);
        }
        for (let J = 0; J < y; J++) {
          let ne = n[J];
          s[J]?.[3] ? (N.push(E[J]), o._OrtBindOutput(P, h[ne], E[J], 0) !== 0 && xe(`Can't bind pre-allocated output[${J}] for session=${e}.`)) : o._OrtBindOutput(P, h[ne], 0, ce[ne]) !== 0 && xe(`Can't bind output[${J}] to ${X[J]} for session=${e}.`);
        }
        kr("wasm bindInputsOutputs"), br.set(e, [c, d, h, _, p, !0]);
      }
      o.jsepOnRunStart?.(c), o.webnnOnRunStart?.(c);
      let H;
      _ ? H = await o._OrtRunWithBinding(c, _.handle, y, W, b) : H = await o._OrtRun(c, R, $, v, Q, y, W, b), H !== 0 && xe("failed to call OrtRun().");
      let q = [], B = [];
      xr("wasm ProcessOutputTensor");
      for (let P = 0; P < y; P++) {
        let X = Number(o.getValue(W + P * i, "*"));
        if (X === E[P] || N.includes(E[P])) {
          q.push(s[P]), X !== E[P] && o._OrtReleaseTensor(X) !== 0 && xe("Can't release tensor.");
          continue;
        }
        let ce = o.stackSave(), J = o.stackAlloc(4 * i), ne = !1, L, O = 0;
        try {
          o._OrtGetTensorData(X, J, J + i, J + 2 * i, J + 3 * i) !== 0 && xe(`Can't access output tensor data on index ${P}.`);
          let G = i === 4 ? "i32" : "i64", ue = Number(o.getValue(J, G));
          O = o.getValue(J + i, "*");
          let ee = o.getValue(J + i * 2, "*"), We = Number(o.getValue(J + i * 3, G)), Pe = [];
          for (let Le = 0; Le < We; Le++) Pe.push(Number(o.getValue(ee + Le * i, G)));
          o._OrtFree(ee) !== 0 && xe("Can't free memory for tensor dims.");
          let be = Pe.reduce((Le, ye) => Le * ye, 1);
          L = Ws(ue);
          let $e = _?.outputPreferredLocations[n[P]];
          if (L === "string") {
            if ($e === "gpu-buffer" || $e === "ml-tensor") throw new Error("String tensor is not supported on GPU.");
            let Le = [];
            for (let ye = 0; ye < be; ye++) {
              let Ye = o.getValue(O + ye * i, "*"), Wt = o.getValue(O + (ye + 1) * i, "*"), Me = ye === be - 1 ? void 0 : Wt - Ye;
              Le.push(o.UTF8ToString(Ye, Me));
            }
            q.push([L, Pe, Le, "cpu"]);
          } else if ($e === "gpu-buffer" && be > 0) {
            let Le = o.webgpuGetBuffer;
            if (!Le) throw new Error('preferredLocation "gpu-buffer" is not supported without using WebGPU.');
            let ye = Le(O), Ye = fn(ue, be);
            if (Ye === void 0 || !ai(L)) throw new Error(`Unsupported data type: ${L}`);
            ne = !0;
            {
              o.webgpuRegisterBuffer(ye, e, O);
              let Wt = o.webgpuCreateDownloader(ye, Ye, e);
              q.push([L, Pe, { gpuBuffer: ye, download: async () => {
                let Me = await Wt();
                return new (rs(L))(Me);
              }, dispose: () => {
                o._OrtReleaseTensor(X) !== 0 && xe("Can't release tensor.");
              } }, "gpu-buffer"]);
            }
          } else if ($e === "ml-tensor" && be > 0) {
            let Le = o.webnnEnsureTensor, ye = o.webnnIsGraphInputOutputTypeSupported;
            if (!Le || !ye) throw new Error('preferredLocation "ml-tensor" is not supported without using WebNN.');
            if (fn(ue, be) === void 0 || !oi(L)) throw new Error(`Unsupported data type: ${L}`);
            if (!ye(e, L, !1)) throw new Error(`preferredLocation "ml-tensor" for ${L} output is not supported by current WebNN Context.`);
            let Ye = await Le(e, O, ue, Pe, !1);
            ne = !0, q.push([L, Pe, { mlTensor: Ye, download: o.webnnCreateMLTensorDownloader(O, L), dispose: () => {
              o.webnnReleaseTensorId(O), o._OrtReleaseTensor(X);
            } }, "ml-tensor"]);
          } else if ($e === "ml-tensor-cpu-output" && be > 0) {
            let Le = o.webnnCreateMLTensorDownloader(O, L)(), ye = q.length;
            ne = !0, B.push((async () => {
              let Ye = [ye, await Le];
              return o.webnnReleaseTensorId(O), o._OrtReleaseTensor(X), Ye;
            })()), q.push([L, Pe, [], "cpu"]);
          } else {
            let Le = rs(L), ye = new Le(be);
            new Uint8Array(ye.buffer, ye.byteOffset, ye.byteLength).set(o.HEAPU8.subarray(O, O + ye.byteLength)), q.push([L, Pe, ye, "cpu"]);
          }
        } finally {
          o.stackRestore(ce), L === "string" && O && o._free(O), ne || o._OrtReleaseTensor(X);
        }
      }
      _ && !p && (o._OrtClearBoundOutputs(_.handle) !== 0 && xe("Can't clear bound outputs."), br.set(e, [c, d, h, _, p, !1]));
      for (let [P, X] of await Promise.all(B)) q[P][2] = X;
      return kr("wasm ProcessOutputTensor"), q;
    } finally {
      o.webnnOnRunEnd?.(c), o.stackRestore(M), r.forEach((H) => {
        H && H[3] === "gpu-buffer" && o.webgpuUnregisterBuffer(H[2].gpuBuffer);
      }), s.forEach((H) => {
        H && H[3] === "gpu-buffer" && o.webgpuUnregisterBuffer(H[2].gpuBuffer);
      }), A.forEach((H) => o._OrtReleaseTensor(H)), E.forEach((H) => o._OrtReleaseTensor(H)), C.forEach((H) => o._free(H)), b !== 0 && o._OrtReleaseRunOptions(b), k.forEach((H) => o._free(H));
    }
  }, fi = (e) => {
    let t = Ie(), r = br.get(e);
    if (!r) throw new Error("invalid session id");
    let n = r[0], s = t._OrtEndProfiling(n);
    s === 0 && xe("Can't get an profile file name."), t._OrtFree(s);
  }, _i = (e) => {
    let t = [];
    for (let r of e) {
      let n = r[2];
      !Array.isArray(n) && "buffer" in n && t.push(n.buffer);
    }
    return t;
  };
}), Mr, At, hn, Zn, es, Us, qo, js, Vr, Ur, bf, a_, o_, i_, l_, c_, u_, d_, h_ = we(() => {
  "use strict";
  Xr(), s_(), Yr(), ri(), Mr = () => !!ze.wasm.proxy && typeof document < "u", hn = !1, Zn = !1, es = !1, js = /* @__PURE__ */ new Map(), Vr = (e, t) => {
    let r = js.get(e);
    r ? r.push(t) : js.set(e, [t]);
  }, Ur = () => {
    if (hn || !Zn || es || !At) throw new Error("worker not ready");
  }, bf = (e) => {
    switch (e.data.type) {
      case "init-wasm":
        hn = !1, e.data.err ? (es = !0, qo[1](e.data.err)) : (Zn = !0, qo[0]()), Us && (URL.revokeObjectURL(Us), Us = void 0);
        break;
      case "init-ep":
      case "copy-from":
      case "create":
      case "release":
      case "run":
      case "end-profiling": {
        let t = js.get(e.data.type);
        e.data.err ? t.shift()[1](e.data.err) : t.shift()[0](e.data.out);
        break;
      }
      default:
    }
  }, a_ = async () => {
    if (!Zn) {
      if (hn) throw new Error("multiple calls to 'initWasm()' detected.");
      if (es) throw new Error("previous call to 'initWasm()' failed.");
      if (hn = !0, Mr()) return new Promise((e, t) => {
        At?.terminate(), Hf().then(([r, n]) => {
          try {
            At = n, At.onerror = (a) => t(a), At.onmessage = bf, qo = [e, t];
            let s = { type: "init-wasm", in: ze };
            !s.in.wasm.wasmPaths && (r || Qo) && (s.in.wasm.wasmPaths = { wasm: new URL("ort-wasm-simd-threaded.asyncify.wasm", import.meta.url).href }), At.postMessage(s), Us = r;
          } catch (s) {
            t(s);
          }
        }, t);
      });
      try {
        await ni(ze.wasm), await li(ze), Zn = !0;
      } catch (e) {
        throw es = !0, e;
      } finally {
        hn = !1;
      }
    }
  }, o_ = async (e) => {
    if (Mr()) return Ur(), new Promise((t, r) => {
      Vr("init-ep", [t, r]);
      let n = { type: "init-ep", in: { epName: e, env: ze } };
      At.postMessage(n);
    });
    await ci(ze, e);
  }, i_ = async (e) => Mr() ? (Ur(), new Promise((t, r) => {
    Vr("copy-from", [t, r]);
    let n = { type: "copy-from", in: { buffer: e } };
    At.postMessage(n, [e.buffer]);
  })) : Ys(e), l_ = async (e, t) => {
    if (Mr()) {
      if (t?.preferredOutputLocation) throw new Error('session option "preferredOutputLocation" is not supported for proxy.');
      return Ur(), new Promise((r, n) => {
        Vr("create", [r, n]);
        let s = { type: "create", in: { model: e, options: { ...t } } }, a = [];
        e instanceof Uint8Array && a.push(e.buffer), At.postMessage(s, a);
      });
    } else return ui(e, t);
  }, c_ = async (e) => {
    if (Mr()) return Ur(), new Promise((t, r) => {
      Vr("release", [t, r]);
      let n = { type: "release", in: e };
      At.postMessage(n);
    });
    di(e);
  }, u_ = async (e, t, r, n, s, a) => {
    if (Mr()) {
      if (r.some((o) => o[3] !== "cpu")) throw new Error("input tensor on GPU is not supported for proxy.");
      if (s.some((o) => o)) throw new Error("pre-allocated output tensor is not supported for proxy.");
      return Ur(), new Promise((o, i) => {
        Vr("run", [o, i]);
        let l = r, c = { type: "run", in: { sessionId: e, inputIndices: t, inputs: l, outputIndices: n, options: a } };
        At.postMessage(c, _i(l));
      });
    } else return hi(e, t, r, n, s, a);
  }, d_ = async (e) => {
    if (Mr()) return Ur(), new Promise((t, r) => {
      Vr("end-profiling", [t, r]);
      let n = { type: "end-profiling", in: e };
      At.postMessage(n);
    });
    fi(e);
  };
}), Ho, Mf, f_, mM = we(() => {
  "use strict";
  Xr(), h_(), _n(), ti(), Kf(), Ho = (e, t) => {
    switch (e.location) {
      case "cpu":
        return [e.type, e.dims, e.data, "cpu"];
      case "gpu-buffer":
        return [e.type, e.dims, { gpuBuffer: e.gpuBuffer }, "gpu-buffer"];
      case "ml-tensor":
        return [e.type, e.dims, { mlTensor: e.mlTensor }, "ml-tensor"];
      default:
        throw new Error(`invalid data location: ${e.location} for ${t()}`);
    }
  }, Mf = (e) => {
    switch (e[3]) {
      case "cpu":
        return new Ot(e[0], e[2], e[1]);
      case "gpu-buffer": {
        let t = e[0];
        if (!ai(t)) throw new Error(`not supported data type: ${t} for deserializing GPU tensor`);
        let { gpuBuffer: r, download: n, dispose: s } = e[2];
        return Ot.fromGpuBuffer(r, { dataType: t, dims: e[1], download: n, dispose: s });
      }
      case "ml-tensor": {
        let t = e[0];
        if (!oi(t)) throw new Error(`not supported data type: ${t} for deserializing MLTensor tensor`);
        let { mlTensor: r, download: n, dispose: s } = e[2];
        return Ot.fromMLTensor(r, { dataType: t, dims: e[1], download: n, dispose: s });
      }
      default:
        throw new Error(`invalid data location: ${e[3]}`);
    }
  }, f_ = class {
    async fetchModelAndCopyToWasmMemory(e) {
      return i_(await ii(e));
    }
    async loadModel(e, t) {
      Hr();
      let r;
      typeof e == "string" ? r = await this.fetchModelAndCopyToWasmMemory(e) : r = e, [this.sessionId, this.inputNames, this.outputNames, this.inputMetadata, this.outputMetadata] = await l_(r, t), Qr();
    }
    async dispose() {
      return c_(this.sessionId);
    }
    async run(e, t, r) {
      Hr();
      let n = [], s = [];
      Object.entries(e).forEach((h) => {
        let _ = h[0], p = h[1], w = this.inputNames.indexOf(_);
        if (w === -1) throw new Error(`invalid input '${_}'`);
        n.push(p), s.push(w);
      });
      let a = [], o = [];
      Object.entries(t).forEach((h) => {
        let _ = h[0], p = h[1], w = this.outputNames.indexOf(_);
        if (w === -1) throw new Error(`invalid output '${_}'`);
        a.push(p), o.push(w);
      });
      let i = n.map((h, _) => Ho(h, () => `input "${this.inputNames[s[_]]}"`)), l = a.map((h, _) => h ? Ho(h, () => `output "${this.outputNames[o[_]]}"`) : null), c = await u_(this.sessionId, s, i, o, l, r), d = {};
      for (let h = 0; h < c.length; h++) d[this.outputNames[o[h]]] = a[h] ?? Mf(c[h]);
      return Qr(), d;
    }
    startProfiling() {
    }
    endProfiling() {
      d_(this.sessionId);
    }
  };
}), __ = {};
ns(__, { OnnxruntimeWebAssemblyBackend: () => Ko, initializeFlags: () => Yo, wasmBackend: () => p_ });
var Yo, Ko, p_, gM = we(() => {
  "use strict";
  Xr(), h_(), mM(), Yo = () => {
    (typeof ze.wasm.initTimeout != "number" || ze.wasm.initTimeout < 0) && (ze.wasm.initTimeout = 0);
    let e = ze.wasm.simd;
    if (typeof e != "boolean" && e !== void 0 && e !== "fixed" && e !== "relaxed" && (console.warn(`Property "env.wasm.simd" is set to unknown value "${e}". Reset it to \`false\` and ignore SIMD feature checking.`), ze.wasm.simd = !1), typeof ze.wasm.proxy != "boolean" && (ze.wasm.proxy = !1), typeof ze.wasm.trace != "boolean" && (ze.wasm.trace = !1), typeof ze.wasm.numThreads != "number" || !Number.isInteger(ze.wasm.numThreads) || ze.wasm.numThreads <= 0) if (typeof self < "u" && !self.crossOriginIsolated) ze.wasm.numThreads = 1;
    else {
      let t = typeof navigator > "u" ? Q0("node:os").cpus().length : navigator.hardwareConcurrency;
      ze.wasm.numThreads = Math.min(4, Math.ceil((t || 1) / 2));
    }
  }, Ko = class {
    async init(e) {
      Yo(), await a_(), await o_(e);
    }
    async createInferenceSessionHandler(e, t) {
      let r = new f_();
      return await r.loadModel(e, t), r;
    }
  }, p_ = new Ko();
});
Xr();
Xr();
Xr();
var wM = "1.31.0-dev.20260914-8d85527a0", vM = Gf;
{
  let e = (gM(), qs(__)).wasmBackend;
  qr("webgpu", e, 5), qr("webnn", e, 5), qr("cpu", e, 10), qr("wasm", e, 10);
}
Object.defineProperty(ze.versions, "web", { value: wM, enumerable: !0 });

// node_modules/onnxruntime-common/dist/esm/version.js
var m_ = "1.30.0";

// node_modules/onnxruntime-common/dist/esm/env-impl.js
var g_ = "warning", mi = {
  wasm: {},
  webgl: {},
  webgpu: {},
  versions: { common: m_ },
  set logLevel(e) {
    if (e !== void 0) {
      if (typeof e != "string" || ["verbose", "info", "warning", "error", "fatal"].indexOf(e) === -1)
        throw new Error(`Unsupported logging level: ${e}`);
      g_ = e;
    }
  },
  get logLevel() {
    return g_;
  }
};
Object.defineProperty(mi, "logLevel", { enumerable: !0 });

// node_modules/onnxruntime-common/dist/esm/tensor-conversion-impl.js
var w_ = (e, t) => {
  let r = typeof document < "u" ? document.createElement("canvas") : new OffscreenCanvas(1, 1);
  r.width = e.dims[3], r.height = e.dims[2];
  let n = r.getContext("2d");
  if (n != null) {
    let s, a;
    t?.tensorLayout !== void 0 && t.tensorLayout === "NHWC" ? (s = e.dims[2], a = e.dims[3]) : (s = e.dims[3], a = e.dims[2]);
    let o = t?.format !== void 0 ? t.format : "RGB", i = t?.norm, l, c;
    i === void 0 || i.mean === void 0 ? l = [255, 255, 255, 255] : typeof i.mean == "number" ? l = [i.mean, i.mean, i.mean, i.mean] : (l = [i.mean[0], i.mean[1], i.mean[2], 0], i.mean[3] !== void 0 && (l[3] = i.mean[3])), i === void 0 || i.bias === void 0 ? c = [0, 0, 0, 0] : typeof i.bias == "number" ? c = [i.bias, i.bias, i.bias, i.bias] : (c = [i.bias[0], i.bias[1], i.bias[2], 0], i.bias[3] !== void 0 && (c[3] = i.bias[3]));
    let d = a * s, h = 0, _ = d, p = d * 2, w = -1;
    o === "RGBA" ? (h = 0, _ = d, p = d * 2, w = d * 3) : o === "RGB" ? (h = 0, _ = d, p = d * 2) : o === "RBG" && (h = 0, p = d, _ = d * 2);
    for (let v = 0; v < a; v++)
      for (let y = 0; y < s; y++) {
        let b = (e.data[h++] - c[0]) * l[0], k = (e.data[_++] - c[1]) * l[1], A = (e.data[p++] - c[2]) * l[2], E = w === -1 ? 255 : (e.data[w++] - c[3]) * l[3];
        n.fillStyle = "rgba(" + b + "," + k + "," + A + "," + E + ")", n.fillRect(y, v, 1, 1);
      }
    if ("toDataURL" in r)
      return r.toDataURL();
    throw new Error("toDataURL is not supported");
  } else
    throw new Error("Can not access image data");
}, v_ = (e, t) => {
  let r = typeof document < "u" ? document.createElement("canvas").getContext("2d") : new OffscreenCanvas(1, 1).getContext("2d"), n;
  if (r != null) {
    let s, a, o;
    t?.tensorLayout !== void 0 && t.tensorLayout === "NHWC" ? (s = e.dims[2], a = e.dims[1], o = e.dims[3]) : (s = e.dims[3], a = e.dims[2], o = e.dims[1]);
    let i = t !== void 0 && t.format !== void 0 ? t.format : "RGB", l = t?.norm, c, d;
    l === void 0 || l.mean === void 0 ? c = [255, 255, 255, 255] : typeof l.mean == "number" ? c = [l.mean, l.mean, l.mean, l.mean] : (c = [l.mean[0], l.mean[1], l.mean[2], 255], l.mean[3] !== void 0 && (c[3] = l.mean[3])), l === void 0 || l.bias === void 0 ? d = [0, 0, 0, 0] : typeof l.bias == "number" ? d = [l.bias, l.bias, l.bias, l.bias] : (d = [l.bias[0], l.bias[1], l.bias[2], 0], l.bias[3] !== void 0 && (d[3] = l.bias[3]));
    let h = a * s;
    if (t !== void 0 && (t.format !== void 0 && o === 4 && t.format !== "RGBA" || o === 3 && t.format !== "RGB" && t.format !== "BGR"))
      throw new Error("Tensor format doesn't match input tensor dims");
    let _ = 4, p = 0, w = 1, v = 2, y = 3, b = 0, k = h, A = h * 2, E = -1;
    i === "RGBA" ? (b = 0, k = h, A = h * 2, E = h * 3) : i === "RGB" ? (b = 0, k = h, A = h * 2) : i === "RBG" && (b = 0, A = h, k = h * 2), n = r.createImageData(s, a);
    for (let C = 0; C < a * s; p += _, w += _, v += _, y += _, C++)
      n.data[p] = (e.data[b++] - d[0]) * c[0], n.data[w] = (e.data[k++] - d[1]) * c[1], n.data[v] = (e.data[A++] - d[2]) * c[2], n.data[y] = E === -1 ? 255 : (e.data[E++] - d[3]) * c[3];
  } else
    throw new Error("Can not access image data");
  return n;
};

// node_modules/onnxruntime-common/dist/esm/tensor-factory-impl.js
var gi = (e, t) => {
  if (e === void 0)
    throw new Error("Image buffer must be defined");
  if (t.height === void 0 || t.width === void 0)
    throw new Error("Image height and width must be defined");
  if (t.tensorLayout === "NHWC")
    throw new Error("NHWC Tensor layout is not supported yet");
  let { height: r, width: n } = t, s = t.norm ?? { mean: 255, bias: 0 }, a, o;
  typeof s.mean == "number" ? a = [s.mean, s.mean, s.mean, s.mean] : a = [s.mean[0], s.mean[1], s.mean[2], s.mean[3] ?? 255], typeof s.bias == "number" ? o = [s.bias, s.bias, s.bias, s.bias] : o = [s.bias[0], s.bias[1], s.bias[2], s.bias[3] ?? 0];
  let i = t.format !== void 0 ? t.format : "RGBA", l = t.tensorFormat !== void 0 && t.tensorFormat !== void 0 ? t.tensorFormat : "RGB", c = r * n, d = l === "RGBA" ? new Float32Array(c * 4) : new Float32Array(c * 3), h = 4, _ = 0, p = 1, w = 2, v = 3, y = 0, b = c, k = c * 2, A = -1;
  i === "RGB" && (h = 3, _ = 0, p = 1, w = 2, v = -1), l === "RGBA" ? A = c * 3 : l === "RBG" ? (y = 0, k = c, b = c * 2) : l === "BGR" && (k = 0, b = c, y = c * 2);
  for (let C = 0; C < c; C++, _ += h, w += h, p += h, v += h)
    d[y++] = (e[_] + o[0]) / a[0], d[b++] = (e[p] + o[1]) / a[1], d[k++] = (e[w] + o[2]) / a[2], A !== -1 && v !== -1 && (d[A++] = (e[v] + o[3]) / a[3]);
  return l === "RGBA" ? new nt("float32", d, [1, 4, r, n]) : new nt("float32", d, [1, 3, r, n]);
}, y_ = async (e, t) => {
  let r = typeof HTMLImageElement < "u" && e instanceof HTMLImageElement, n = typeof ImageData < "u" && e instanceof ImageData, s = typeof ImageBitmap < "u" && e instanceof ImageBitmap, a = typeof e == "string", o, i = t ?? {}, l = () => {
    if (typeof document < "u")
      return document.createElement("canvas");
    if (typeof OffscreenCanvas < "u")
      return new OffscreenCanvas(1, 1);
    throw new Error("Canvas is not supported");
  }, c = (d) => typeof HTMLCanvasElement < "u" && d instanceof HTMLCanvasElement || d instanceof OffscreenCanvas ? d.getContext("2d") : null;
  if (r) {
    let d = l();
    d.width = e.width, d.height = e.height;
    let h = c(d);
    if (h != null) {
      let _ = e.height, p = e.width;
      if (t !== void 0 && t.resizedHeight !== void 0 && t.resizedWidth !== void 0 && (_ = t.resizedHeight, p = t.resizedWidth), t !== void 0) {
        if (i = t, t.tensorFormat !== void 0)
          throw new Error("Image input config format must be RGBA for HTMLImageElement");
        i.tensorFormat = "RGBA", i.height = _, i.width = p;
      } else
        i.tensorFormat = "RGBA", i.height = _, i.width = p;
      h.drawImage(e, 0, 0), o = h.getImageData(0, 0, p, _).data;
    } else
      throw new Error("Can not access image data");
  } else if (n) {
    let d, h;
    if (t !== void 0 && t.resizedWidth !== void 0 && t.resizedHeight !== void 0 ? (d = t.resizedHeight, h = t.resizedWidth) : (d = e.height, h = e.width), t !== void 0 && (i = t), i.format = "RGBA", i.height = d, i.width = h, t !== void 0) {
      let _ = l();
      _.width = h, _.height = d;
      let p = c(_);
      if (p != null)
        p.putImageData(e, 0, 0), o = p.getImageData(0, 0, h, d).data;
      else
        throw new Error("Can not access image data");
    } else
      o = e.data;
  } else if (s) {
    if (t === void 0)
      throw new Error("Please provide image config with format for Imagebitmap");
    let d = l();
    d.width = e.width, d.height = e.height;
    let h = c(d);
    if (h != null) {
      let _ = e.height, p = e.width;
      return h.drawImage(e, 0, 0, p, _), o = h.getImageData(0, 0, p, _).data, i.height = _, i.width = p, gi(o, i);
    } else
      throw new Error("Can not access image data");
  } else {
    if (a)
      return new Promise((d, h) => {
        let _ = l(), p = c(_);
        if (!e || !p)
          return h();
        let w = new Image();
        w.crossOrigin = "Anonymous", w.src = e, w.onload = () => {
          _.width = w.width, _.height = w.height, p.drawImage(w, 0, 0, _.width, _.height);
          let v = p.getImageData(0, 0, _.width, _.height);
          i.height = _.height, i.width = _.width, d(gi(v.data, i));
        };
      });
    throw new Error("Input data provided is not supported - aborted tensor creation");
  }
  if (o !== void 0)
    return gi(o, i);
  throw new Error("Input data provided is not supported - aborted tensor creation");
}, b_ = (e, t) => {
  let { width: r, height: n, download: s, dispose: a } = t, o = [1, n, r, 4];
  return new nt({ location: "texture", type: "float32", texture: e, dims: o, download: s, dispose: a });
}, M_ = (e, t) => {
  let { dataType: r, dims: n, download: s, dispose: a } = t;
  return new nt({ location: "gpu-buffer", type: r ?? "float32", gpuBuffer: e, dims: n, download: s, dispose: a });
}, x_ = (e, t) => {
  let { dataType: r, dims: n, download: s, dispose: a } = t;
  return new nt({ location: "ml-tensor", type: r ?? "float32", mlTensor: e, dims: n, download: s, dispose: a });
}, k_ = (e, t, r) => new nt({ location: "cpu-pinned", type: e, data: t, dims: r ?? [t.length] });

// node_modules/onnxruntime-common/dist/esm/tensor-impl-type-mapping.js
var Kr = /* @__PURE__ */ new Map([
  ["float32", Float32Array],
  ["uint8", Uint8Array],
  ["int8", Int8Array],
  ["uint16", Uint16Array],
  ["int16", Int16Array],
  ["int32", Int32Array],
  ["bool", Uint8Array],
  ["float64", Float64Array],
  ["uint32", Uint32Array],
  ["int4", Uint8Array],
  ["uint4", Uint8Array]
]), ss = /* @__PURE__ */ new Map([
  [Float32Array, "float32"],
  [Uint8Array, "uint8"],
  [Int8Array, "int8"],
  [Uint16Array, "uint16"],
  [Int16Array, "int16"],
  [Int32Array, "int32"],
  [Float64Array, "float64"],
  [Uint32Array, "uint32"]
]), T_ = !1, E_ = () => {
  if (!T_) {
    T_ = !0;
    let e = typeof BigInt64Array < "u" && BigInt64Array.from, t = typeof BigUint64Array < "u" && BigUint64Array.from, r = globalThis.Float16Array, n = typeof r < "u" && r.from;
    e && (Kr.set("int64", BigInt64Array), ss.set(BigInt64Array, "int64")), t && (Kr.set("uint64", BigUint64Array), ss.set(BigUint64Array, "uint64")), n ? (Kr.set("float16", r), ss.set(r, "float16")) : Kr.set("float16", Uint16Array);
  }
};

// node_modules/onnxruntime-common/dist/esm/tensor-utils-impl.js
var A_ = (e) => {
  let t = 1;
  for (let r = 0; r < e.length; r++) {
    let n = e[r];
    if (typeof n != "number" || !Number.isSafeInteger(n))
      throw new TypeError(`dims[${r}] must be an integer, got: ${n}`);
    if (n < 0)
      throw new RangeError(`dims[${r}] must be a non-negative integer, got: ${n}`);
    t *= n;
  }
  return t;
}, C_ = (e, t) => {
  switch (e.location) {
    case "cpu":
      return new nt(e.type, e.data, t);
    case "cpu-pinned":
      return new nt({
        location: "cpu-pinned",
        data: e.data,
        type: e.type,
        dims: t
      });
    case "texture":
      return new nt({
        location: "texture",
        texture: e.texture,
        type: e.type,
        dims: t
      });
    case "gpu-buffer":
      return new nt({
        location: "gpu-buffer",
        gpuBuffer: e.gpuBuffer,
        type: e.type,
        dims: t
      });
    case "ml-tensor":
      return new nt({
        location: "ml-tensor",
        mlTensor: e.mlTensor,
        type: e.type,
        dims: t
      });
    default:
      throw new Error(`tensorReshape: tensor location ${e.location} is not supported`);
  }
};

// node_modules/onnxruntime-common/dist/esm/tensor-impl.js
var nt = class {
  /**
   * implementation.
   */
  constructor(t, r, n) {
    E_();
    let s, a;
    if (typeof t == "object" && "location" in t)
      switch (this.dataLocation = t.location, s = t.type, a = t.dims, t.location) {
        case "cpu-pinned": {
          let i = Kr.get(s);
          if (!i)
            throw new TypeError(`unsupported type "${s}" to create tensor from pinned buffer`);
          if (!(t.data instanceof i))
            throw new TypeError(`buffer should be of type ${i.name}`);
          this.cpuData = t.data;
          break;
        }
        case "texture": {
          if (s !== "float32")
            throw new TypeError(`unsupported type "${s}" to create tensor from texture`);
          this.gpuTextureData = t.texture, this.downloader = t.download, this.disposer = t.dispose;
          break;
        }
        case "gpu-buffer": {
          if (s !== "float32" && s !== "float16" && s !== "int32" && s !== "int64" && s !== "uint32" && s !== "uint8" && s !== "bool" && s !== "uint4" && s !== "int4")
            throw new TypeError(`unsupported type "${s}" to create tensor from gpu buffer`);
          this.gpuBufferData = t.gpuBuffer, this.downloader = t.download, this.disposer = t.dispose;
          break;
        }
        case "ml-tensor": {
          if (s !== "float32" && s !== "float16" && s !== "int32" && s !== "int64" && s !== "uint32" && s !== "uint64" && s !== "int8" && s !== "uint8" && s !== "bool" && s !== "uint4" && s !== "int4")
            throw new TypeError(`unsupported type "${s}" to create tensor from MLTensor`);
          this.mlTensorData = t.mlTensor, this.downloader = t.download, this.disposer = t.dispose;
          break;
        }
        default:
          throw new Error(`Tensor constructor: unsupported location '${this.dataLocation}'`);
      }
    else {
      let i, l;
      if (typeof t == "string")
        if (s = t, l = n, t === "string") {
          if (!Array.isArray(r))
            throw new TypeError("A string tensor's data must be a string array.");
          i = r;
        } else {
          let c = Kr.get(t);
          if (c === void 0)
            throw new TypeError(`Unsupported tensor type: ${t}.`);
          if (Array.isArray(r)) {
            if (t === "float16" && c === Uint16Array || t === "uint4" || t === "int4")
              throw new TypeError(`Creating a ${t} tensor from number array is not supported. Please use ${c.name} as data.`);
            t === "uint64" || t === "int64" ? i = c.from(r, BigInt) : i = c.from(r);
          } else if (r instanceof c)
            i = r;
          else if (r instanceof Uint8ClampedArray)
            if (t === "uint8")
              i = Uint8Array.from(r);
            else
              throw new TypeError("A Uint8ClampedArray tensor's data must be type of uint8");
          else if (t === "float16" && r instanceof Uint16Array && c !== Uint16Array)
            i = new globalThis.Float16Array(r.buffer, r.byteOffset, r.length);
          else
            throw new TypeError(`A ${s} tensor's data must be type of ${c}`);
        }
      else if (l = r, Array.isArray(t)) {
        if (t.length === 0)
          throw new TypeError("Tensor type cannot be inferred from an empty array.");
        let c = typeof t[0];
        if (c === "string")
          s = "string", i = t;
        else if (c === "boolean")
          s = "bool", i = Uint8Array.from(t);
        else
          throw new TypeError(`Invalid element type of data array: ${c}.`);
      } else if (t instanceof Uint8ClampedArray)
        s = "uint8", i = Uint8Array.from(t);
      else {
        let c = ss.get(t.constructor);
        if (c === void 0)
          throw new TypeError(`Unsupported type for tensor data: ${t.constructor}.`);
        s = c, i = t;
      }
      if (l === void 0)
        l = [i.length];
      else if (!Array.isArray(l))
        throw new TypeError("A tensor's dims must be a number array");
      a = l, this.cpuData = i, this.dataLocation = "cpu";
    }
    let o = A_(a);
    if (this.cpuData && o !== this.cpuData.length && !((s === "uint4" || s === "int4") && Math.ceil(o / 2) === this.cpuData.length))
      throw new Error(`Tensor's size(${o}) does not match data length(${this.cpuData.length}).`);
    this.type = s, this.dims = a, this.size = o;
  }
  // #endregion
  // #region factory
  static async fromImage(t, r) {
    return y_(t, r);
  }
  static fromTexture(t, r) {
    return b_(t, r);
  }
  static fromGpuBuffer(t, r) {
    return M_(t, r);
  }
  static fromMLTensor(t, r) {
    return x_(t, r);
  }
  static fromPinnedBuffer(t, r, n) {
    return k_(t, r, n);
  }
  // #endregion
  // #region conversions
  toDataURL(t) {
    return w_(this, t);
  }
  toImageData(t) {
    return v_(this, t);
  }
  // #endregion
  // #region properties
  get data() {
    if (this.ensureValid(), !this.cpuData)
      throw new Error("The data is not on CPU. Use `getData()` to download GPU data to CPU, or use `texture` or `gpuBuffer` property to access the GPU data directly.");
    return this.cpuData;
  }
  get location() {
    return this.dataLocation;
  }
  get texture() {
    if (this.ensureValid(), !this.gpuTextureData)
      throw new Error("The data is not stored as a WebGL texture.");
    return this.gpuTextureData;
  }
  get gpuBuffer() {
    if (this.ensureValid(), !this.gpuBufferData)
      throw new Error("The data is not stored as a WebGPU buffer.");
    return this.gpuBufferData;
  }
  get mlTensor() {
    if (this.ensureValid(), !this.mlTensorData)
      throw new Error("The data is not stored as a WebNN MLTensor.");
    return this.mlTensorData;
  }
  // #endregion
  // #region methods
  async getData(t) {
    switch (this.ensureValid(), this.dataLocation) {
      case "cpu":
      case "cpu-pinned":
        return this.data;
      case "texture":
      case "gpu-buffer":
      case "ml-tensor": {
        if (!this.downloader)
          throw new Error("The current tensor is not created with a specified data downloader.");
        if (this.isDownloading)
          throw new Error("The current tensor is being downloaded.");
        try {
          this.isDownloading = !0;
          let r = await this.downloader();
          return this.downloader = void 0, this.dataLocation = "cpu", this.cpuData = r, t && this.disposer && (this.disposer(), this.disposer = void 0), r;
        } finally {
          this.isDownloading = !1;
        }
      }
      default:
        throw new Error(`cannot get data from location: ${this.dataLocation}`);
    }
  }
  dispose() {
    if (this.isDownloading)
      throw new Error("The current tensor is being downloaded.");
    this.disposer && (this.disposer(), this.disposer = void 0), this.cpuData = void 0, this.gpuTextureData = void 0, this.gpuBufferData = void 0, this.mlTensorData = void 0, this.downloader = void 0, this.isDownloading = void 0, this.dataLocation = "none";
  }
  // #endregion
  // #region tensor utilities
  ensureValid() {
    if (this.dataLocation === "none")
      throw new Error("The tensor is disposed.");
  }
  reshape(t) {
    if (this.ensureValid(), this.downloader || this.disposer)
      throw new Error("Cannot reshape a tensor that owns GPU resource.");
    return C_(this, t);
  }
};

// node_modules/onnxruntime-common/dist/esm/tensor.js
var wi = nt;

// node_modules/@huggingface/transformers/dist/transformers.web.js
var yM = Object.defineProperty, fs = (e, t) => {
  for (var r in t)
    yM(e, r, { get: t[r], enumerable: !0 });
}, xt = {}, Zt = {}, bM = {}, MM = "4.3.1", Qi = typeof self < "u", xn = !Bp(xt), Np = !Bp(Zt), ia = Qi && "caches" in self, xM = typeof globalThis.Deno < "u", Jz = typeof globalThis.Bun < "u", xa = xM && ia && !xn, Dp = typeof process < "u", zp = Dp && process?.release?.name === "node" && !xa, Xi = typeof window < "u" && typeof window.document < "u", Yi = Qi && ["DedicatedWorkerGlobalScope", "ServiceWorkerGlobalScope", "SharedWorkerGlobalScope"].includes(
  self.constructor?.name
), kM = Xi || Yi || xa, TM = zp || typeof navigator < "u" && "gpu" in navigator, EM = typeof navigator < "u" && "ml" in navigator, AM = typeof crypto < "u" && typeof crypto.getRandomValues == "function", CM = (
  // @ts-ignore - chrome may not exist in all environments
  typeof chrome < "u" && typeof chrome.runtime < "u" && typeof chrome.runtime.id == "string"
), SM = (
  // @ts-ignore - ServiceWorkerGlobalScope may not exist in all environments
  typeof ServiceWorkerGlobalScope < "u" && Qi && self instanceof ServiceWorkerGlobalScope
), PM = () => {
  if (typeof navigator > "u")
    return !1;
  let e = navigator.userAgent;
  if (!((navigator.vendor || "").indexOf("Apple") > -1 && !e.match(/CriOS|FxiOS|EdgiOS|OPiOS|mercury|brave/i) && !e.includes("Chrome") && !e.includes("Android")))
    return !1;
  let r = e.match(/Version\/(\d+)/);
  return r ? parseInt(r[1], 10) < 26 : !1;
}, FM = PM(), me = Object.freeze({
  /** Whether we are running in a browser environment (and not a web worker) */
  IS_BROWSER_ENV: Xi,
  /** Whether we are running in a web worker environment */
  IS_WEBWORKER_ENV: Yi,
  /** Whether we are running in a web-like environment (browser, web worker, or Deno web runtime) */
  IS_WEB_ENV: kM,
  /** Whether we are running in a service worker environment */
  IS_SERVICE_WORKER_ENV: SM,
  /** Whether we are running in Deno's web runtime (CDN imports, Cache API available, no filesystem) */
  IS_DENO_WEB_RUNTIME: xa,
  /** Whether the Cache API is available */
  IS_WEB_CACHE_AVAILABLE: ia,
  /** Whether the WebGPU API is available */
  IS_WEBGPU_AVAILABLE: TM,
  /** Whether the WebNN API is available */
  IS_WEBNN_AVAILABLE: EM,
  /** Whether we are running in a Safari browser older than version 26. */
  IS_SAFARI_BELOW_26: FM,
  /** Whether the Node.js process API is available */
  IS_PROCESS_AVAILABLE: Dp,
  /** Whether we are running in a Node.js-like environment (node, deno, bun) */
  IS_NODE_ENV: zp,
  /** Whether the filesystem API is available */
  IS_FS_AVAILABLE: xn,
  /** Whether the path API is available */
  IS_PATH_AVAILABLE: Np,
  /** Whether the crypto API is available */
  IS_CRYPTO_AVAILABLE: AM,
  /** Whether the Chrome runtime API is available */
  IS_CHROME_AVAILABLE: CM
}), Ki = xn && Np, la = "./";
if (Ki) {
  let e = import.meta.url;
  e ? la = Zt.dirname(Zt.dirname(bM.fileURLToPath(e))) : typeof __dirname < "u" && (la = Zt.dirname(__dirname));
}
var IM = Ki ? Zt.join(la, "/.cache/") : null, S_ = "/models/", LM = Ki ? Zt.join(la, S_) : S_, OM = typeof globalThis.fetch == "function" ? globalThis.fetch.bind(globalThis) : void 0, Dt = Object.freeze({
  /** All messages including debug output (value: 10) */
  DEBUG: 10,
  /** Errors, warnings, and info messages (value: 20) */
  INFO: 20,
  /** Errors and warnings (value: 30) */
  WARNING: 30,
  /** Only error messages (value: 40) */
  ERROR: 40,
  /** No logging output (value: 50) */
  NONE: 50
}), P_ = Dt.WARNING, ge = {
  version: MM,
  /////////////////// Backends settings ///////////////////
  // NOTE: These will be populated later by the backends themselves.
  backends: {
    // onnxruntime-web/onnxruntime-node
    onnx: {}
  },
  /////////////////// Logging settings ///////////////////
  get logLevel() {
    return P_;
  },
  set logLevel(e) {
    P_ = e, ge.backends.onnx?.setLogLevel?.(e);
  },
  /////////////////// Model settings ///////////////////
  allowRemoteModels: !0,
  remoteHost: "https://huggingface.co/",
  remotePathTemplate: "{model}/resolve/{revision}/",
  allowLocalModels: !(Xi || Yi || xa),
  // Default to true for non-web environments, false for web environments
  localModelPath: LM,
  useFS: xn,
  /////////////////// Cache settings ///////////////////
  useBrowserCache: ia,
  useFSCache: xn,
  cacheDir: IM,
  useCustomCache: !1,
  customCache: null,
  useWasmCache: ia || xn,
  cacheKey: "transformers-cache",
  experimental_useCrossOriginStorage: !1,
  /////////////////// Custom fetch /////////////////////
  fetch: OM
  //////////////////////////////////////////////////////
};
function Bp(e) {
  return Object.keys(e).length === 0;
}
var mt = (
  /** @type {any} */
  class {
    /**
     * Creates a new instance of the Callable class.
     */
    constructor() {
      let e = function(...t) {
        return e._call(...t);
      };
      return Object.setPrototypeOf(e, new.target.prototype);
    }
    /**
     * This method should be implemented in subclasses to provide the
     * functionality of the callable object.
     *
     * @param {any[]} args
     * @throws {Error} If the subclass does not implement the `_call` method.
     */
    _call(...e) {
      throw Error("Must implement _call method in subclass");
    }
  }
);
function Sr(e, t) {
  e && e(t);
}
var ca = class extends mt {
  /**
   * @param {ProgressCallback} callback The original callback.
   * @param {FilesLoadingMap} files_loading Mutable map storing per-file progress.
   */
  constructor(e, t) {
    super(), this.callback = e, this.files_loading = t, this.loads = /* @__PURE__ */ new Map();
  }
  /**
   * @param {ProgressInfo} info
   */
  _call(e) {
    if (e.status === "progress") {
      this.files_loading[e.file] = {
        loaded: e.loaded,
        total: e.total
      };
      let t = Object.values(this.files_loading).reduce((s, a) => s + a.loaded, 0), r = Object.values(this.files_loading).reduce((s, a) => s + a.total, 0), n = r > 0 ? t / r * 100 : 0;
      this.callback({
        status: "progress_total",
        name: e.name,
        progress: n,
        loaded: t,
        total: r,
        files: structuredClone(this.files_loading)
      });
    }
    this.callback(e);
  }
};
function NM(e) {
  return Number.isInteger(e) || typeof e == "bigint";
}
function F_(e) {
  return e == null || e === -1;
}
function I_(e) {
  let t = [], r = e;
  for (; Array.isArray(r); )
    t.push(r.length), r = r[0];
  return t;
}
function er(...e) {
  return Array.prototype.concat.apply([], e);
}
function DM(...e) {
  return e.reduce((t, r) => t.flatMap((n) => r.map((s) => [n, s])));
}
function ua(e, t) {
  return Math.abs((e + t) % (2 * t) - t);
}
function et(e, t) {
  return Object.assign(
    {},
    ...t.map((r) => {
      if (e[r] !== void 0)
        return { [r]: e[r] };
    })
  );
}
function zM(e, t) {
  let r = 0;
  for (let n of e)
    n === t && ++r;
  return r;
}
var le = {
  /**
   * Log an error message. Only suppressed when logLevel is NONE.
   * @param  {...any} args - Arguments to log
   */
  error(...e) {
    ge.logLevel <= Dt.ERROR && console.error(...e);
  },
  /**
   * Log a warning message. Shown when logLevel <= WARNING.
   * @param  {...any} args - Arguments to log
   */
  warn(...e) {
    ge.logLevel <= Dt.WARNING && console.warn(...e);
  },
  /**
   * Log an info message. Shown when logLevel <= INFO.
   * @param  {...any} args - Arguments to log
   */
  info(...e) {
    ge.logLevel <= Dt.INFO && console.log(...e);
  },
  /**
   * Log a debug message. Only shown when logLevel is DEBUG.
   * @param  {...any} args - Arguments to log
   */
  debug(...e) {
    ge.logLevel <= Dt.DEBUG && console.log(...e);
  },
  /**
   * Log a message (alias for info). Shown when logLevel <= INFO.
   * @param  {...any} args - Arguments to log
   */
  log(...e) {
    this.info(...e);
  }
}, BM = class {
  /**
   * @param dictionary The dictionary of words to use for splitting.
   */
  constructor(e) {
    this.trie = this._build_trie(e);
  }
  /**
   * Builds a trie from the given dictionary.
   * @param dictionary The dictionary of words to build the trie from.
   * @returns The root node of the trie.
   * @private
   */
  _build_trie(e) {
    let t = /* @__PURE__ */ Object.create(null);
    for (let r of e) {
      let n = t;
      for (let s = 0; s < r.length; ++s) {
        let a = r[s];
        n = n[a] ??= /* @__PURE__ */ Object.create(null);
      }
      n.end = r;
    }
    return t;
  }
  /**
   * Splits the input text into tokens based on the dictionary.
   * @param text The input text to split.
   * @returns An array of tokens.
   */
  split(e) {
    let t = [], r = e.length, n = 0, s = 0;
    for (; s < r; ) {
      let a = this.trie, o = null, i = s;
      for (; i < r && (a = a[e[i]]); )
        a.end && (o = a.end), ++i;
      o ? (s > n && t.push(e.slice(n, s)), t.push(o), s += o.length, n = s) : ++s;
    }
    return n < r && t.push(e.slice(n)), t;
  }
}, L_ = BM, RM = class {
  /**
   * Creates a new instance of AddedToken.
   * @param config Added token configuration object.
   */
  constructor(e) {
    this.content = e.content, this.id = e.id, this.single_word = e.single_word ?? !1, this.lstrip = e.lstrip ?? !1, this.rstrip = e.rstrip ?? !1, this.special = e.special ?? !1, this.normalized = e.normalized ?? !this.special;
  }
}, $M = RM, Rp = (e, t) => {
  try {
    return new RegExp(e, t);
  } catch (r) {
    if (!(r instanceof SyntaxError)) throw r;
    let n = /* @__PURE__ */ new Map(), s = e.replace(
      /(\\[pP])\{([^}=]+)\}/g,
      (a, o, i, l) => {
        let c = 0;
        for (let h = l - 1; h >= 0 && e[h] === "\\"; --h)
          ++c;
        if (c % 2 === 1) return a;
        let d = n.get(i);
        if (d === void 0) {
          try {
            new RegExp(`\\p{${i}}`, "u"), d = i;
          } catch {
            d = `Script=${i}`;
          }
          n.set(i, d);
        }
        return `${o}{${d}}`;
      }
    );
    if (s === e) throw r;
    try {
      return new RegExp(s, t);
    } catch {
      throw r;
    }
  }
}, Ji = (e) => e.replace(/ \./g, ".").replace(/ \?/g, "?").replace(/ \!/g, "!").replace(/ ,/g, ",").replace(/ \' /g, "'").replace(/ n't/g, "n't").replace(/ 'm/g, "'m").replace(/ 's/g, "'s").replace(/ 've/g, "'ve").replace(/ 're/g, "'re"), ka = (e, t = !0) => {
  if (e.Regex !== void 0) {
    let r = nx(
      ex(e.Regex)
    );
    return Rp(r, "gu");
  } else if (e.String !== void 0) {
    let r = sx(e.String);
    return new RegExp(t ? r : `(${r})`, "gu");
  } else
    return console.warn("Unknown pattern type:", e), null;
}, Cn = "\\p{Alphabetic}\\p{M}\\p{Nd}\\p{Pc}", $p = `${Cn}\\u00B2\\u00B3\\u00B9\\u00BC-\\u00BE`, tr = `[${$p}]`, Gp = `[^${$p}]`, GM = `(?:(?<!${tr})(?=${tr})|(?<=${tr})(?!${tr}))`, VM = `(?:(?<!${tr})(?!${tr})|(?<=${tr})(?=${tr}))`, UM = "(?:(?<![\\s\\S])|(?<=\\n))", jM = "(?:(?=\\n)|(?![\\s\\S]))", ls = "0-9A-Fa-f", WM = /* @__PURE__ */ new Map([
  ["A", "(?<![\\s\\S])"],
  ["z", "(?![\\s\\S])"],
  ["Z", "(?=\\n?(?![\\s\\S]))"],
  // \Z permits a single optional final \n (not \r\n)
  ["h", `[${ls}]`],
  ["H", `[^${ls}]`],
  ["w", tr],
  ["W", Gp],
  ["d", "\\p{Nd}"],
  ["D", "\\P{Nd}"],
  ["s", "\\p{White_Space}"],
  // JS \s wrongly adds U+FEFF and misses \x85
  ["S", "\\P{White_Space}"],
  ["b", GM],
  ["B", VM],
  ["a", "\\x07"],
  ["e", "\\x1B"]
]), qM = /* @__PURE__ */ new Map([
  ["h", ls],
  ["w", Cn],
  ["d", "\\p{Nd}"],
  ["D", "\\P{Nd}"],
  ["s", "\\p{White_Space}"],
  ["S", "\\P{White_Space}"],
  ["a", "\\x07"],
  ["e", "\\x1B"]
]), HM = /* @__PURE__ */ new Map([
  ["W", `[^${Cn}]`],
  ["H", `[^${ls}]`]
]), Vp = /* @__PURE__ */ new Map([
  [`
`, "\\n"],
  ["\r", "\\r"],
  ["	", "\\t"],
  ["\f", "\\f"],
  ["\v", "\\v"]
]), QM = /* @__PURE__ */ new Map([
  ["alpha", "\\p{Alphabetic}"],
  ["alnum", "\\p{Alphabetic}\\p{Nd}"],
  ["digit", "\\p{Nd}"],
  ["lower", "\\p{Lowercase}"],
  ["upper", "\\p{Uppercase}"],
  ["space", "\\p{White_Space}"],
  ["blank", "\\t\\p{Zs}"],
  ["punct", "\\p{P}\\p{S}"],
  ["cntrl", "\\p{Cc}"],
  ["word", Cn],
  ["xdigit", ls]
]), Up = "^$\\.*+?()[]{}|/", XM = /^\(\?(?:<[=!]|<[A-Za-z_][A-Za-z0-9_]*>|[:=!>])/, jp = /^\\([pPxu])\{([^}]*)\}/, YM = /^\{(\d+(?:,\d*)?|,\d+)\}/, KM = new RegExp("^\\[:(\\^?)(\\p{Alphabetic}+):\\]", "u"), JM = /^\[:\^:\]/, ZM = /^\[(?:\.[^\]]*\.\]|=[^\]]*=\])/, Wp = /^(?:\\x[0-9A-Fa-f]{2}|\\u[0-9A-Fa-f]{4}|\\c[A-Za-z])/, qp = (e) => e >= "A" && e <= "Z" || e >= "a" && e <= "z", da = (e, t) => String.fromCodePoint(e.codePointAt(t)), O_ = (e) => {
  if (!/^[0-9A-Fa-f]{1,8}$/.test(e)) return null;
  let t = Number.parseInt(e, 16);
  if (t > 127) return null;
  let r = String.fromCharCode(t);
  return qp(r) ? `[${r.toLowerCase()}${r.toUpperCase()}]` : null;
}, ex = (e) => e.replace(/\[\^\(\\s\|\[([^\]]+)\]\)\]/g, "[^()|\\s$1]"), Hp = "[\\s\\S]", N_ = 256, D_ = () => ({
  fragment: "",
  alternatives: [],
  tail: null,
  contains_complex_set: !1
}), Zi = (e) => {
  throw new SyntaxError(
    `Unsupported range with a set-valued character-class operand at index ${e}`
  );
}, ha = (e, t, r, n = !0) => {
  e.tail === "range" && Zi(r), e.alternatives.push(t), e.tail = "set", e.contains_complex_set = e.contains_complex_set || n;
}, Pr = (e, t, r = !1, n = -1) => {
  if (r && e.tail === "range" && Zi(n), e.tail === "range") {
    e.fragment += t, e.tail = "complete_range";
    return;
  }
  e.fragment += t, e.tail = r ? "set" : "scalar", e.contains_complex_set = e.contains_complex_set || r;
}, tx = (e, t, r) => {
  let n = jp.exec(e.slice(t));
  if (n) {
    let [_, p, w] = n;
    if (p === "P" && w === "Word")
      ha(
        r,
        `[^${Cn}]`,
        t
      );
    else {
      let v = p === "x" ? `\\u{${w}}` : p === "p" && w === "Word" ? Cn : _;
      Pr(
        r,
        v,
        p === "p" || p === "P",
        t
      );
    }
    return t + _.length;
  }
  let s = Wp.exec(e.slice(t));
  if (s)
    return Pr(r, s[0]), t + s[0].length;
  if (t + 1 >= e.length)
    throw new SyntaxError(
      `Unterminated escape in character class at index ${t}`
    );
  let a = da(e, t + 1), o = t + 1 + a.length, i = Vp.get(a);
  if (i !== void 0)
    return Pr(r, i), o;
  let l = HM.get(a);
  if (l !== void 0)
    return ha(r, l, t), o;
  let c = qM.get(a), d, h = !1;
  return c !== void 0 ? (d = c, h = a !== "a" && a !== "e") : /[A-Za-z0-9]/.test(a) ? d = `\\${a}` : Up.includes(a) || a === "-" ? d = `\\${a}` : d = a, Pr(r, d, h, t), o;
}, Qp = (e) => e.length === 1 ? e[0] : `(?:(?=(?:${e.join("|")}))${Hp})`, z_ = (e) => {
  let t = e.fragment.length === 0 ? e.alternatives : [`[${e.fragment}]`, ...e.alternatives];
  return Qp(t);
}, rx = (e) => {
  let t = Rp(`^(?:${e})$`, "u"), r = "";
  for (let n = 0; n < 26; ++n) {
    let s = String.fromCharCode(65 + n), a = String.fromCharCode(97 + n), o = t.test(s), i = t.test(a);
    o !== i && (r += o ? a : s);
  }
  return r;
}, Xp = (e, t, r, n = !0, s = 1) => {
  if (s > N_)
    throw new SyntaxError(
      `Maximum character-class nesting depth of ${N_} exceeded at index ${t}`
    );
  let a = t + 1, o = e[a] === "^";
  o && ++a;
  let i = a, l = [D_()], c = l[0], d = !1;
  for (; a < e.length; ) {
    let h = da(e, a);
    if (h === "\\") {
      a = tx(e, a, c);
      continue;
    }
    if (h === "]") {
      if (a === i) {
        Pr(c, "\\]"), ++a;
        continue;
      }
      if (c.tail === null)
        throw l.length > 1 ? new SyntaxError(
          `Malformed character-class intersection with an empty operand at index ${a}`
        ) : new SyntaxError(`Empty character class at index ${t}`);
      let _ = l.some(
        (k) => k.contains_complex_set
      );
      if (o && l.length > 1 && d)
        throw new SyntaxError(
          `Unsupported outer-negated character-class intersection with a nested negated class containing a Unicode property, POSIX class, or shorthand at index ${t}`
        );
      let p = z_(l[0]), w = p;
      if (l.length > 1) {
        let k = "";
        for (let A = 1; A < l.length; ++A)
          k += `(?=${z_(l[A])})`;
        w = `(?:${k}${p})`;
      }
      let v = l.length === 1 && c.alternatives.length === 0, y = c.fragment;
      if (r && n) {
        let k = rx(w);
        k.length > 0 && (v ? (y += k, w = `[${y}]`) : w = Qp([
          w,
          `[${k}]`
        ]));
      }
      return {
        atom: o ? v ? `[^${y}]` : `(?:(?!${w})${Hp})` : w,
        end: a + 1,
        negated: o,
        contains_complex_set: _,
        contains_nested_negated_complex_set: d
      };
    }
    if (e.startsWith("&&", a)) {
      if (c.tail === null)
        throw new SyntaxError(
          `Malformed character-class intersection with an empty operand at index ${a}`
        );
      c = D_(), l.push(c), a += 2;
      continue;
    }
    if (h === "[") {
      let _ = e.slice(a);
      if (JM.test(_))
        throw new SyntaxError(
          `Malformed empty negated POSIX character class at index ${a}`
        );
      let p = KM.exec(_);
      if (p) {
        let [, v, y] = p, b = QM.get(y);
        if (b === void 0)
          throw new SyntaxError(
            `Unsupported POSIX character class "${y}" at index ${a}`
          );
        if (r && v && (y === "lower" || y === "upper"))
          throw new SyntaxError(
            `Unsupported negated POSIX ${y} class inside an inline case-insensitive group`
          );
        v ? ha(c, `[^${b}]`, a) : Pr(c, b, !0, a), a += p[0].length;
        continue;
      }
      if (ZM.test(_))
        throw new SyntaxError(
          `Unsupported POSIX collating or equivalence bracket expression at index ${a}`
        );
      let w = Xp(
        e,
        a,
        r,
        !1,
        s + 1
      );
      ha(
        c,
        w.atom,
        a,
        w.contains_complex_set
      ), d ||= w.contains_nested_negated_complex_set || w.negated && w.contains_complex_set, a = w.end;
      continue;
    }
    if (h === "-") {
      let _ = e[a + 1] === "]" || e.startsWith("&&", a + 1);
      c.tail === "set" && !_ && Zi(a), c.tail === null || c.tail === "range" || c.tail === "complete_range" || _ ? Pr(c, "\\-") : (c.fragment += "-", c.tail = "range"), ++a;
      continue;
    }
    Pr(
      c,
      h === "^" && c.fragment.length === 0 ? "\\^" : h
    ), a += h.length;
  }
  throw new SyntaxError(
    `${l.length > 1 ? "Unterminated character-class intersection" : "Unterminated character class"} at index ${t}`
  );
}, nx = (e) => {
  let t = "", r = -1, n = !1, s = !1, a = [], o = (i) => {
    r = t.length, t += i, n = !1;
  };
  for (let i = 0; i < e.length; ) {
    let l = da(e, i);
    if (l === "\\") {
      let c = jp.exec(e.slice(i));
      if (c) {
        let [v, y, b] = c, k = v;
        if (y === "x") {
          let A = `\\u{${b}}`;
          k = s ? O_(b) ?? A : A;
        } else b === "Word" && (k = y === "p" ? tr : Gp);
        o(k), i += v.length;
        continue;
      }
      let d = Wp.exec(e.slice(i));
      if (d) {
        let v = d[0], y = s && v[1] !== "c" ? O_(v.slice(2)) ?? v : v;
        o(y), i += v.length;
        continue;
      }
      if (i + 1 >= e.length) {
        t += l;
        break;
      }
      let h = da(e, i + 1);
      if (i += 1 + h.length, h === "G")
        continue;
      let _ = Vp.get(h);
      if (_ !== void 0) {
        o(_);
        continue;
      }
      let p = WM.get(h), w;
      p !== void 0 ? w = p : /[A-Za-z0-9]/.test(h) ? w = `\\${h}` : Up.includes(h) ? w = `\\${h}` : w = h, o(w);
      continue;
    }
    switch (l) {
      case "[": {
        let c = Xp(e, i, s);
        o(c.atom), i = c.end;
        continue;
      }
      case "]":
        o("\\]"), ++i;
        continue;
      case ".":
        o("[^\\n]"), ++i;
        continue;
      case "^":
        o(UM), ++i;
        continue;
      case "$":
        o(jM), ++i;
        continue;
      case "(": {
        let c = e.startsWith("(?i:", i), d = c ? "(?i:" : XM.exec(e.slice(i))?.[0] ?? "(", h = c || d === "(?>" ? "(?:" : d;
        a.push([t.length, s]), c && (s = !0), t += h, n = !1, i += d.length;
        continue;
      }
      case ")":
        t += l, [r, s] = a.pop() ?? [-1, !1], n = !1, ++i;
        continue;
      case "|":
        t += l, r = -1, n = !1, ++i;
        continue;
      case "{": {
        let c = YM.exec(e.slice(i));
        if (!c || r < 0) {
          o("\\{"), ++i;
          continue;
        }
        let d = c[1].startsWith(",") ? `0${c[1]}` : c[1];
        i += c[0].length;
        let h = e[i];
        h === "+" || h === "*" ? (t = `${t.slice(0, r)}(?:${t.slice(r)}{${d}})${h}`, ++i) : t += `{${d}}`, n = !0;
        continue;
      }
      case "}":
        o("\\}"), ++i;
        continue;
      case "+":
        if (n) {
          ++i;
          continue;
        }
        t += l, n = !0, ++i;
        continue;
      case "*":
      case "?":
        t += l, n = !0, ++i;
        continue;
      default:
        o(
          s && qp(l) ? `[${l.toLowerCase()}${l.toUpperCase()}]` : l
        ), i += l.length;
        continue;
    }
  }
  return t;
}, sx = (e) => e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), ax = (e, t, r) => {
  let n = [], s = 0;
  for (; s < e.length; ) {
    if (n.push(e[s]), (t.get(e[s]) ?? r) !== r) {
      ++s;
      continue;
    }
    for (; ++s < e.length && (t.get(e[s]) ?? r) === r; )
      t.get(n.at(-1)) !== r && (n[n.length - 1] += e[s]);
  }
  return n;
}, ox = (e) => e >= 19968 && e <= 40959 || e >= 13312 && e <= 19903 || e >= 131072 && e <= 173791 || e >= 173824 && e <= 177983 || e >= 177984 && e <= 178207 || e >= 178208 && e <= 183983 || e >= 63744 && e <= 64255 || e >= 194560 && e <= 195103, ix = (e) => Number.isInteger(e) || typeof e == "bigint", lx = (e) => {
  let t = 0;
  for (let r of e) ++t;
  return t;
}, cx = (e) => Yp(e.toLowerCase()), zt = (...e) => Array.prototype.concat.apply([], e), el = (e) => new Map(Object.entries(e)), ux = (e, t) => {
  let r = [], n = 0;
  for (let s of e.matchAll(t)) {
    let a = s[0];
    n < s.index && r.push(e.slice(n, s.index)), a.length > 0 && r.push(a), n = s.index + a.length;
  }
  return n < e.length && r.push(e.slice(n)), r;
}, Yp = (e) => e.replace(new RegExp("\\p{M}", "gu"), ""), B_ = (e, t, r = []) => {
  if (!e || Array.isArray(e) || typeof e != "object")
    return `${t} must be a valid object`;
  for (let n of r)
    if (!(n in e))
      return `${t} must contain a "${n}" property`;
  return null;
}, dx = (e) => e.match(/\S+/g) || [], hx = class {
  /**
   * Creates a new instance of the Callable class.
   */
  constructor() {
    let e = function(...t) {
      return e._call(...t);
    };
    return Object.setPrototypeOf(e, new.target.prototype);
  }
}, _s = hx, fx = class extends _s {
  /**
   * @param config The configuration object for the normalizer.
   */
  constructor(e) {
    super(), this.config = e;
  }
  /**
   * Alias for {@link Normalizer#normalize}.
   * @param text The text to normalize.
   * @returns The normalized text.
   */
  _call(e) {
    return this.normalize(e);
  }
}, pr = fx, _x = class extends pr {
  /**
   * Adds whitespace around any CJK (Chinese, Japanese, or Korean) character in the input text.
   *
   * @param text The input text to tokenize.
   * @returns The tokenized text with whitespace added around CJK characters.
   */
  tokenize_chinese_chars(e) {
    let t = [];
    for (let r = 0; r < e.length; ++r) {
      let n = e[r], s = n.charCodeAt(0);
      ox(s) ? (t.push(" "), t.push(n), t.push(" ")) : t.push(n);
    }
    return t.join("");
  }
  /**
   * Strips accents from the given text.
   * @param text The text to strip accents from.
   * @returns The text with accents removed.
   */
  strip_accents(e) {
    return e.normalize("NFD").replace(new RegExp("\\p{Mn}", "gu"), "");
  }
  /**
   * Checks whether `char` is a control character.
   * @param char The character to check.
   * @returns Whether `char` is a control character.
   */
  is_control(e) {
    switch (e) {
      case "	":
      case `
`:
      case "\r":
        return !1;
      default:
        return new RegExp("^\\p{Cc}|\\p{Cf}|\\p{Co}|\\p{Cs}$", "u").test(e);
    }
  }
  /**
   * Performs invalid character removal and whitespace cleanup on text.
   * @param text The text to clean.
   * @returns The cleaned text.
   */
  clean_text(e) {
    let t = [];
    for (let r of e) {
      let n = r.charCodeAt(0);
      n === 0 || n === 65533 || this.is_control(r) || (/^\s$/.test(r) ? t.push(" ") : t.push(r));
    }
    return t.join("");
  }
  /**
   * Normalizes the given text based on the configuration.
   * @param text The text to normalize.
   * @returns The normalized text.
   */
  normalize(e) {
    return this.config.clean_text && (e = this.clean_text(e)), this.config.handle_chinese_chars && (e = this.tokenize_chinese_chars(e)), this.config.lowercase ? (e = e.toLowerCase(), this.config.strip_accents !== !1 && (e = this.strip_accents(e))) : this.config.strip_accents && (e = this.strip_accents(e)), e;
  }
}, px = _x, mx = class extends pr {
  /**
   * Create a new instance of Precompiled normalizer.
   * @param config The configuration object.
   */
  constructor(e) {
    super(e), this.charsmap = e.precompiled_charsmap ?? null;
  }
  /**
   * Normalizes the given text by applying the precompiled charsmap.
   * @param text The text to normalize.
   * @returns The normalized text.
   */
  normalize(e) {
    return e = e.replace(
      /[\u0001-\u0008\u000B\u000E-\u001F\u007F\u008F\u009F]/gm,
      ""
    ), e = e.replace(
      /[\u0009\u000A\u000C\u000D\u00A0\u1680\u2000-\u200F\u2028\u2029\u202F\u205F\u2581\u3000\uFEFF\uFFFD]/gm,
      " "
    ), e.includes("\uFF5E") ? e = e.split("\uFF5E").map((r) => r.normalize("NFKC")).join("\uFF5E") : e = e.normalize("NFKC"), e;
  }
}, gx = mx, wx = class extends pr {
  /**
   * Create a new instance of NormalizerSequence.
   * @param config The configuration object.
   */
  constructor(e) {
    super(e), this.normalizers = (e.normalizers ?? []).map(
      (t) => Kp(t)
    );
  }
  /**
   * Apply a sequence of Normalizers to the input text.
   * @param text The text to normalize.
   * @returns The normalized text.
   */
  normalize(e) {
    return this.normalizers.reduce((t, r) => r ? r.normalize(t) : t, e);
  }
}, vx = wx, yx = class extends pr {
  /**
   * @param config The configuration object for the normalizer.
   */
  constructor(e) {
    super(e), this.pattern = ka(this.config.pattern ?? {});
  }
  /**
   * Normalize the input text by replacing the pattern with the content.
   * @param text The input text to be normalized.
   * @returns The normalized text after replacing the pattern with the content.
   */
  normalize(e) {
    return this.pattern === null ? e : e.replaceAll(this.pattern, this.config.content ?? "");
  }
}, bx = yx, Mx = class extends pr {
  constructor() {
    super(...arguments), this.form = "NFC";
  }
  /**
   * Normalize the input text by applying Unicode normalization.
   * @param text The input text to be normalized.
   * @returns The normalized text.
   */
  normalize(e) {
    return e = e.normalize(this.form), e;
  }
}, Ta = Mx, xx = class extends Ta {
  constructor() {
    super(...arguments), this.form = "NFC";
  }
}, kx = xx, Tx = class extends Ta {
  constructor() {
    super(...arguments), this.form = "NFD";
  }
}, Ex = Tx, Ax = class extends Ta {
  constructor() {
    super(...arguments), this.form = "NFKC";
  }
}, Cx = Ax, Sx = class extends Ta {
  constructor() {
    super(...arguments), this.form = "NFKD";
  }
}, Px = Sx, Fx = class extends pr {
  /**
   * Strip leading and/or trailing whitespace from the input text.
   * @param text The input text.
   * @returns The normalized text.
   */
  normalize(e) {
    return this.config.strip_left && this.config.strip_right ? e = e.trim() : (this.config.strip_left && (e = e.trimStart()), this.config.strip_right && (e = e.trimEnd())), e;
  }
}, Ix = Fx, Lx = class extends pr {
  /**
   * Remove all accents from the text.
   * @param text The input text.
   * @returns The normalized text without accents.
   */
  normalize(e) {
    return Yp(e);
  }
}, Ox = Lx, Nx = class extends pr {
  /**
   * Lowercases the input string.
   * @param {string} text The text to normalize.
   * @returns {string} The normalized text.
   */
  normalize(e) {
    return e.toLowerCase();
  }
}, Dx = Nx, zx = class extends pr {
  /**
   * Prepends the input string.
   * @param text The text to normalize.
   * @returns The normalized text.
   */
  normalize(e) {
    return e = this.config.prepend + e, e;
  }
}, Bx = zx;
function Rx(e) {
  if (e === null) return null;
  switch (e.type) {
    case "BertNormalizer":
      return new px(e);
    case "Precompiled":
      return new gx(e);
    case "Sequence":
      return new vx(e);
    case "Replace":
      return new bx(e);
    case "NFC":
      return new kx(e);
    case "NFD":
      return new Ex(e);
    case "NFKC":
      return new Cx(e);
    case "NFKD":
      return new Px(e);
    case "Strip":
      return new Ix(e);
    case "StripAccents":
      return new Ox(e);
    case "Lowercase":
      return new Dx(e);
    case "Prepend":
      return new Bx(e);
    default:
      throw new Error(`Unknown Normalizer type: ${e.type}`);
  }
}
var Kp = Rx, $x = class extends _s {
  /**
   * Tokenizes the given text into pre-tokens.
   * @param text The text or array of texts to pre-tokenize.
   * @param options Additional options for the pre-tokenization logic.
   * @returns An array of pre-tokens.
   */
  pre_tokenize(e, t) {
    return (Array.isArray(e) ? e.map((r) => this.pre_tokenize_text(r, t)) : this.pre_tokenize_text(e, t)).flat();
  }
  /**
   * Alias for {@link PreTokenizer#pre_tokenize}.
   * @param text The text or array of texts to pre-tokenize.
   * @param options Additional options for the pre-tokenization logic.
   * @returns An array of pre-tokens.
   */
  _call(e, t) {
    return this.pre_tokenize(e, t);
  }
}, $t = $x, Jp = (() => {
  let e = [
    ...Array.from(
      { length: 94 },
      (s, a) => a + 33
    ),
    ...Array.from(
      { length: 12 },
      (s, a) => a + 161
    ),
    ...Array.from(
      { length: 82 },
      (s, a) => a + 174
    )
  ], t = e.slice(), r = 0;
  for (let s = 0; s < 256; ++s)
    e.includes(s) || (e.push(s), t.push(256 + r), r += 1);
  let n = t.map((s) => String.fromCharCode(s));
  return Object.fromEntries(e.map((s, a) => [s, n[a]]));
})(), Gx = (e) => Object.fromEntries(Object.entries(e).map(([t, r]) => [r, t])), Vx = Gx(Jp), fa = "\\p{P}\\u0021-\\u002F\\u003A-\\u0040\\u005B-\\u0060\\u007B-\\u007E", Ux = class extends $t {
  /**
   * Creates a new instance of the `ByteLevelPreTokenizer` class.
   * @param config The configuration object.
   */
  constructor(e) {
    super(), this.config = e, this.add_prefix_space = this.config.add_prefix_space ?? !1, this.trim_offsets = this.config.trim_offsets ?? !1, this.use_regex = this.config.use_regex ?? !0, this.pattern = new RegExp("'s|'t|'re|'ve|'m|'ll|'d| ?\\p{L}+| ?\\p{N}+| ?[^\\s\\p{L}\\p{N}]+|\\s+(?!\\S)|\\s+", "gu"), this.byte_encoder = Jp, this.text_encoder = new TextEncoder();
  }
  /**
   * Tokenizes a single piece of text using byte-level tokenization.
   * @param text The text to tokenize.
   * @param options Additional options for the pre-tokenization logic.
   * @returns An array of tokens.
   */
  pre_tokenize_text(e, t) {
    return this.add_prefix_space && !e.startsWith(" ") && (e = " " + e), (this.use_regex ? e.match(this.pattern) || [] : [e]).map(
      (n) => Array.from(
        this.text_encoder.encode(n),
        (s) => this.byte_encoder[s]
      ).join("")
    );
  }
}, jx = Ux, Wx = class extends $t {
  /**
   * Pre-tokenizes the input text by splitting it on word boundaries.
   * @param text The text to be pre-tokenized.
   * @param options Additional options for the pre-tokenization logic.
   * @returns An array of tokens produced by splitting the input text on whitespace.
   */
  pre_tokenize_text(e, t) {
    return e.match(/\w+|[^\w\s]+/g) || [];
  }
}, qx = Wx, Hx = class extends $t {
  /**
   * @param config The configuration object for the MetaspacePreTokenizer.
   */
  constructor(e) {
    super(), this.replacement = e.replacement ?? "\u2581", this.str_rep = e.str_rep || this.replacement, this.prepend_scheme = e.prepend_scheme ?? "always";
  }
  /**
   * This method takes a string, replaces spaces with the replacement character,
   * adds a prefix space if requested, and returns a new list of tokens.
   * @param text The text to pre-tokenize.
   * @param options The options for the pre-tokenization.
   * @returns A new list of pre-tokenized tokens.
   */
  pre_tokenize_text(e, t) {
    let { section_index: r = void 0 } = t ?? {}, n = e.replaceAll(" ", this.str_rep);
    return (
      // We add a prefix space if:
      //  (1) The normalized token does not already start with the replacement character.
      !n.startsWith(this.replacement) && // and (2) either:
      //  (a) prepend_scheme is 'always'
      //  (b) prepend_scheme is 'first' and this is the first section
      (this.prepend_scheme === "always" || this.prepend_scheme === "first" && r === 0) && (n = this.str_rep + n), [n]
    );
  }
}, Qx = Hx, Xx = class extends $t {
  /**
   * @param config The configuration options for the pre-tokenizer.
   */
  constructor(e) {
    super(), this.config = e, this.pattern = ka(
      this.config.pattern ?? {},
      this.config.invert ?? !0
    );
  }
  /**
   * Tokenizes text by splitting it using the given pattern.
   * @param text The text to tokenize.
   * @returns An array of tokens.
   */
  pre_tokenize_text(e) {
    return this.pattern === null ? [] : this.config.invert ? (e.match(this.pattern) || []).filter((t) => t) : this.config.behavior?.toLowerCase() === "removed" ? e.split(this.pattern).filter((t) => t) : ux(e, this.pattern);
  }
}, Yx = Xx, Kx = class extends $t {
  /**
   * @param config The configuration options for the pre-tokenizer.
   */
  constructor(e) {
    super(), this.config = e, this.pattern = new RegExp(
      `[^${fa}]+|[${fa}]+`,
      "gu"
    );
  }
  /**
   * Tokenizes text by splitting it using the given pattern.
   * @param text The text to tokenize.
   * @returns An array of tokens.
   */
  pre_tokenize_text(e) {
    return e.match(this.pattern) || [];
  }
}, Jx = Kx, Zx = class extends $t {
  /**
   * @param config The configuration options for the pre-tokenizer.
   */
  constructor(e) {
    super(), this.config = e;
    let t = `[^\\d]+|\\d${this.config.individual_digits ? "" : "+"}`;
    this.pattern = new RegExp(t, "gu");
  }
  /**
   * Tokenizes text by splitting it using the given pattern.
   * @param text The text to tokenize.
   * @returns An array of tokens.
   */
  pre_tokenize_text(e) {
    return e.match(this.pattern) || [];
  }
}, e1 = Zx, t1 = class extends $t {
  /**
   * A PreTokenizer that splits text into wordpieces using a basic tokenization scheme
   * similar to that used in the original implementation of BERT.
   */
  constructor() {
    super(), this.pattern = new RegExp(
      `[^\\s${fa}]+|[${fa}]`,
      "gu"
    );
  }
  /**
   * Tokenizes a single text using the BERT pre-tokenization scheme.
   *
   * @param text The text to tokenize.
   * @param options Additional options for the pre-tokenization logic.
   * @returns An array of tokens.
   */
  pre_tokenize_text(e, t) {
    return e.trim().match(this.pattern) || [];
  }
}, r1 = t1, n1 = class extends $t {
  /**
   * @param config The configuration options for the pre-tokenizer.
   */
  constructor(e) {
    super(), this.config = e, this.pattern = ka(this.config.pattern ?? {}), this.content = this.config.content ?? "";
  }
  /**
   * Pre-tokenizes the input text by replacing certain characters.
   * @param text The text to be pre-tokenized.
   * @returns An array of tokens produced by replacing certain characters.
   */
  pre_tokenize_text(e) {
    return this.pattern === null ? [e] : [e.replaceAll(this.pattern, this.config.content ?? "")];
  }
}, s1 = n1, a1 = class extends $t {
  /**
   * Creates an instance of PreTokenizerSequence.
   * @param config The configuration object for the pre-tokenizer sequence.
   */
  constructor(e) {
    super(), this.tokenizers = (e.pretokenizers ?? []).map(
      (t) => Zp(t)
    );
  }
  /**
   * Applies each pre-tokenizer in the sequence to the input text in turn.
   * @param text The text to pre-tokenize.
   * @param options Additional options for the pre-tokenization logic.
   * @returns The pre-tokenized text.
   */
  pre_tokenize_text(e, t) {
    return this.tokenizers.reduce(
      (r, n) => n ? n.pre_tokenize(r, t) : r,
      [e]
    );
  }
}, o1 = a1, i1 = class extends $t {
  /**
   * Pre-tokenizes the input text by splitting it on whitespace characters.
   * @param text The text to be pre-tokenized.
   * @returns An array of tokens produced by splitting the input text on whitespace.
   */
  pre_tokenize_text(e) {
    return dx(e);
  }
}, l1 = i1, c1 = class extends $t {
  /**
   * @param config The configuration options for the pre-tokenizer.
   */
  constructor(e) {
    super(), this.config = e, this._length = e.length;
  }
  /**
   * Pre-tokenizes the input text by splitting it into fixed-length tokens.
   * @param text The text to be pre-tokenized.
   * @returns An array of tokens produced by splitting the input text into fixed-length tokens.
   */
  pre_tokenize_text(e) {
    let t = [];
    for (let r = 0; r < e.length; r += this._length)
      t.push(e.slice(r, r + this._length));
    return t;
  }
}, u1 = c1;
function d1(e) {
  if (e === null) return null;
  switch (e.type) {
    case "BertPreTokenizer":
      return new r1();
    case "Sequence":
      return new o1(e);
    case "Whitespace":
      return new qx();
    case "WhitespaceSplit":
      return new l1();
    case "Metaspace":
      return new Qx(e);
    case "ByteLevel":
      return new jx(e);
    case "Split":
      return new Yx(e);
    case "Punctuation":
      return new Jx(e);
    case "Digits":
      return new e1(e);
    case "Replace":
      return new s1(e);
    case "FixedLength":
      return new u1(e);
    default:
      throw new Error(`Unknown PreTokenizer type: ${e.type}`);
  }
}
var Zp = d1, h1 = class extends _s {
  /**
   * Creates a new instance of TokenizerModel.
   * @param config The configuration object for the TokenizerModel.
   */
  constructor(e) {
    super(), this.config = e, this.vocab = [], this.tokens_to_ids = /* @__PURE__ */ new Map(), this.unk_token_id = void 0, this.unk_token = void 0, this.end_of_word_suffix = void 0, this.fuse_unk = this.config.fuse_unk ?? !1;
  }
  /**
   * Internal function to call the TokenizerModel instance.
   * @param tokens The tokens to encode.
   * @returns The encoded tokens.
   */
  _call(e) {
    let t = this.encode(e);
    return this.fuse_unk && (t = ax(t, this.tokens_to_ids, this.unk_token_id)), t;
  }
}, Ea = h1, f1 = class extends Ea {
  /**
   * @param config The configuration object.
   */
  constructor(e) {
    super(e), this.max_input_chars_per_word = 100, this.tokens_to_ids = el(e.vocab), this.unk_token_id = this.tokens_to_ids.get(e.unk_token), this.unk_token = e.unk_token, this.max_input_chars_per_word = e.max_input_chars_per_word ?? 100, this.vocab = new Array(this.tokens_to_ids.size);
    for (let [t, r] of this.tokens_to_ids)
      this.vocab[r] = t;
  }
  /**
   * Encodes an array of tokens using WordPiece encoding.
   * @param tokens The tokens to encode.
   * @returns An array of encoded tokens.
   */
  encode(e) {
    let t = [];
    for (let r of e) {
      let n = [...r];
      if (n.length > this.max_input_chars_per_word) {
        t.push(this.unk_token);
        continue;
      }
      let s = !1, a = 0, o = [];
      for (; a < n.length; ) {
        let i = n.length, l = null;
        for (; a < i; ) {
          let c = n.slice(a, i).join("");
          if (a > 0 && (c = this.config.continuing_subword_prefix + c), this.tokens_to_ids.has(c)) {
            l = c;
            break;
          }
          --i;
        }
        if (l === null) {
          s = !0;
          break;
        }
        o.push(l), a = i;
      }
      s ? t.push(this.unk_token) : t.push(...o);
    }
    return t;
  }
}, R_ = f1, $_ = class em {
  /**
   * Create a new CharTrieNode.
   * @param is_leaf Whether the node is a leaf node or not.
   * @param children A map containing the node's children, where the key is a character and the value is a `CharTrieNode`.
   */
  constructor(t, r) {
    this.is_leaf = t, this.children = r;
  }
  /**
   * Returns a new `CharTrieNode` instance with default values.
   * @returns A new `CharTrieNode` instance with `is_leaf` set to `false` and an empty `children` map.
   */
  static default() {
    return new em(!1, /* @__PURE__ */ new Map());
  }
}, _1 = class {
  constructor() {
    this.root = $_.default();
  }
  /**
   * Adds one or more `texts` to the trie.
   * @param texts The strings to add to the trie.
   */
  extend(e) {
    for (let t of e)
      this.push(t);
  }
  /**
   * Adds text to the trie.
   * @param text The string to add to the trie.
   */
  push(e) {
    let t = this.root;
    for (let r of e) {
      let n = t.children.get(r);
      n === void 0 && (n = $_.default(), t.children.set(r, n)), t = n;
    }
    t.is_leaf = !0;
  }
  /**
   * Searches the trie for stored strings that match `chars` starting at `start`.
   * @param chars The input characters to search.
   * @param start The index to start searching from.
   * @yields Each stored string that is a prefix of `chars` starting at `start`.
   */
  *common_prefix_search(e, t = 0) {
    let r = this.root;
    if (r === void 0) return;
    let n = "";
    for (let s = t; s < e.length; ++s) {
      let a = e[s];
      if (n += a, r = r.children.get(a), r === void 0) return;
      r.is_leaf && (yield n);
    }
  }
}, p1 = _1, vi = class tm {
  /**
   * Represents a node in a token lattice for a given sentence.
   * @param token_id The ID of the token associated with this node.
   * @param node_id The ID of this node.
   * @param pos The starting position of the token in the sentence.
   * @param length The length of the token.
   * @param score The score associated with the token.
   */
  constructor(t, r, n, s, a) {
    this.token_id = t, this.node_id = r, this.pos = n, this.length = s, this.score = a, this.prev = null, this.backtrace_score = 0;
  }
  /**
   * Returns a clone of this node.
   * @returns A clone of this node.
   */
  clone() {
    let t = new tm(
      this.token_id,
      this.node_id,
      this.pos,
      this.length,
      this.score
    );
    return t.prev = this.prev, t.backtrace_score = this.backtrace_score, t;
  }
}, m1 = class {
  /**
   * Creates a new TokenLattice instance.
   *
   * @param sentence The input sentence to be tokenized.
   * @param bos_token_id The beginning-of-sequence token ID.
   * @param eos_token_id The end-of-sequence token ID.
   */
  constructor(e, t, r) {
    this.chars = Array.from(e), this.len = this.chars.length, this.bos_token_id = t, this.eos_token_id = r, this.nodes = [], this.begin_nodes = Array.from(
      { length: this.len + 1 },
      () => []
    ), this.end_nodes = Array.from({ length: this.len + 1 }, () => []);
    let n = new vi(this.bos_token_id ?? 0, 0, 0, 0, 0), s = new vi(
      this.eos_token_id ?? 0,
      1,
      this.len,
      0,
      0
    );
    this.nodes.push(n.clone()), this.nodes.push(s.clone()), this.begin_nodes[this.len].push(s), this.end_nodes[0].push(n);
  }
  /**
   * Inserts a new token node into the token lattice.
   *
   * @param pos The starting position of the token.
   * @param length The length of the token.
   * @param score The score of the token.
   * @param token_id The token ID of the token.
   */
  insert(e, t, r, n) {
    let s = this.nodes.length, a = new vi(n, s, e, t, r);
    this.begin_nodes[e].push(a), this.end_nodes[e + t].push(a), this.nodes.push(a);
  }
  /**
   * Implements the Viterbi algorithm to compute the most likely sequence of tokens.
   *
   * @returns The most likely sequence of tokens.
   */
  viterbi() {
    let e = this.len, t = 0;
    for (; t <= e; ) {
      if (this.begin_nodes[t].length == 0)
        return [];
      for (let o of this.begin_nodes[t]) {
        o.prev = null;
        let i = 0, l = null;
        for (let c of this.end_nodes[t]) {
          let d = c.backtrace_score + o.score;
          (l === null || d > i) && (l = c.clone(), i = d);
        }
        if (l !== null)
          o.prev = l, o.backtrace_score = i;
        else
          return [];
      }
      ++t;
    }
    let r = [], s = this.begin_nodes[e][0].prev;
    if (s === null)
      return [];
    let a = s.clone();
    for (; a.prev !== null; )
      r.push(a.clone()), a = a.clone().prev.clone();
    return r.reverse(), r;
  }
  /**
   * Get the text piece for a given node.
   * @param node The node to get the piece for.
   * @returns The array of nodes representing the most likely sequence of tokens.
   */
  piece(e) {
    return this.chars.slice(e.pos, e.pos + e.length).join("");
  }
  /**
   * @returns The most likely sequence of tokens.
   */
  tokens() {
    return this.viterbi().map((t) => this.piece(t));
  }
  /**
   * @returns The most likely sequence of token ids.
   */
  token_ids() {
    return this.viterbi().map((t) => t.token_id);
  }
}, g1 = m1;
function w1(e) {
  if (e.length === 0) throw new Error("Array must not be empty");
  let t = e[0], r = 0;
  for (let n = 1; n < e.length; ++n)
    e[n] < t && (t = e[n], r = n);
  return [t, r];
}
var v1 = class extends Ea {
  /**
   * Create a new Unigram tokenizer model.
   * @param config The configuration object for the Unigram model.
   * @param eos_token
   */
  constructor(e, t) {
    super(e);
    let r = e.vocab.length;
    this.vocab = new Array(r), this.scores = new Array(r);
    for (let n = 0; n < r; ++n)
      [this.vocab[n], this.scores[n]] = e.vocab[n];
    this.unk_token_id = e.unk_id, this.unk_token = this.vocab[e.unk_id], this.tokens_to_ids = new Map(this.vocab.map((n, s) => [n, s])), this.bos_token = " ", this.bos_token_id = this.tokens_to_ids.get(this.bos_token), this.eos_token = t, this.eos_token_id = this.tokens_to_ids.get(this.eos_token), this.unk_token = this.vocab[this.unk_token_id], this.min_score = w1(this.scores)[0], this.unk_score = this.min_score - 10, this.scores[this.unk_token_id] = this.unk_score, this.trie = new p1(), this.trie.extend(this.vocab), this.fuse_unk = !0;
  }
  /**
   * Populates lattice nodes.
   * @param lattice The token lattice to populate with nodes.
   */
  populate_nodes(e) {
    let t = e.chars, r = 1, n = 0;
    for (; n < t.length; ) {
      let s = !1, a = this.trie.common_prefix_search(t, n);
      for (let o of a) {
        let i = this.tokens_to_ids.get(o), l = this.scores[i], c = lx(o);
        e.insert(n, c, l, i), !s && c === r && (s = !0);
      }
      s || e.insert(n, r, this.unk_score, this.unk_token_id), n += r;
    }
  }
  /**
   * Encodes an array of tokens into an array of subtokens using the unigram model.
   *
   * @param normalized The normalized string.
   * @returns An array of subtokens obtained by encoding the input tokens using the unigram model.
   */
  tokenize(e) {
    let t = new g1(
      e,
      this.bos_token_id,
      this.eos_token_id
    );
    return this.populate_nodes(t), t.tokens();
  }
  /**
   * Encodes an array of tokens using Unigram encoding.
   * @param tokens The tokens to encode.
   * @returns An array of encoded tokens.
   */
  encode(e) {
    let t = [];
    for (let r of e) {
      let n = this.tokenize(r);
      t.push(...n);
    }
    return t;
  }
}, G_ = v1, y1 = class {
  /**
   * Create a new PriorityQueue.
   * @param comparator Comparator function to determine priority. Defaults to a MaxHeap.
   * @param max_size Maximum size of the queue. Defaults to Infinity.
   */
  constructor(e = (r, n) => r > n, t = 1 / 0) {
    this._heap = [], this._comparator = e, this._max_size = t;
  }
  /**
   * The size of the queue
   */
  get size() {
    return this._heap.length;
  }
  /**
   * Check if the queue is empty.
   * @returns `true` if the queue is empty, `false` otherwise.
   */
  is_empty() {
    return this.size === 0;
  }
  /**
   * Return the element with the highest priority in the queue.
   * @returns The highest priority element in the queue.
   */
  peek() {
    return this._heap[0];
  }
  /**
   * Add one or more elements to the queue.
   * @param values The values to push into the queue.
   * @returns The new size of the queue.
   */
  push(...e) {
    return this.extend(e);
  }
  /**
   * Add multiple elements to the queue.
   * @param values The values to push into the queue.
   * @returns The new size of the queue.
   */
  extend(e) {
    for (let t of e)
      if (this.size < this._max_size)
        this._heap.push(t), this._sift_up();
      else {
        let r = this._smallest();
        this._comparator(t, this._heap[r]) && (this._heap[r] = t, this._sift_up_from(r));
      }
    return this.size;
  }
  /**
   * Remove and return the element with the highest priority in the queue.
   * @returns The element with the highest priority in the queue.
   */
  pop() {
    let e = this.peek(), t = this.size - 1;
    return t > 0 && this._swap(0, t), this._heap.pop(), this._sift_down(), e;
  }
  /**
   * Replace the element with the highest priority in the queue with a new value.
   * @param value The new value.
   * @returns The replaced value.
   */
  replace(e) {
    let t = this.peek();
    return this._heap[0] = e, this._sift_down(), t;
  }
  /**
   * Compute the index for the parent of the node at index `i`.
   * @param i The index of the node to get the parent of.
   * @returns The index of the parent node.
   * @private
   */
  _parent(e) {
    return (e + 1 >>> 1) - 1;
  }
  /**
   * Compute the index for the left child of the node at index `i`.
   * @param i The index of the node to get the left child of.
   * @returns The index of the left child.
   * @private
   */
  _left(e) {
    return (e << 1) + 1;
  }
  /**
   * Compute the index for the right child of the node at index `i`.
   * @param i The index of the node to get the right child of.
   * @returns The index of the right child.
   * @private
   */
  _right(e) {
    return e + 1 << 1;
  }
  /**
   * Check if the element at index `i` is greater than the element at index `j`.
   * @param i The index of the first element to compare.
   * @param j The index of the second element to compare.
   * @returns `true` if the element at index `i` is greater than the element at index `j`, `false` otherwise.
   * @private
   */
  _greater(e, t) {
    return this._comparator(this._heap[e], this._heap[t]);
  }
  /**
   * Swap the elements at indices `i` and `j`.
   * @param i The index of the first element to swap.
   * @param j The index of the second element to swap.
   * @private
   */
  _swap(e, t) {
    let r = this._heap[e];
    this._heap[e] = this._heap[t], this._heap[t] = r;
  }
  /**
   * Maintain the heap property by updating positions in the heap,
   * starting at the last element and moving up the heap.
   * @private
   */
  _sift_up() {
    this._sift_up_from(this.size - 1);
  }
  /**
   * Helper function to sift up from a given node.
   * @param node The index of the node to start sifting up from.
   */
  _sift_up_from(e) {
    for (; e > 0 && this._greater(e, this._parent(e)); )
      this._swap(e, this._parent(e)), e = this._parent(e);
  }
  /**
   * Maintain the heap property by updating positions in the heap,
   * starting at the first element and moving down the heap.
   * @private
   */
  _sift_down() {
    let e = 0;
    for (; this._left(e) < this.size && this._greater(this._left(e), e) || this._right(e) < this.size && this._greater(this._right(e), e); ) {
      let t = this._right(e) < this.size && this._greater(this._right(e), this._left(e)) ? this._right(e) : this._left(e);
      this._swap(e, t), e = t;
    }
  }
  /**
   * Get the index of the smallest element in the heap. Since we use an array-based heap,
   * the index can be computed without needing to traverse the heap.
   * @private
   */
  _smallest() {
    return 2 ** Math.floor(Math.log2(this.size)) - 1;
  }
}, b1 = y1, M1 = class {
  /**
   * Creates an LRUCache instance.
   * @param capacity The maximum number of items the cache can hold.
   */
  constructor(e) {
    this.capacity = e, this.cache = /* @__PURE__ */ new Map();
  }
  /**
   * Retrieves the value associated with the given key and marks the key as recently used.
   * @param key The key to retrieve.
   * @returns The value associated with the key, or undefined if the key does not exist.
   */
  get(e) {
    if (!this.cache.has(e)) return;
    let t = this.cache.get(e);
    return this.cache.delete(e), this.cache.set(e, t), t;
  }
  /**
   * Inserts or updates the key-value pair in the cache.
   * If the key already exists, it is updated and marked as recently used.
   * If the cache exceeds its capacity, the least recently used item is evicted.
   * @param key The key to add or update.
   * @param value The value to associate with the key.
   */
  put(e, t) {
    this.cache.has(e) && this.cache.delete(e), this.cache.set(e, t), this.cache.size > this.capacity && this.cache.delete(this.cache.keys().next().value);
  }
  /**
   * Clears the cache.
   */
  clear() {
    this.cache.clear();
  }
}, x1 = M1, k1 = class extends Ea {
  /**
   * Create a BPE instance.
   * @param config The configuration object for BPE.
   */
  constructor(e) {
    super(e), this.tokens_to_ids = el(e.vocab), this.unk_token_id = this.tokens_to_ids.get(e.unk_token), this.unk_token = e.unk_token, this.vocab = new Array(this.tokens_to_ids.size);
    for (let [r, n] of this.tokens_to_ids)
      this.vocab[n] = r;
    let t = Array.isArray(e.merges[0]);
    this.merges = t ? e.merges : e.merges.map(
      (r) => r.split(" ", 2)
    ), this.bpe_ranks = new Map(this.merges.map((r, n) => [JSON.stringify(r), n])), this.end_of_word_suffix = e.end_of_word_suffix, this.continuing_subword_suffix = e.continuing_subword_suffix ?? null, this.byte_fallback = this.config.byte_fallback ?? !1, this.byte_fallback && (this.text_encoder = new TextEncoder()), this.ignore_merges = this.config.ignore_merges ?? !1, this.max_length_to_cache = 256, this.cache_capacity = 1e4, this.cache = new x1(this.cache_capacity);
  }
  /**
   * Clears the cache.
   */
  clear_cache() {
    this.cache.clear();
  }
  /**
   * Apply Byte-Pair-Encoding (BPE) to a given token. Efficient heap-based priority
   * queue implementation adapted from https://github.com/belladoreai/llama-tokenizer-js.
   * @param token The token to encode.
   * @returns The BPE encoded tokens.
   */
  bpe(e) {
    if (e.length === 0)
      return [];
    let t = this.cache.get(e);
    if (t !== void 0)
      return t;
    let r = Array.from(e);
    this.end_of_word_suffix && (r[r.length - 1] += this.end_of_word_suffix);
    let n = [];
    if (r.length > 1) {
      let s = new b1((i, l) => i.score < l.score), a = {
        token: r[0],
        bias: 0,
        prev: null,
        next: null
      }, o = a;
      for (let i = 1; i < r.length; ++i) {
        let l = {
          bias: i / r.length,
          // Add fractional component to break ties
          token: r[i],
          prev: o,
          next: null
        };
        o.next = l, this.add_node(s, o), o = l;
      }
      for (; !s.is_empty(); ) {
        let i = s.pop();
        if (i.deleted || !i.next || i.next.deleted) continue;
        if (i.deleted = !0, i.next.deleted = !0, i.prev) {
          let c = { ...i.prev };
          i.prev.deleted = !0, i.prev = c, c.prev ? c.prev.next = c : a = c;
        }
        let l = {
          token: i.token + i.next.token,
          bias: i.bias,
          prev: i.prev,
          next: i.next.next
        };
        l.prev ? (l.prev.next = l, this.add_node(s, l.prev)) : a = l, l.next && (l.next.prev = l, this.add_node(s, l));
      }
      for (let i = a; i !== null; i = i.next)
        n.push(i.token);
    } else
      n = r;
    if (this.continuing_subword_suffix)
      for (let s = 0; s < n.length - 1; ++s)
        n[s] += this.continuing_subword_suffix;
    return e.length < this.max_length_to_cache && this.cache.put(e, n), n;
  }
  /**
   * Helper function to add a node to the priority queue.
   * @param queue
   * @param node
   */
  add_node(e, t) {
    let r = this.bpe_ranks.get(
      JSON.stringify([t.token, t.next.token])
    );
    r !== void 0 && (t.score = r + t.bias, e.push(t));
  }
  /**
   * Encodes the input sequence of tokens using the BPE algorithm and returns the resulting subword tokens.
   * @param tokens The input sequence of tokens to encode.
   * @returns The resulting subword tokens after applying the BPE algorithm to the input sequence of tokens.
   */
  encode(e) {
    let t = [];
    for (let r of e) {
      if (this.ignore_merges && this.tokens_to_ids.has(r)) {
        t.push(r);
        continue;
      }
      let n = this.bpe(r);
      for (let s of n)
        if (this.tokens_to_ids.has(s))
          t.push(s);
        else if (this.byte_fallback) {
          let a = Array.from(this.text_encoder.encode(s)).map(
            (o) => `<0x${o.toString(16).toUpperCase().padStart(2, "0")}>`
          );
          a.every((o) => this.tokens_to_ids.has(o)) ? t.push(...a) : this.unk_token != null && t.push(this.unk_token);
        } else this.unk_token != null && t.push(this.unk_token);
    }
    return t;
  }
}, V_ = k1, T1 = class extends Ea {
  /**
   * Create a Legacy tokenizer model instance.
   * @param config The configuration object for Legacy tokenizer model.
   * @param more_config Additional configuration object for the Legacy tokenizer model.
   */
  constructor(e, t) {
    super(e);
    let r = e.vocab;
    this.tokens_to_ids = el(
      t.target_lang ? r[t.target_lang] : r
    ), this.bos_token = t.bos_token, this.bos_token_id = this.tokens_to_ids.get(this.bos_token), this.eos_token = t.eos_token, this.eos_token_id = this.tokens_to_ids.get(this.eos_token), this.pad_token = t.pad_token, this.pad_token_id = this.tokens_to_ids.get(this.pad_token), this.unk_token = t.unk_token, this.unk_token_id = this.tokens_to_ids.get(this.unk_token), this.vocab = new Array(this.tokens_to_ids.size);
    for (let [n, s] of this.tokens_to_ids)
      this.vocab[s] = n;
  }
  encode(e) {
    return e;
  }
}, E1 = T1;
function A1(e, t) {
  switch (e.type) {
    case "WordPiece":
      return new R_(e);
    case "Unigram":
      return new G_(e, t.eos_token);
    case "BPE":
      return new V_(e);
    default:
      if (e.vocab)
        return Array.isArray(e.vocab) ? new G_(e, t.eos_token) : Object.hasOwn(e, "continuing_subword_prefix") && Object.hasOwn(e, "unk_token") ? Object.hasOwn(e, "merges") ? new V_(e) : new R_(e) : new E1(e, {
          target_lang: t.target_lang,
          bos_token: t.bos_token,
          eos_token: t.eos_token,
          pad_token: t.pad_token,
          unk_token: t.unk_token
        });
      throw new Error(
        `Unknown TokenizerModel type: ${e?.type}`
      );
  }
}
var C1 = A1, S1 = class extends _s {
  /**
   * @param config The configuration for the post-processor.
   */
  constructor(e) {
    super(), this.config = e;
  }
  /**
   * Alias for {@link PostProcessor#post_process}.
   * @param tokens The text or array of texts to post-process.
   * @param args Additional arguments required by the post-processing logic.
   * @returns The post-processed tokens.
   */
  _call(e, ...t) {
    return this.post_process(e, ...t);
  }
}, ps = S1, P1 = class extends ps {
  /**
   * Replaces special tokens in the template with actual tokens.
   * @param tokens The list of tokens for the first sequence.
   * @param tokens_pair The list of tokens for the second sequence (optional).
   * @param add_special_tokens Whether to add the special tokens to the beginning and end of the input.
   * @returns An object containing the list of tokens with the special tokens replaced with actual tokens.
   */
  post_process(e, t = null, r = !0) {
    let n = t === null ? this.config.single : this.config.pair, s = [], a = [];
    for (let o of n)
      "SpecialToken" in o ? r && (s.push(o.SpecialToken.id), a.push(o.SpecialToken.type_id)) : "Sequence" in o && (o.Sequence.id === "A" ? (s = zt(s, e), a = zt(
        a,
        new Array(e.length).fill(o.Sequence.type_id)
      )) : o.Sequence.id === "B" && (s = zt(s, t), a = zt(
        a,
        new Array(t.length).fill(o.Sequence.type_id)
      )));
    return { tokens: s, token_type_ids: a };
  }
}, F1 = P1, I1 = class extends ps {
  /**
   * Post process the given tokens.
   * @param tokens The list of tokens for the first sequence.
   * @param tokens_pair The list of tokens for the second sequence (optional).
   * @returns An object containing the post-processed tokens.
   */
  post_process(e, t = null) {
    return { tokens: e, tokens_pair: t };
  }
}, L1 = I1, O1 = class extends ps {
  /**
   * @param config The configuration for the post-processor.
   * @param config.cls The special tokens to add to the beginning of the input.
   * @param config.sep The special tokens to add to the end of the input.
   */
  constructor(e) {
    super(e), this.sep = e.sep, this.cls = e.cls;
  }
  /**
   * Adds the special tokens to the beginning and end of the input.
   * @param tokens The input tokens.
   * @param tokens_pair An optional second set of input tokens.
   * @param add_special_tokens Whether to add the special tokens to the beginning and end of the input.
   * @returns The post-processed tokens with the special tokens added to the beginning and end.
   */
  post_process(e, t = null, r = !0) {
    r && (e = zt([this.cls[0]], e, [this.sep[0]]));
    let n = new Array(e.length).fill(0);
    if (t) {
      let s = [], a = r ? [this.sep[0]] : [];
      e = zt(e, s, t, a), n = zt(
        n,
        new Array(t.length + s.length + a.length).fill(1)
      );
    }
    return { tokens: e, token_type_ids: n };
  }
}, N1 = O1, D1 = class extends ps {
  /**
   * @param config The configuration for the post-processor.
   * @param config.cls The special tokens to add to the beginning of the input.
   * @param config.sep The special tokens to add to the end of the input.
   */
  constructor(e) {
    super(e), this.sep = e.sep, this.cls = e.cls;
  }
  /**
   * Adds the special tokens to the beginning and end of the input.
   * @param tokens The input tokens.
   * @param tokens_pair An optional second set of input tokens.
   * @param add_special_tokens Whether to add the special tokens to the beginning and end of the input.
   * @returns The post-processed tokens with the special tokens added to the beginning and end.
   */
  post_process(e, t, r = !0) {
    r && (e = zt([this.cls[0]], e, [this.sep[0]]));
    let n = new Array(e.length).fill(0);
    if (t) {
      let s = r ? [this.sep[0]] : [], a = r ? [this.sep[0]] : [];
      e = zt(e, s, t, a), n = zt(
        n,
        new Array(t.length + s.length + a.length).fill(1)
      );
    }
    return { tokens: e, token_type_ids: n };
  }
}, z1 = D1, B1 = class extends ps {
  /**
   * Creates a new instance of Sequence post-processor.
   * @param config The configuration object.
   */
  constructor(e) {
    super(e), this.processors = (e.processors ?? []).map((t) => rm(t));
  }
  /**
   * Post process the given tokens.
   * @param tokens The list of tokens for the first sequence.
   * @param tokens_pair The list of tokens for the second sequence (optional).
   * @param add_special_tokens Whether to add the special tokens to the beginning and end of the input.
   * @returns An object containing the post-processed tokens.
   */
  post_process(e, t = null, r = !0) {
    let n = { tokens: e, tokens_pair: t };
    for (let s of this.processors)
      n = s.post_process(
        n.tokens,
        n.tokens_pair,
        r
      );
    return n;
  }
}, R1 = B1;
function $1(e) {
  if (e === null) return null;
  switch (e.type) {
    case "TemplateProcessing":
      return new F1(e);
    case "ByteLevel":
      return new L1(e);
    case "BertProcessing":
      return new N1(e);
    case "RobertaProcessing":
      return new z1(e);
    case "Sequence":
      return new R1(e);
    default:
      throw new Error(`Unknown PostProcessor type: ${e.type}`);
  }
}
var rm = $1, G1 = class extends _s {
  /**
   * Creates an instance of `Decoder`.
   * @param config The configuration object.
   **/
  constructor(e) {
    super(), this.config = e, this.added_tokens = [], this.end_of_word_suffix = null, this.trim_offsets = "trim_offsets" in e ? e.trim_offsets : !1;
  }
  /**
   * Calls the `decode` method.
   *
   * @param tokens The list of tokens.
   * @returns The decoded string.
   */
  _call(e) {
    return this.decode(e);
  }
  /**
   * Decodes a list of tokens.
   * @param tokens The list of tokens.
   * @returns The decoded string.
   */
  decode(e) {
    return this.decode_chain(e).join("");
  }
}, Gt = G1, V1 = class extends Gt {
  /**
   * Create a `ByteLevelDecoder` object.
   */
  constructor(e) {
    super(e), this.byte_decoder = Vx, this.text_decoder = new TextDecoder("utf-8", {
      fatal: !1,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      ignoreBOM: !0
    }), this.end_of_word_suffix = null;
  }
  /**
   * Convert an array of tokens to string by decoding each byte.
   * @param tokens Array of tokens to be decoded.
   * @returns The decoded string.
   */
  convert_tokens_to_string(e) {
    let t = e.join(""), r = new Uint8Array(
      [...t].map((n) => this.byte_decoder[n])
    );
    return this.text_decoder.decode(r);
  }
  decode_chain(e) {
    let t = [], r = [];
    for (let n of e)
      this.added_tokens.find((s) => s.content === n) !== void 0 ? (r.length > 0 && (t.push(this.convert_tokens_to_string(r)), r = []), t.push(n)) : r.push(n);
    return r.length > 0 && t.push(this.convert_tokens_to_string(r)), t;
  }
}, U1 = V1, j1 = class extends Gt {
  /**
   * Creates a new instance of WordPieceDecoder.
   * @param config The configuration object.
   */
  constructor(e) {
    super(e), this.cleanup = e.cleanup;
  }
  decode_chain(e) {
    return e.map((t, r) => {
      if (r !== 0) {
        let n = this.config.prefix;
        n && t.startsWith(n) ? t = t.replace(n, "") : t = " " + t;
      }
      return this.cleanup && (t = Ji(t)), t;
    });
  }
}, W1 = j1, q1 = class extends Gt {
  /**
   * Constructs a new MetaspaceDecoder object.
   * @param config The configuration object for the MetaspaceDecoder.
   */
  constructor(e) {
    super(e), this.replacement = e.replacement ?? "\u2581";
  }
  decode_chain(e) {
    let t = [];
    for (let r = 0; r < e.length; ++r) {
      let n = e[r].replaceAll(this.replacement, " ");
      r == 0 && n.startsWith(" ") && (n = n.substring(1)), t.push(n);
    }
    return t;
  }
}, H1 = q1, Q1 = class extends Gt {
  constructor(e) {
    super(e), this.suffix = e.suffix ?? "";
  }
  decode_chain(e) {
    return e.map((t, r) => t.replaceAll(this.suffix, r === e.length - 1 ? "" : " "));
  }
}, X1 = Q1, Y1 = class extends Gt {
  constructor(e) {
    super(e), this.pad_token = e.pad_token ?? "", this.word_delimiter_token = e.word_delimiter_token ?? "", this.cleanup = e.cleanup;
  }
  /**
   * Converts a connectionist-temporal-classification (CTC) output tokens into a single string.
   * @param tokens Array of tokens to be decoded.
   * @returns The decoded string.
   */
  convert_tokens_to_string(e) {
    if (e.length === 0) return "";
    let t = [e[0]];
    for (let s = 1; s < e.length; ++s)
      e[s] !== t.at(-1) && t.push(e[s]);
    let n = t.filter(
      (s) => s !== this.pad_token
    ).join("");
    return this.cleanup && (n = Ji(n).replaceAll(this.word_delimiter_token, " ").trim()), n;
  }
  decode_chain(e) {
    return [this.convert_tokens_to_string(e)];
  }
}, K1 = Y1, J1 = class extends Gt {
  /**
   * Creates a new instance of DecoderSequence.
   * @param config The configuration object.
   */
  constructor(e) {
    super(e), this.decoders = (e.decoders ?? []).map((t) => nm(t));
  }
  decode_chain(e) {
    return this.decoders.reduce((t, r) => r.decode_chain(t), e);
  }
}, Z1 = J1, ek = class extends Gt {
  /**
   * @param config The configuration object for the decoder.
   */
  constructor(e) {
    super(e), this.pattern = ka(this.config.pattern);
  }
  decode_chain(e) {
    let t = this.config.content ?? "", r = this.pattern;
    return r === null ? e : e.map((n) => n.replaceAll(r, t));
  }
}, tk = ek, rk = class extends Gt {
  decode_chain(e) {
    return [e.join("")];
  }
}, nk = rk, sk = class extends Gt {
  constructor(e) {
    super(e), this.content = e.content ?? "", this.start = e.start ?? 0, this.stop = e.stop ?? 0;
  }
  decode_chain(e) {
    return e.map((t) => {
      let r = 0;
      for (let s = 0; s < this.start && t[s] === this.content; ++s) {
        r = s + 1;
        continue;
      }
      let n = t.length;
      for (let s = 0; s < this.stop; ++s) {
        let a = t.length - s - 1;
        if (t[a] === this.content) {
          n = a;
          continue;
        } else
          break;
      }
      return t.slice(r, n);
    });
  }
}, ak = sk, ok = class extends Gt {
  constructor(e) {
    super(e), this.text_decoder = new TextDecoder();
  }
  decode_chain(e) {
    let t = [], r = [];
    for (let n of e) {
      let s = null;
      if (n.length === 6 && n.startsWith("<0x") && n.endsWith(">")) {
        let a = parseInt(n.slice(3, 5), 16);
        isNaN(a) || (s = a);
      }
      if (s !== null)
        r.push(s);
      else {
        if (r.length > 0) {
          let a = this.text_decoder.decode(
            Uint8Array.from(r)
          );
          t.push(a), r = [];
        }
        t.push(n);
      }
    }
    if (r.length > 0) {
      let n = this.text_decoder.decode(
        Uint8Array.from(r)
      );
      t.push(n), r = [];
    }
    return t;
  }
}, ik = ok;
function lk(e) {
  if (e === null) return null;
  switch (e.type) {
    case "ByteLevel":
      return new U1(e);
    case "WordPiece":
      return new W1(e);
    case "Metaspace":
      return new H1(e);
    case "BPEDecoder":
      return new X1(e);
    case "CTC":
      return new K1(e);
    case "Sequence":
      return new Z1(e);
    case "Replace":
      return new tk(e);
    case "Fuse":
      return new nk(e);
    case "Strip":
      return new ak(e);
    case "ByteFallback":
      return new ik(e);
    default:
      throw new Error(`Unknown Decoder type: ${e.type}`);
  }
}
var nm = lk, ck = class {
  constructor(e, t) {
    let r = B_(e, "Tokenizer", [
      "model",
      "decoder",
      "post_processor",
      "pre_tokenizer",
      "normalizer"
    ]);
    if (r)
      throw new Error(r);
    let n = B_(t, "Config");
    if (n)
      throw new Error(n);
    this.tokenizer = e, this.config = t, this.normalizer = Kp(this.tokenizer.normalizer), this.pre_tokenizer = Zp(this.tokenizer.pre_tokenizer), this.model = C1(this.tokenizer.model, this.config), this.post_processor = rm(this.tokenizer.post_processor), this.decoder = nm(this.tokenizer.decoder), this.special_tokens = [], this.all_special_ids = [], this.added_tokens = [];
    let s = [], a = [];
    this.added_tokens_map = /* @__PURE__ */ new Map();
    for (let o of this.tokenizer.added_tokens) {
      let i = new $M(o);
      if (this.added_tokens.push(i), this.model.tokens_to_ids.set(i.content, i.id), this.model.vocab[i.id] = i.content, i.special && (this.special_tokens.push(i.content), this.all_special_ids.push(i.id)), this.added_tokens_map.set(i.content, i), i.normalized && this.normalizer !== null) {
        let l = this.normalizer(i.content);
        a.push(l), this.added_tokens_map.set(l, i);
      } else
        s.push(i.content);
    }
    (this.config.additional_special_tokens ?? []).forEach((o) => {
      this.special_tokens.includes(o) || this.special_tokens.push(o);
    }), this.decoder && (this.decoder.added_tokens = this.added_tokens, this.decoder.end_of_word_suffix = this.model.end_of_word_suffix), this.splitter_unnormalized = new L_(s), this.splitter_normalized = new L_(a), this.remove_space = this.config.remove_space, this.clean_up_tokenization_spaces = this.config.clean_up_tokenization_spaces ?? !0, this.do_lowercase_and_remove_accent = this.config.do_lowercase_and_remove_accent ?? !1;
  }
  // Implementation
  encode(e, {
    text_pair: t = null,
    add_special_tokens: r = !0,
    return_token_type_ids: n = null
  } = {}) {
    let { tokens: s, token_type_ids: a } = this.tokenize_helper(e, {
      text_pair: t,
      add_special_tokens: r
    }), o = s.map(
      (l) => this.added_tokens_map.get(l)?.id ?? this.model.tokens_to_ids.get(l) ?? this.model.unk_token_id
    ), i = {
      ids: o,
      tokens: s,
      attention_mask: new Array(o.length).fill(1)
    };
    return n && a && (i.token_type_ids = a), i;
  }
  decode(e, t = {}) {
    if (!Array.isArray(e) || e.length === 0 || !ix(e[0]))
      throw Error("token_ids must be a non-empty array of integers.");
    let r = e.map(
      (s) => this.model.vocab[Number(s)] ?? this.model.unk_token
    );
    t.skip_special_tokens && (r = r.filter((s) => !this.special_tokens.includes(s)));
    let n = this.decoder ? this.decoder(r) : r.join(" ");
    return this.decoder && this.decoder.end_of_word_suffix && (n = n.replaceAll(this.decoder.end_of_word_suffix, " "), t.skip_special_tokens && (n = n.trim())), (t.clean_up_tokenization_spaces ?? this.clean_up_tokenization_spaces) && (n = Ji(n)), n;
  }
  /**
   * Converts a string into a sequence of tokens.
   * @param text The sequence to be encoded.
   * @param options An optional object containing the following properties:
   * @returns The list of tokens.
   */
  tokenize(e, { text_pair: t = null, add_special_tokens: r = !1 } = {}) {
    return this.tokenize_helper(e, { text_pair: t, add_special_tokens: r }).tokens;
  }
  encode_text(e) {
    if (e === null)
      return null;
    let t = this.splitter_unnormalized.split(e);
    return t.forEach((r, n) => {
      let s = this.added_tokens_map.get(r);
      s && (s.lstrip && n > 0 && (t[n - 1] = t[n - 1].trimEnd()), s.rstrip && n < t.length - 1 && (t[n + 1] = t[n + 1].trimStart()));
    }), t.flatMap((r, n) => {
      if (r.length === 0)
        return [];
      if (this.added_tokens_map.has(r))
        return [r];
      if (this.remove_space === !0 && (r = r.trim().split(/\s+/).join(" ")), this.do_lowercase_and_remove_accent && (r = cx(r)), this.normalizer !== null && (r = this.normalizer(r)), r.length === 0)
        return [];
      let s = this.splitter_normalized.split(r);
      return s.forEach((a, o) => {
        let i = this.added_tokens_map.get(a);
        i && (i.lstrip && o > 0 && (s[o - 1] = s[o - 1].trimEnd()), i.rstrip && o < s.length - 1 && (s[o + 1] = s[o + 1].trimStart()));
      }), s.flatMap((a) => {
        if (a.length === 0)
          return [];
        if (this.added_tokens_map.has(a))
          return [a];
        let o = this.pre_tokenizer !== null ? this.pre_tokenizer(a, {
          section_index: n
        }) : [a];
        return this.model(o);
      });
    });
  }
  tokenize_helper(e, { text_pair: t = null, add_special_tokens: r = !0 }) {
    let n = this.encode_text(e), s = this.encode_text(t || null);
    return this.post_processor ? this.post_processor(n, s, r) : { tokens: zt(n ?? [], s ?? []) };
  }
  /**
   * Converts a token string to its corresponding token ID.
   * @param token The token string to convert.
   * @returns The token ID, or undefined if the token is not in the vocabulary.
   */
  token_to_id(e) {
    return this.model.tokens_to_ids.get(e);
  }
  /**
   * Converts a token ID to its corresponding token string.
   * @param id The token ID to convert.
   * @returns The token string, or undefined if the ID is not in the vocabulary.
   */
  id_to_token(e) {
    return this.model.vocab[e];
  }
  /**
   * Returns a mapping of token IDs to AddedToken objects for all added tokens.
   * @returns A Map where keys are token IDs and values are AddedToken objects.
   */
  get_added_tokens_decoder() {
    let e = /* @__PURE__ */ new Map();
    for (let t of this.added_tokens)
      e.set(t.id, t);
    return e;
  }
  /**
   * Get the underlying vocabulary
   * @param with_added_tokens Whether to include the added tokens
   * @returns The vocabulary
   */
  get_vocab(e = !0) {
    let t = /* @__PURE__ */ new Map();
    for (let r = 0; r < this.model.vocab.length; ++r) {
      let n = this.model.vocab[r];
      (e || !this.added_tokens_map.has(n)) && t.set(n, r);
    }
    return t;
  }
}, uk = ck, dk = Object.defineProperty, hk = (e, t, r) => t in e ? dk(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r, fk = (e, t, r) => (hk(e, typeof t != "symbol" ? t + "" : t, r), r), z = Object.freeze({
  Text: "Text",
  // The text between Jinja statements or expressions
  NumericLiteral: "NumericLiteral",
  // e.g., 123, 1.0
  StringLiteral: "StringLiteral",
  // 'string'
  Identifier: "Identifier",
  // Variables, functions, statements, booleans, etc.
  Equals: "Equals",
  // =
  OpenParen: "OpenParen",
  // (
  CloseParen: "CloseParen",
  // )
  OpenStatement: "OpenStatement",
  // {%
  CloseStatement: "CloseStatement",
  // %}
  OpenExpression: "OpenExpression",
  // {{
  CloseExpression: "CloseExpression",
  // }}
  OpenSquareBracket: "OpenSquareBracket",
  // [
  CloseSquareBracket: "CloseSquareBracket",
  // ]
  OpenCurlyBracket: "OpenCurlyBracket",
  // {
  CloseCurlyBracket: "CloseCurlyBracket",
  // }
  Comma: "Comma",
  // ,
  Dot: "Dot",
  // .
  Colon: "Colon",
  // :
  Pipe: "Pipe",
  // |
  CallOperator: "CallOperator",
  // ()
  AdditiveBinaryOperator: "AdditiveBinaryOperator",
  // + - ~
  MultiplicativeBinaryOperator: "MultiplicativeBinaryOperator",
  // * / // %
  ExponentiationBinaryOperator: "ExponentiationBinaryOperator",
  // **
  ComparisonBinaryOperator: "ComparisonBinaryOperator",
  // < > <= >= == !=
  UnaryOperator: "UnaryOperator",
  // ! - +
  Comment: "Comment"
  // {# ... #}
}), Ct = class {
  /**
   * Constructs a new Token.
   * @param {string} value The raw value as seen inside the source code.
   * @param {TokenType} type The type of token.
   */
  constructor(e, t) {
    this.value = e, this.type = t;
  }
};
function U_(e) {
  return /\w/.test(e);
}
function Jr(e) {
  return /[0-9]/.test(e);
}
function j_(e) {
  return /\s/.test(e);
}
var _k = [
  // Control sequences
  ["{%", z.OpenStatement],
  ["%}", z.CloseStatement],
  ["{{", z.OpenExpression],
  ["}}", z.CloseExpression],
  // Single character tokens
  ["(", z.OpenParen],
  [")", z.CloseParen],
  ["{", z.OpenCurlyBracket],
  ["}", z.CloseCurlyBracket],
  ["[", z.OpenSquareBracket],
  ["]", z.CloseSquareBracket],
  [",", z.Comma],
  [".", z.Dot],
  [":", z.Colon],
  ["|", z.Pipe],
  // Comparison operators
  ["<=", z.ComparisonBinaryOperator],
  [">=", z.ComparisonBinaryOperator],
  ["==", z.ComparisonBinaryOperator],
  ["!=", z.ComparisonBinaryOperator],
  ["<", z.ComparisonBinaryOperator],
  [">", z.ComparisonBinaryOperator],
  // Arithmetic operators
  ["+", z.AdditiveBinaryOperator],
  ["-", z.AdditiveBinaryOperator],
  ["~", z.AdditiveBinaryOperator],
  ["**", z.ExponentiationBinaryOperator],
  // NOTE: must come before "*" so that "**" is matched first
  ["*", z.MultiplicativeBinaryOperator],
  ["//", z.MultiplicativeBinaryOperator],
  // NOTE: must come before "/" so that "//" is matched first
  ["/", z.MultiplicativeBinaryOperator],
  ["%", z.MultiplicativeBinaryOperator],
  // Assignment operator
  ["=", z.Equals]
], pk = /* @__PURE__ */ new Map([
  ["n", `
`],
  // New line
  ["t", "	"],
  // Horizontal tab
  ["r", "\r"],
  // Carriage return
  ["b", "\b"],
  // Backspace
  ["f", "\f"],
  // Form feed
  ["v", "\v"],
  // Vertical tab
  ["'", "'"],
  // Single quote
  ['"', '"'],
  // Double quote
  ["\\", "\\"]
  // Backslash
]);
function mk(e, t = {}) {
  return e.endsWith(`
`) && (e = e.slice(0, -1)), t.lstrip_blocks && (e = e.replace(/^[ \t]*({[#%-])/gm, "$1")), t.trim_blocks && (e = e.replace(/([#%-]})\n/g, "$1")), e.replace(
    /(\s*){%(-?)\s*(?:end)?generation\s*(-?)%}(\s*)/gs,
    (r, n, s, a, o) => (s ? "" : n) + (a ? "" : o)
  );
}
function gk(e, t = {}) {
  let r = [], n = mk(e, t), s = 0, a = 0, o = (c) => {
    let d = "";
    for (; c(n[s]); ) {
      if (n[s] === "\\") {
        if (++s, s >= n.length)
          throw new SyntaxError("Unexpected end of input");
        let h = n[s++], _ = pk.get(h);
        if (_ === void 0)
          throw new SyntaxError(`Unexpected escaped character: ${h}`);
        d += _;
        continue;
      }
      if (d += n[s++], s >= n.length)
        throw new SyntaxError("Unexpected end of input");
    }
    return d;
  }, i = () => {
    let c = r.at(-1);
    c && c.type === z.Text && (c.value = c.value.trimEnd(), c.value === "" && r.pop());
  }, l = () => {
    for (; s < n.length && j_(n[s]); )
      ++s;
  };
  e:
    for (; s < n.length; ) {
      let c = r.at(-1)?.type;
      if (c === void 0 || c === z.CloseStatement || c === z.CloseExpression || c === z.Comment) {
        let h = "";
        for (; s < n.length && // Keep going until we hit the next Jinja statement or expression
        !(n[s] === "{" && (n[s + 1] === "%" || n[s + 1] === "{" || n[s + 1] === "#")); )
          h += n[s++];
        if (h.length > 0) {
          r.push(new Ct(h, z.Text));
          continue;
        }
      }
      if (n[s] === "{" && n[s + 1] === "#") {
        s += 2;
        let h = n[s] === "-";
        h && ++s;
        let _ = "";
        for (; n[s] !== "#" || n[s + 1] !== "}"; ) {
          if (s + 2 >= n.length)
            throw new SyntaxError("Missing end of comment tag");
          _ += n[s++];
        }
        let p = _.endsWith("-");
        p && (_ = _.slice(0, -1)), h && i(), r.push(new Ct(_, z.Comment)), s += 2, p && l();
        continue;
      }
      if (n.slice(s, s + 3) === "{%-") {
        i(), r.push(new Ct("{%", z.OpenStatement)), s += 3;
        continue;
      }
      if (n.slice(s, s + 3) === "{{-") {
        i(), r.push(new Ct("{{", z.OpenExpression)), a = 0, s += 3;
        continue;
      }
      if (o(j_), n.slice(s, s + 3) === "-%}") {
        r.push(new Ct("%}", z.CloseStatement)), s += 3, l();
        continue;
      }
      if (n.slice(s, s + 3) === "-}}") {
        r.push(new Ct("}}", z.CloseExpression)), s += 3, l();
        continue;
      }
      let d = n[s];
      if (d === "-" || d === "+") {
        let h = r.at(-1)?.type;
        if (h === z.Text || h === void 0)
          throw new SyntaxError(`Unexpected character: ${d}`);
        switch (h) {
          case z.Identifier:
          case z.NumericLiteral:
          case z.StringLiteral:
          case z.CloseParen:
          case z.CloseSquareBracket:
            break;
          default: {
            ++s;
            let _ = o(Jr);
            if (_.length > 0 && n[s] === "." && Jr(n[s + 1])) {
              ++s;
              let p = o(Jr);
              _ = `${_}.${p}`;
            }
            r.push(
              new Ct(`${d}${_}`, _.length > 0 ? z.NumericLiteral : z.UnaryOperator)
            );
            continue;
          }
        }
      }
      for (let [h, _] of _k) {
        if (h === "}}" && a > 0)
          continue;
        if (n.slice(s, s + h.length) === h) {
          r.push(new Ct(h, _)), _ === z.OpenExpression ? a = 0 : _ === z.OpenCurlyBracket ? ++a : _ === z.CloseCurlyBracket && --a, s += h.length;
          continue e;
        }
      }
      if (d === "'" || d === '"') {
        ++s;
        let h = o((_) => _ !== d);
        r.push(new Ct(h, z.StringLiteral)), ++s;
        continue;
      }
      if (Jr(d)) {
        let h = o(Jr);
        if (r.at(-1)?.type !== z.Dot && n[s] === "." && Jr(n[s + 1])) {
          ++s;
          let _ = o(Jr);
          h = `${h}.${_}`;
        }
        r.push(new Ct(h, z.NumericLiteral));
        continue;
      }
      if (U_(d)) {
        let h = o(U_);
        r.push(new Ct(h, z.Identifier));
        continue;
      }
      throw new SyntaxError(`Unexpected character: ${d}`);
    }
  return r;
}
var Pt = class {
  type = "Statement";
}, wk = class extends Pt {
  constructor(e) {
    super(), this.body = e;
  }
  type = "Program";
}, vk = class extends Pt {
  constructor(e, t, r) {
    super(), this.test = e, this.body = t, this.alternate = r;
  }
  type = "If";
}, yk = class extends Pt {
  constructor(e, t, r, n) {
    super(), this.loopvar = e, this.iterable = t, this.body = r, this.defaultBlock = n;
  }
  type = "For";
}, bk = class extends Pt {
  type = "Break";
}, Mk = class extends Pt {
  type = "Continue";
}, xk = class extends Pt {
  constructor(e, t, r) {
    super(), this.assignee = e, this.value = t, this.body = r;
  }
  type = "Set";
}, kk = class extends Pt {
  constructor(e, t, r) {
    super(), this.name = e, this.args = t, this.body = r;
  }
  type = "Macro";
}, Tk = class extends Pt {
  constructor(e) {
    super(), this.value = e;
  }
  type = "Comment";
}, wt = class extends Pt {
  type = "Expression";
}, Ek = class extends wt {
  constructor(e, t, r) {
    super(), this.object = e, this.property = t, this.computed = r;
  }
  type = "MemberExpression";
}, W_ = class extends wt {
  constructor(e, t) {
    super(), this.callee = e, this.args = t;
  }
  type = "CallExpression";
}, Tr = class extends wt {
  /**
   * @param {string} value The name of the identifier
   */
  constructor(e) {
    super(), this.value = e;
  }
  type = "Identifier";
}, Sn = class extends wt {
  constructor(e) {
    super(), this.value = e;
  }
  type = "Literal";
}, Ak = class extends Sn {
  type = "IntegerLiteral";
}, Ck = class extends Sn {
  type = "FloatLiteral";
}, q_ = class extends Sn {
  type = "StringLiteral";
}, Sk = class extends Sn {
  type = "ArrayLiteral";
}, H_ = class extends Sn {
  type = "TupleLiteral";
}, Pk = class extends Sn {
  type = "ObjectLiteral";
}, pn = class extends wt {
  constructor(e, t, r) {
    super(), this.operator = e, this.left = t, this.right = r;
  }
  type = "BinaryExpression";
}, Fk = class extends wt {
  constructor(e, t) {
    super(), this.operand = e, this.filter = t;
  }
  type = "FilterExpression";
}, Ik = class extends Pt {
  constructor(e, t) {
    super(), this.filter = e, this.body = t;
  }
  type = "FilterStatement";
}, Lk = class extends wt {
  constructor(e, t) {
    super(), this.lhs = e, this.test = t;
  }
  type = "SelectExpression";
}, Ok = class extends wt {
  constructor(e, t, r) {
    super(), this.operand = e, this.negate = t, this.test = r;
  }
  type = "TestExpression";
}, Q_ = class extends wt {
  constructor(e, t) {
    super(), this.operator = e, this.argument = t;
  }
  type = "UnaryExpression";
}, Nk = class extends wt {
  constructor(e = void 0, t = void 0, r = void 0) {
    super(), this.start = e, this.stop = t, this.step = r;
  }
  type = "SliceExpression";
}, yi = class extends wt {
  constructor(e, t) {
    super(), this.key = e, this.value = t;
  }
  type = "KeywordArgumentExpression";
}, Dk = class extends wt {
  constructor(e) {
    super(), this.argument = e;
  }
  type = "SpreadExpression";
}, zk = class extends wt {
  constructor(e) {
    super(), this.argument = e;
  }
  type = "KeywordSpreadExpression";
}, Bk = class extends Pt {
  constructor(e, t, r) {
    super(), this.call = e, this.callerArgs = t, this.body = r;
  }
  type = "CallStatement";
}, Rk = class extends wt {
  constructor(e, t, r) {
    super(), this.condition = e, this.trueExpr = t, this.falseExpr = r;
  }
  type = "Ternary";
};
function $k(e) {
  let t = new wk([]), r = 0;
  function n(L, O) {
    let G = e[r++];
    if (!G || G.type !== L)
      throw new Error(`Parser Error: ${O}. ${G.type} !== ${L}.`);
    return G;
  }
  function s(L) {
    if (!l(L))
      throw new SyntaxError(`Expected ${L}`);
    ++r;
  }
  function a() {
    switch (e[r].type) {
      case z.Comment:
        return new Tk(e[r++].value);
      case z.Text:
        return c();
      case z.OpenStatement:
        return d();
      case z.OpenExpression:
        return h();
      default:
        throw new SyntaxError(`Unexpected token type: ${e[r].type}`);
    }
  }
  function o(...L) {
    return r + L.length <= e.length && L.every((O, G) => O === e[r + G].type);
  }
  function i(...L) {
    return e[r]?.type === z.OpenStatement && e[r + 1]?.type === z.Identifier && L.includes(e[r + 1]?.value);
  }
  function l(...L) {
    return r + L.length <= e.length && L.every((O, G) => e[r + G].type === "Identifier" && O === e[r + G].value);
  }
  function c() {
    return new q_(n(z.Text, "Expected text token").value);
  }
  function d() {
    if (n(z.OpenStatement, "Expected opening statement token"), e[r].type !== z.Identifier)
      throw new SyntaxError(`Unknown statement, got ${e[r].type}`);
    let L = e[r].value, O;
    switch (L) {
      case "set":
        ++r, O = _();
        break;
      case "if":
        ++r, O = p(), n(z.OpenStatement, "Expected {% token"), s("endif"), n(z.CloseStatement, "Expected %} token");
        break;
      case "macro":
        ++r, O = w(), n(z.OpenStatement, "Expected {% token"), s("endmacro"), n(z.CloseStatement, "Expected %} token");
        break;
      case "for":
        ++r, O = y(), n(z.OpenStatement, "Expected {% token"), s("endfor"), n(z.CloseStatement, "Expected %} token");
        break;
      case "call": {
        ++r;
        let G = null;
        o(z.OpenParen) && (G = W("parameters"));
        let ue = ne();
        if (ue.type !== "Identifier")
          throw new SyntaxError("Expected identifier following call statement");
        let ee = W("call");
        n(z.CloseStatement, "Expected closing statement token");
        let We = [];
        for (; !i("endcall"); )
          We.push(a());
        n(z.OpenStatement, "Expected '{%'"), s("endcall"), n(z.CloseStatement, "Expected closing statement token");
        let Pe = new W_(ue, ee);
        O = new Bk(Pe, G, We);
        break;
      }
      case "break":
        ++r, n(z.CloseStatement, "Expected closing statement token"), O = new bk();
        break;
      case "continue":
        ++r, n(z.CloseStatement, "Expected closing statement token"), O = new Mk();
        break;
      case "filter": {
        ++r;
        let G = ne();
        G instanceof Tr && o(z.OpenParen) && (G = R(G)), n(z.CloseStatement, "Expected closing statement token");
        let ue = [];
        for (; !i("endfilter"); )
          ue.push(a());
        n(z.OpenStatement, "Expected '{%'"), s("endfilter"), n(z.CloseStatement, "Expected '%}'"), O = new Ik(G, ue);
        break;
      }
      default:
        throw new SyntaxError(`Unknown statement type: ${L}`);
    }
    return O;
  }
  function h() {
    n(z.OpenExpression, "Expected opening expression token");
    let L = b();
    return n(z.CloseExpression, "Expected closing expression token"), L;
  }
  function _() {
    let L = v(), O = null, G = [];
    if (o(z.Equals))
      ++r, O = v();
    else {
      for (n(z.CloseStatement, "Expected %} token"); !i("endset"); )
        G.push(a());
      n(z.OpenStatement, "Expected {% token"), s("endset");
    }
    return n(z.CloseStatement, "Expected closing statement token"), new xk(L, O, G);
  }
  function p() {
    let L = b();
    n(z.CloseStatement, "Expected closing statement token");
    let O = [], G = [];
    for (; !i("elif", "else", "endif"); )
      O.push(a());
    if (i("elif")) {
      ++r, ++r;
      let ue = p();
      G.push(ue);
    } else if (i("else"))
      for (++r, ++r, n(z.CloseStatement, "Expected closing statement token"); !i("endif"); )
        G.push(a());
    return new vk(L, O, G);
  }
  function w() {
    let L = ne();
    if (L.type !== "Identifier")
      throw new SyntaxError("Expected identifier following macro statement");
    let O = W("parameters");
    n(z.CloseStatement, "Expected closing statement token");
    let G = [];
    for (; !i("endmacro"); )
      G.push(a());
    return new kk(L, O, G);
  }
  function v(L = !1) {
    let O = L ? ne : b, G = [O()], ue = o(z.Comma);
    for (; ue && (++r, G.push(O()), !!o(z.Comma)); )
      ;
    return ue ? new H_(G) : G[0];
  }
  function y() {
    let L = v(!0);
    if (!(L instanceof Tr || L instanceof H_))
      throw new SyntaxError(`Expected identifier/tuple for the loop variable, got ${L.type} instead`);
    if (!l("in"))
      throw new SyntaxError("Expected `in` keyword following loop variable");
    ++r;
    let O = b();
    n(z.CloseStatement, "Expected closing statement token");
    let G = [];
    for (; !i("endfor", "else"); )
      G.push(a());
    let ue = [];
    if (i("else"))
      for (++r, ++r, n(z.CloseStatement, "Expected closing statement token"); !i("endfor"); )
        ue.push(a());
    return new yk(L, O, G, ue);
  }
  function b() {
    return k();
  }
  function k() {
    let L = A();
    if (l("if")) {
      ++r;
      let O = A();
      if (l("else")) {
        ++r;
        let G = k();
        return new Rk(O, L, G);
      } else
        return new Lk(L, O);
    }
    return L;
  }
  function A() {
    let L = E();
    for (; l("or"); ) {
      let O = e[r];
      ++r;
      let G = E();
      L = new pn(O, L, G);
    }
    return L;
  }
  function E() {
    let L = C();
    for (; l("and"); ) {
      let O = e[r];
      ++r;
      let G = C();
      L = new pn(O, L, G);
    }
    return L;
  }
  function C() {
    let L;
    for (; l("not"); ) {
      let O = e[r];
      ++r;
      let G = C();
      L = new Q_(O, G);
    }
    return L ?? N();
  }
  function N() {
    let L = M();
    for (; ; ) {
      let O;
      if (l("not", "in"))
        O = new Ct("not in", z.Identifier), r += 2;
      else if (l("in"))
        O = e[r++];
      else if (o(z.ComparisonBinaryOperator))
        O = e[r++];
      else
        break;
      let G = M();
      L = new pn(O, L, G);
    }
    return L;
  }
  function M() {
    let L = B();
    for (; o(z.AdditiveBinaryOperator); ) {
      let O = e[r];
      ++r;
      let G = B();
      L = new pn(O, L, G);
    }
    return L;
  }
  function $() {
    let L = q(ne());
    return o(z.OpenParen) ? R(L) : L;
  }
  function R(L) {
    let O = new W_(L, W("call"));
    return O = q(O), o(z.OpenParen) && (O = R(O)), O;
  }
  function W(L) {
    n(z.OpenParen, "Expected opening parenthesis for arguments list");
    let O = Q(L);
    return n(z.CloseParen, "Expected closing parenthesis for arguments list"), O;
  }
  function Q(L) {
    let O = [], G = /* @__PURE__ */ new Set(), ue = !1, ee = !1;
    for (; !o(z.CloseParen); ) {
      let We = o(z.ExponentiationBinaryOperator), Pe = o(z.MultiplicativeBinaryOperator) && e[r].value === "*";
      if (L === "parameters" && (We || Pe))
        throw new SyntaxError("Argument unpacking is not allowed in parameter declarations");
      if (We) {
        if (++r, O.push(new zk(b())), o(z.Comma) && ++r, !o(z.CloseParen))
          throw new SyntaxError("Expected closing parenthesis: `**` must be applied to the final argument");
        break;
      }
      let be;
      if (Pe) {
        if (ee)
          throw new SyntaxError("Only one `*` argument unpacking is allowed");
        ee = !0, ++r;
        let $e = b();
        be = new Dk($e);
      } else {
        if (be = b(), o(z.Equals)) {
          if (++r, !(be instanceof Tr))
            throw new SyntaxError(
              L === "parameters" ? "Expected identifier for parameter declaration" : "Expected identifier for keyword argument"
            );
          let $e = b();
          be = new yi(be, $e);
        }
        if (L === "parameters") {
          if (!(be instanceof Tr || be instanceof yi))
            throw new SyntaxError("Expected identifier for parameter declaration");
          let $e = be instanceof Tr ? be.value : be.key.value;
          if (G.has($e))
            throw new SyntaxError(`Duplicate parameter name: ${$e}`);
          G.add($e);
        }
        if (be instanceof yi)
          ue = !0;
        else {
          if (ue)
            throw new SyntaxError(
              L === "call" ? "Positional arguments must come before keyword arguments" : "Non-default argument follows default argument"
            );
          if (ee)
            throw new SyntaxError("Positional arguments must not follow `*` argument unpacking");
        }
      }
      O.push(be), o(z.Comma) && ++r;
    }
    return O;
  }
  function H() {
    let L = [], O = !1;
    for (; !o(z.CloseSquareBracket); )
      o(z.Colon) ? (L.push(void 0), ++r, O = !0) : (L.push(b()), o(z.Colon) && (++r, O = !0));
    if (L.length === 0)
      throw new SyntaxError("Expected at least one argument for member/slice expression");
    if (O) {
      if (L.length > 3)
        throw new SyntaxError("Expected 0-3 arguments for slice expression");
      return new Nk(...L);
    }
    return L[0];
  }
  function q(L) {
    for (; o(z.Dot) || o(z.OpenSquareBracket); ) {
      let O = e[r];
      ++r;
      let G, ue = O.type === z.OpenSquareBracket;
      if (ue)
        G = H(), n(z.CloseSquareBracket, "Expected closing square bracket");
      else if (G = ne(), G.type !== "Identifier" && G.type !== "IntegerLiteral")
        throw new SyntaxError("Expected identifier or integer following dot operator");
      L = new Ek(L, G, ue);
    }
    return L;
  }
  function B() {
    let L = P();
    for (; o(z.MultiplicativeBinaryOperator); ) {
      let O = e[r++], G = P();
      L = new pn(O, L, G);
    }
    return L;
  }
  function P() {
    let L = X();
    for (; o(z.ExponentiationBinaryOperator); ) {
      let O = e[r++], G = X();
      L = new pn(O, L, G);
    }
    return L;
  }
  function X() {
    let L = ce();
    for (; l("is"); ) {
      ++r;
      let O = l("not");
      O && ++r;
      let G = ne();
      if (!(G instanceof Tr))
        throw new SyntaxError("Expected identifier for the test");
      L = new Ok(L, O, G);
    }
    return L;
  }
  function ce() {
    let L = J();
    for (; o(z.Pipe); ) {
      ++r;
      let O = ne();
      if (!(O instanceof Tr))
        throw new SyntaxError("Expected identifier for the filter");
      o(z.OpenParen) && (O = R(O)), L = new Fk(L, O);
    }
    return L;
  }
  function J() {
    let L = e[r];
    if (L && (L.type === z.UnaryOperator || L.type === z.AdditiveBinaryOperator) && (L.value === "-" || L.value === "+")) {
      let O = e[r++], G = J();
      return new Q_(O, G);
    }
    return $();
  }
  function ne() {
    let L = e[r++];
    switch (L.type) {
      case z.NumericLiteral: {
        let O = L.value;
        return O.includes(".") ? new Ck(Number(O)) : new Ak(Number(O));
      }
      case z.StringLiteral: {
        let O = L.value;
        for (; o(z.StringLiteral); )
          O += e[r++].value;
        return new q_(O);
      }
      case z.Identifier:
        return new Tr(L.value);
      case z.OpenParen: {
        let O = v();
        return n(z.CloseParen, "Expected closing parenthesis, got ${tokens[current].type} instead."), O;
      }
      case z.OpenSquareBracket: {
        let O = [];
        for (; !o(z.CloseSquareBracket); )
          O.push(b()), o(z.Comma) && ++r;
        return ++r, new Sk(O);
      }
      case z.OpenCurlyBracket: {
        let O = /* @__PURE__ */ new Map();
        for (; !o(z.CloseCurlyBracket); ) {
          let G = b();
          n(z.Colon, "Expected colon between key and value in object literal");
          let ue = b();
          O.set(G, ue), o(z.Comma) && ++r;
        }
        return ++r, new Pk(O);
      }
      default:
        throw new SyntaxError(`Unexpected token: ${L.type}`);
    }
  }
  for (; r < e.length; )
    t.body.push(a());
  return t;
}
function Gk(e, t, r = 1) {
  if (t === void 0 && (t = e, e = 0), r === 0)
    throw new Error("range() step must not be zero");
  let n = [];
  if (r > 0)
    for (let s = e; s < t; s += r)
      n.push(s);
  else
    for (let s = e; s > t; s += r)
      n.push(s);
  return n;
}
function X_(e, t, r, n = 1) {
  let s = Math.sign(n);
  s >= 0 ? (t = (t ??= 0) < 0 ? Math.max(e.length + t, 0) : Math.min(t, e.length), r = (r ??= e.length) < 0 ? Math.max(e.length + r, 0) : Math.min(r, e.length)) : (t = (t ??= e.length - 1) < 0 ? Math.max(e.length + t, -1) : Math.min(t, e.length - 1), r = (r ??= -1) < -1 ? Math.max(e.length + r, -1) : Math.min(r, e.length - 1));
  let a = [];
  for (let o = t; s * o < s * r; o += n)
    a.push(e[o]);
  return a;
}
function Vk(e) {
  return e.replace(/\b\w/g, (t) => t.toUpperCase());
}
function Uk(e) {
  return jk(/* @__PURE__ */ new Date(), e);
}
function jk(e, t) {
  let r = new Intl.DateTimeFormat(void 0, { month: "long" }), n = new Intl.DateTimeFormat(void 0, { month: "short" }), s = (a) => a < 10 ? "0" + a : a.toString();
  return t.replace(/%[YmdbBHM%]/g, (a) => {
    switch (a) {
      case "%Y":
        return e.getFullYear().toString();
      case "%m":
        return s(e.getMonth() + 1);
      case "%d":
        return s(e.getDate());
      case "%b":
        return n.format(e);
      case "%B":
        return r.format(e);
      case "%H":
        return s(e.getHours());
      case "%M":
        return s(e.getMinutes());
      case "%%":
        return "%";
      default:
        return a;
    }
  });
}
function Wk(e) {
  return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function qk(e, t, r, n) {
  if (n === 0)
    return e;
  let s = n == null || n < 0 ? 1 / 0 : n, a = t.length === 0 ? new RegExp("(?=)", "gu") : new RegExp(Wk(t), "gu");
  return e.replaceAll(a, (o) => s > 0 ? (--s, r) : o);
}
var Y_ = class extends Error {
}, K_ = class extends Error {
}, Hk = /* @__PURE__ */ new Map(), Vt = class {
  type = "RuntimeValue";
  value;
  /**
   * A collection of built-in functions for this type.
   */
  get builtins() {
    return Hk;
  }
  /**
   * Creates a new RuntimeValue.
   */
  constructor(e = void 0) {
    this.value = e;
  }
  /**
   * Determines truthiness or falsiness of the runtime value.
   * This function should be overridden by subclasses if it has custom truthiness criteria.
   * @returns {BooleanValue} BooleanValue(true) if the value is truthy, BooleanValue(false) otherwise.
   */
  __bool__() {
    return new se(!!this.value);
  }
  toString() {
    return String(this.value);
  }
}, oe = class extends Vt {
  type = "IntegerValue";
}, Te = class extends Vt {
  type = "FloatValue";
  toString() {
    return Object.is(this.value, -0) ? "-0.0" : this.value % 1 === 0 ? this.value.toFixed(1) : this.value.toString();
  }
}, K = class extends Vt {
  type = "StringValue";
  _builtins;
  get builtins() {
    return this._builtins ??= /* @__PURE__ */ new Map([
      [
        "upper",
        new Ne(() => new K(this.value.toUpperCase()))
      ],
      [
        "lower",
        new Ne(() => new K(this.value.toLowerCase()))
      ],
      [
        "strip",
        new Ne(() => new K(this.value.trim()))
      ],
      [
        "title",
        new Ne(() => new K(Vk(this.value)))
      ],
      [
        "capitalize",
        new Ne(() => new K(this.value.charAt(0).toUpperCase() + this.value.slice(1)))
      ],
      ["length", new oe(this.value.length)],
      [
        "rstrip",
        new Ne(() => new K(this.value.trimEnd()))
      ],
      [
        "lstrip",
        new Ne(() => new K(this.value.trimStart()))
      ],
      [
        "startswith",
        new Ne((e) => {
          if (e.length === 0)
            throw new Error("startswith() requires at least one argument");
          let t = e[0];
          if (t instanceof K)
            return new se(this.value.startsWith(t.value));
          if (t instanceof pe) {
            for (let r of t.value) {
              if (!(r instanceof K))
                throw new Error("startswith() tuple elements must be strings");
              if (this.value.startsWith(r.value))
                return new se(!0);
            }
            return new se(!1);
          }
          throw new Error("startswith() argument must be a string or tuple of strings");
        })
      ],
      [
        "endswith",
        new Ne((e) => {
          if (e.length === 0)
            throw new Error("endswith() requires at least one argument");
          let t = e[0];
          if (t instanceof K)
            return new se(this.value.endsWith(t.value));
          if (t instanceof pe) {
            for (let r of t.value) {
              if (!(r instanceof K))
                throw new Error("endswith() tuple elements must be strings");
              if (this.value.endsWith(r.value))
                return new se(!0);
            }
            return new se(!1);
          }
          throw new Error("endswith() argument must be a string or tuple of strings");
        })
      ],
      [
        "split",
        // follows Python's `str.split(sep=None, maxsplit=-1)` function behavior
        // https://docs.python.org/3.13/library/stdtypes.html#str.split
        new Ne((e) => {
          let t = e[0] ?? new Be();
          if (!(t instanceof K || t instanceof Be))
            throw new Error("sep argument must be a string or null");
          let r = e[1] ?? new oe(-1);
          if (!(r instanceof oe))
            throw new Error("maxsplit argument must be a number");
          let n = [];
          if (t instanceof Be) {
            let s = this.value.trimStart();
            for (let { 0: a, index: o } of s.matchAll(/\S+/g)) {
              if (r.value !== -1 && n.length >= r.value && o !== void 0) {
                n.push(a + s.slice(o + a.length));
                break;
              }
              n.push(a);
            }
          } else {
            if (t.value === "")
              throw new Error("empty separator");
            n = this.value.split(t.value), r.value !== -1 && n.length > r.value && n.push(n.splice(r.value).join(t.value));
          }
          return new pe(n.map((s) => new K(s)));
        })
      ],
      [
        "replace",
        new Ne((e) => {
          if (e.length < 2)
            throw new Error("replace() requires at least two arguments");
          let t = e[0], r = e[1];
          if (!(t instanceof K && r instanceof K))
            throw new Error("replace() arguments must be strings");
          let n;
          if (e.length > 2 ? e[2].type === "KeywordArgumentsValue" ? n = e[2].value.get("count") ?? new Be() : n = e[2] : n = new Be(), !(n instanceof oe || n instanceof Be))
            throw new Error("replace() count argument must be a number or null");
          return new K(qk(this.value, t.value, r.value, n.value));
        })
      ]
    ]);
  }
}, se = class extends Vt {
  type = "BooleanValue";
}, Qk = /[\x7f-\uffff]/g;
function J_(e) {
  return e.replace(Qk, (t) => "\\u" + t.charCodeAt(0).toString(16).padStart(4, "0"));
}
function Fr(e, t = {}, r = 0, n = !0) {
  let { indent: s = null, ensureAscii: a = !1, separators: o = null, sortKeys: i = !1 } = t, l, c;
  switch (o ? [l, c] = o : s ? (l = ",", c = ": ") : (l = ", ", c = ": "), e.type) {
    case "NullValue":
      return "null";
    case "UndefinedValue":
      return n ? "null" : "undefined";
    case "IntegerValue":
    case "FloatValue":
    case "BooleanValue":
      return JSON.stringify(e.value);
    case "StringValue": {
      let d = JSON.stringify(e.value);
      return a && (d = J_(d)), d;
    }
    case "ArrayValue":
    case "NamespaceValue":
    case "ObjectValue": {
      let d = s ? " ".repeat(s) : "", h = `
` + d.repeat(r), _ = h + d;
      if (e.type === "ArrayValue") {
        let p = e.value.map((w) => Fr(w, t, r + 1, n));
        return s ? `[${_}${p.join(`${l}${_}`)}${h}]` : `[${p.join(l)}]`;
      } else {
        let p = Array.from(e.value.entries());
        i && (p = p.sort(([v], [y]) => v.localeCompare(y)));
        let w = p.map(([v, y]) => {
          let b = JSON.stringify(v);
          a && (b = J_(b));
          let k = `${b}${c}${Fr(y, t, r + 1, n)}`;
          return s ? `${_}${k}` : k;
        });
        return s ? `{${w.join(l)}${h}}` : `{${w.join(l)}}`;
      }
    }
    default:
      throw new Error(`Cannot convert to JSON: ${e.type}`);
  }
}
var ct = class extends Vt {
  type = "ObjectValue";
  _builtins;
  /**
   * NOTE: necessary to override since all JavaScript arrays are considered truthy,
   * while only non-empty Python arrays are consider truthy.
   *
   * e.g.,
   *  - JavaScript:  {} && 5 -> 5
   *  - Python:      {} and 5 -> {}
   */
  __bool__() {
    return new se(this.value.size > 0);
  }
  get builtins() {
    return this._builtins ??= /* @__PURE__ */ new Map([
      [
        "get",
        new Ne(([e, t]) => {
          if (!(e instanceof K))
            throw new Error(`Object key must be a string: got ${e.type}`);
          return this.value.get(e.value) ?? t ?? new Be();
        })
      ],
      ["items", new Ne(() => this.items())],
      ["keys", new Ne(() => this.keys())],
      ["values", new Ne(() => this.values())],
      [
        "dictsort",
        new Ne((e) => {
          let t = /* @__PURE__ */ new Map(), r = e.filter((i) => i instanceof tn ? (t = i.value, !1) : !0), n = r.at(0) ?? t.get("case_sensitive") ?? new se(!1);
          if (!(n instanceof se))
            throw new Error("case_sensitive must be a boolean");
          let s = r.at(1) ?? t.get("by") ?? new K("key");
          if (!(s instanceof K))
            throw new Error("by must be a string");
          if (!["key", "value"].includes(s.value))
            throw new Error("by must be either 'key' or 'value'");
          let a = r.at(2) ?? t.get("reverse") ?? new se(!1);
          if (!(a instanceof se))
            throw new Error("reverse must be a boolean");
          let o = Array.from(this.value.entries()).map(([i, l]) => new pe([new K(i), l])).sort((i, l) => {
            let c = s.value === "key" ? 0 : 1, d = i.value[c], h = l.value[c], _ = Li(d, h, n.value);
            return a.value ? -_ : _;
          });
          return new pe(o);
        })
      ]
    ]);
  }
  items() {
    return new pe(
      Array.from(this.value.entries()).map(([e, t]) => new pe([new K(e), t]))
    );
  }
  keys() {
    return new pe(Array.from(this.value.keys()).map((e) => new K(e)));
  }
  values() {
    return new pe(Array.from(this.value.values()));
  }
  toString() {
    return Fr(this, {}, 0, !1);
  }
}, tn = class extends ct {
  type = "KeywordArgumentsValue";
}, tl = class extends Vt {
  type = "NamespaceValue";
  toString() {
    return Fr(this, {}, 0, !1);
  }
}, pe = class extends Vt {
  type = "ArrayValue";
  _builtins;
  get builtins() {
    return this._builtins ??= /* @__PURE__ */ new Map([["length", new oe(this.value.length)]]);
  }
  /**
   * NOTE: necessary to override since all JavaScript arrays are considered truthy,
   * while only non-empty Python arrays are consider truthy.
   *
   * e.g.,
   *  - JavaScript:  [] && 5 -> 5
   *  - Python:      [] and 5 -> []
   */
  __bool__() {
    return new se(this.value.length > 0);
  }
  toString() {
    return Fr(this, {}, 0, !1);
  }
}, Z_ = class extends pe {
  type = "TupleValue";
}, Ne = class extends Vt {
  type = "FunctionValue";
}, Be = class extends Vt {
  type = "NullValue";
}, Oe = class extends Vt {
  type = "UndefinedValue";
};
function Xk(e) {
  let t;
  if (e instanceof pe ? t = e.value : e instanceof K && (t = Array.from(e.value, (s) => new K(s))), !t || t.length !== 2)
    throw new Error("namespace expected an object or an iterable of [key, value] pairs");
  let [r, n] = t;
  if (!(r instanceof K))
    throw new Error("namespace keys must be strings");
  return [r, n];
}
var sm = class {
  constructor(e) {
    this.parent = e;
  }
  /**
   * The variables declared in this environment.
   */
  variables = /* @__PURE__ */ new Map([
    [
      "namespace",
      new Ne((e) => {
        let t = e.slice(), r;
        if (t.at(-1) instanceof tn && (r = t.pop()), t.length > 1)
          throw new Error(`namespace expected at most 1 argument, got ${t.length}`);
        let n = /* @__PURE__ */ new Map();
        if (t.length === 1) {
          let s = t[0];
          if (s instanceof ct)
            for (let [a, o] of s.value)
              n.set(a, o);
          else if (s instanceof pe)
            for (let a of s.value) {
              let [o, i] = Xk(a);
              n.set(o.value, i);
            }
          else
            throw new Error(`'${s.type}' object is not iterable`);
        }
        if (r)
          for (let [s, a] of r.value)
            n.set(s, a);
        return new tl(n);
      })
    ]
  ]);
  tests = sm.TESTS;
  /**
   * Set the value of a variable in the current environment.
   */
  set(e, t) {
    return this.declareVariable(e, aa(t));
  }
  declareVariable(e, t) {
    if (this.variables.has(e))
      throw new SyntaxError(`Variable already declared: ${e}`);
    return this.variables.set(e, t), t;
  }
  // private assignVariable(name: string, value: AnyRuntimeValue): AnyRuntimeValue {
  // 	const env = this.resolve(name);
  // 	env.variables.set(name, value);
  // 	return value;
  // }
  /**
   * Set variable in the current scope.
   * See https://jinja.palletsprojects.com/en/3.0.x/templates/#assignments for more information.
   */
  setVariable(e, t) {
    return this.variables.set(e, t), t;
  }
  /**
   * Resolve the environment in which the variable is declared.
   * @param {string} name The name of the variable.
   * @returns {Environment} The environment in which the variable is declared.
   */
  resolve(e) {
    if (this.variables.has(e))
      return this;
    if (this.parent)
      return this.parent.resolve(e);
    throw new Error(`Unknown variable: ${e}`);
  }
  lookupVariable(e) {
    try {
      return this.resolve(e).variables.get(e) ?? new Oe();
    } catch {
      return new Oe();
    }
  }
}, Ar = sm;
fk(Ar, "TESTS", /* @__PURE__ */ new Map([
  ["boolean", (e) => e.type === "BooleanValue"],
  ["callable", (e) => e instanceof Ne],
  [
    "odd",
    (e) => {
      if (!(e instanceof oe))
        throw new Error(`cannot odd on ${e.type}`);
      return e.value % 2 !== 0;
    }
  ],
  [
    "even",
    (e) => {
      if (!(e instanceof oe))
        throw new Error(`cannot even on ${e.type}`);
      return e.value % 2 === 0;
    }
  ],
  ["false", (e) => e.type === "BooleanValue" && !e.value],
  ["true", (e) => e.type === "BooleanValue" && e.value],
  ["none", (e) => e.type === "NullValue"],
  ["string", (e) => e.type === "StringValue"],
  ["number", (e) => e instanceof oe || e instanceof Te],
  ["integer", (e) => e instanceof oe],
  ["iterable", (e) => e.type === "ArrayValue" || e.type === "StringValue"],
  ["mapping", (e) => e instanceof ct],
  [
    "sequence",
    (e) => e instanceof pe || e instanceof ct || e instanceof K
  ],
  [
    "lower",
    (e) => {
      let t = e.value;
      return e.type === "StringValue" && t === t.toLowerCase();
    }
  ],
  [
    "upper",
    (e) => {
      let t = e.value;
      return e.type === "StringValue" && t === t.toUpperCase();
    }
  ],
  ["none", (e) => e.type === "NullValue"],
  ["defined", (e) => e.type !== "UndefinedValue"],
  ["undefined", (e) => e.type === "UndefinedValue"],
  ["equalto", (e, t) => e.value === t.value],
  ["eq", (e, t) => e.value === t.value]
]));
function Yk(e) {
  e.set("false", !1), e.set("true", !0), e.set("none", null), e.set("raise_exception", (t) => {
    throw new Error(t);
  }), e.set("range", Gk), e.set("strftime_now", Uk), e.set("True", !0), e.set("False", !1), e.set("None", null);
}
function sa(e) {
  return e instanceof ct || e instanceof tl;
}
function _a(e) {
  return e instanceof oe || e instanceof Te || e instanceof se;
}
function pa(e) {
  return e instanceof se ? Number(e.value) : e.value;
}
function ep(e, t) {
  let r = t.split("."), n = e;
  for (let s of r)
    if (sa(n))
      n = n.value.get(s) ?? new Oe();
    else if (n instanceof pe) {
      let a = parseInt(s, 10);
      if (!isNaN(a) && a >= 0 && a < n.value.length)
        n = n.value[a];
      else
        return new Oe();
    } else
      return new Oe();
  return n;
}
function Li(e, t, r = !1) {
  if (e instanceof Be && t instanceof Be)
    return 0;
  if (e instanceof Be || t instanceof Be)
    throw new Error(`Cannot compare ${e.type} with ${t.type}`);
  if (e instanceof Oe && t instanceof Oe)
    return 0;
  if (e instanceof Oe || t instanceof Oe)
    throw new Error(`Cannot compare ${e.type} with ${t.type}`);
  if (_a(e) && _a(t)) {
    let n = pa(e), s = pa(t);
    return n < s ? -1 : n > s ? 1 : 0;
  }
  if (e.type !== t.type)
    throw new Error(`Cannot compare different types: ${e.type} and ${t.type}`);
  if (e.type === "StringValue") {
    let n = e.value, s = t.value;
    return r || (n = n.toLowerCase(), s = s.toLowerCase()), n < s ? -1 : n > s ? 1 : 0;
  } else
    throw new Error(`Cannot compare type: ${e.type}`);
}
function Oi(e) {
  if (e.type === "Identifier")
    return { name: e.value };
  let t = e;
  return { name: t.key.value, defaultValue: t.value };
}
function tp(e) {
  return e === "kwargs" || e === "varargs";
}
function rp(e, t) {
  let r = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Set(), s = (d) => {
    tp(d) && r.add(d);
  }, a = (d) => {
    if (d.type === "Identifier")
      s(d.value);
    else if (d.type === "TupleLiteral")
      for (let h of d.value)
        a(h);
  }, o = (d) => {
    s(Oi(d).name);
  }, i = (d) => {
    for (let h of d) {
      let _ = Oi(h);
      _.defaultValue && c(_.defaultValue);
    }
  }, l = (d) => {
    d.type === "CallExpression" && c(d.args);
  }, c = (d) => {
    if (Array.isArray(d)) {
      for (let h of d)
        c(h);
      return;
    }
    if (d instanceof Map) {
      for (let [h, _] of d)
        c(h), c(_);
      return;
    }
    if (d instanceof Pt)
      switch (d.type) {
        case "For": {
          let h = d;
          if (a(h.loopvar), h.iterable.type === "SelectExpression") {
            let _ = h.iterable;
            c(_.lhs), c(h.body), c(h.defaultBlock), c(_.test);
            return;
          }
          c(h.iterable), c(h.body), c(h.defaultBlock);
          return;
        }
        case "Set": {
          let h = d;
          a(h.assignee), c(h.value), c(h.body);
          return;
        }
        case "Macro": {
          let h = d;
          for (let _ of h.args)
            o(_);
          i(h.args), c(h.body);
          return;
        }
        case "CallStatement": {
          let h = d;
          c(h.call);
          for (let _ of h.callerArgs ?? [])
            o(_);
          i(h.callerArgs ?? []), c(h.body);
          return;
        }
        case "FilterStatement": {
          let h = d;
          c(h.body), l(h.filter);
          return;
        }
        case "Identifier": {
          let h = d.value;
          tp(h) && !r.has(h) && n.add(h);
          return;
        }
        case "MemberExpression": {
          let h = d;
          c(h.object), h.computed && c(h.property);
          return;
        }
        case "FilterExpression": {
          let h = d;
          c(h.operand), l(h.filter);
          return;
        }
        case "TestExpression":
          c(d.operand);
          return;
        case "SelectExpression": {
          let h = d;
          c(h.test), c(h.lhs);
          return;
        }
        case "KeywordArgumentExpression":
          c(d.value);
          return;
        default:
          for (let h of Object.values(d))
            c(h);
      }
  };
  for (let d of e)
    o(d);
  return c(t), n;
}
var Kk = class {
  global;
  constructor(e) {
    this.global = e ?? new Ar();
  }
  /**
   * Run the program.
   */
  run(e) {
    return this.evaluate(e, this.global);
  }
  /**
   * Evaluates expressions following the binary operation type.
   */
  evaluateBinaryExpression(e, t) {
    let r = this.evaluate(e.left, t);
    switch (e.operator.value) {
      case "and":
        return r.__bool__().value ? this.evaluate(e.right, t) : r;
      case "or":
        return r.__bool__().value ? r : this.evaluate(e.right, t);
    }
    let n = this.evaluate(e.right, t);
    switch (e.operator.value) {
      case "==":
        return new se(r.value == n.value);
      case "!=":
        return new se(r.value != n.value);
    }
    if (r instanceof Oe || n instanceof Oe) {
      if (n instanceof Oe && ["in", "not in"].includes(e.operator.value))
        return new se(e.operator.value === "not in");
      throw new Error(`Cannot perform operation ${e.operator.value} on undefined values`);
    } else {
      if (r instanceof Be || n instanceof Be)
        throw new Error("Cannot perform operation on null values");
      if (e.operator.value === "~")
        return new K(r.value.toString() + n.value.toString());
      if (e.operator.value === "**" && _a(r) && _a(n)) {
        let s = pa(r), a = pa(n);
        if (s === 0 && a < 0)
          throw new Error("0.0 cannot be raised to a negative power");
        let o = s ** a;
        if (!Number.isFinite(o))
          throw new Error("Exponentiation result is not a finite real number");
        return r instanceof Te || n instanceof Te || a < 0 ? new Te(o) : new oe(o);
      } else if ((r instanceof oe || r instanceof Te) && (n instanceof oe || n instanceof Te)) {
        let s = r.value, a = n.value;
        switch (e.operator.value) {
          case "+":
          case "-":
          case "*": {
            let o = e.operator.value === "+" ? s + a : e.operator.value === "-" ? s - a : s * a;
            return r instanceof Te || n instanceof Te ? new Te(o) : new oe(o);
          }
          case "/":
            return new Te(s / a);
          case "//": {
            let o = Math.floor(s / a);
            return r instanceof Te || n instanceof Te ? new Te(o) : new oe(o);
          }
          case "%": {
            let o = s % a;
            return r instanceof Te || n instanceof Te ? new Te(o) : new oe(o);
          }
          case "<":
            return new se(s < a);
          case ">":
            return new se(s > a);
          case ">=":
            return new se(s >= a);
          case "<=":
            return new se(s <= a);
        }
      } else if (r instanceof pe && n instanceof pe) {
        if (e.operator.value === "+")
          return new pe(r.value.concat(n.value));
      } else if (n instanceof pe) {
        let s = n.value.find((a) => a.value === r.value) !== void 0;
        switch (e.operator.value) {
          case "in":
            return new se(s);
          case "not in":
            return new se(!s);
        }
      }
    }
    if ((r instanceof K || n instanceof K) && e.operator.value === "+")
      return new K(r.value.toString() + n.value.toString());
    if (r instanceof K && n instanceof K)
      switch (e.operator.value) {
        case "in":
          return new se(n.value.includes(r.value));
        case "not in":
          return new se(!n.value.includes(r.value));
      }
    if (r instanceof K && n instanceof ct)
      switch (e.operator.value) {
        case "in":
          return new se(n.value.has(r.value));
        case "not in":
          return new se(!n.value.has(r.value));
      }
    throw new SyntaxError(`Unknown operator "${e.operator.value}" between ${r.type} and ${n.type}`);
  }
  evaluateArguments(e, t) {
    let r = [], n = /* @__PURE__ */ new Map(), s = (a, o) => {
      if (n.has(a))
        throw new Error(`Got multiple values for keyword argument '${a}'`);
      n.set(a, o);
    };
    for (let a of e)
      if (a.type === "SpreadExpression") {
        let o = a, i = this.evaluate(o.argument, t);
        if (!(i instanceof pe))
          throw new Error(`Cannot unpack non-iterable type: ${i.type}`);
        for (let l of i.value)
          r.push(l);
      } else a.type !== "KeywordArgumentExpression" && a.type !== "KeywordSpreadExpression" && r.push(this.evaluate(a, t));
    for (let a of e)
      if (a.type === "KeywordArgumentExpression") {
        let o = a;
        s(o.key.value, this.evaluate(o.value, t));
      } else if (a.type === "KeywordSpreadExpression") {
        let o = a, i = this.evaluate(o.argument, t);
        if (!(i instanceof ct))
          throw new Error(`Argument after ** must be a mapping, not ${i.type}`);
        for (let [l, c] of i.value)
          s(l, c);
      }
    return [r, n];
  }
  applyFilter(e, t, r) {
    if (t.type === "Identifier") {
      let n = t;
      if (n.value === "safe")
        return e;
      if (n.value === "tojson")
        return new K(Fr(e, {}));
      if (e instanceof pe)
        switch (n.value) {
          case "list":
            return e;
          case "first":
            return e.value[0];
          case "last":
            return e.value[e.value.length - 1];
          case "length":
            return new oe(e.value.length);
          case "reverse":
            return new pe(e.value.slice().reverse());
          case "sort":
            return new pe(e.value.slice().sort((s, a) => Li(s, a, !1)));
          case "join":
            return new K(e.value.map((s) => s.value).join(""));
          case "string":
            return new K(Fr(e, {}, 0, !1));
          case "unique": {
            let s = /* @__PURE__ */ new Set(), a = [];
            for (let o of e.value)
              s.has(o.value) || (s.add(o.value), a.push(o));
            return new pe(a);
          }
          default:
            throw new Error(`Unknown ArrayValue filter: ${n.value}`);
        }
      else if (e instanceof K)
        switch (n.value) {
          case "length":
          case "upper":
          case "lower":
          case "title":
          case "capitalize": {
            let s = e.builtins.get(n.value);
            if (s instanceof Ne)
              return s.value(
                /* no arguments */
                [],
                r
              );
            if (s instanceof oe)
              return s;
            throw new Error(`Unknown StringValue filter: ${n.value}`);
          }
          case "trim":
            return new K(e.value.trim());
          case "indent":
            return new K(
              e.value.split(`
`).map(
                (s, a) => (
                  // By default, don't indent the first line or empty lines
                  a === 0 || s.length === 0 ? s : "    " + s
                )
              ).join(`
`)
            );
          case "join":
          case "string":
            return e;
          case "int": {
            let s = parseInt(e.value, 10);
            return new oe(isNaN(s) ? 0 : s);
          }
          case "float": {
            let s = parseFloat(e.value);
            return new Te(isNaN(s) ? 0 : s);
          }
          default:
            throw new Error(`Unknown StringValue filter: ${n.value}`);
        }
      else if (e instanceof oe || e instanceof Te)
        switch (n.value) {
          case "abs":
            return e instanceof oe ? new oe(Math.abs(e.value)) : new Te(Math.abs(e.value));
          case "int":
            return new oe(Math.floor(e.value));
          case "float":
            return new Te(e.value);
          case "string":
            return new K(e.toString());
          default:
            throw new Error(`Unknown NumericValue filter: ${n.value}`);
        }
      else if (e instanceof ct)
        switch (n.value) {
          case "items":
            return new pe(
              Array.from(e.value.entries()).map(([s, a]) => new pe([new K(s), a]))
            );
          case "length":
            return new oe(e.value.size);
          default: {
            let s = e.builtins.get(n.value);
            if (s)
              return s instanceof Ne ? s.value([], r) : s;
            throw new Error(`Unknown ObjectValue filter: ${n.value}`);
          }
        }
      else if (e instanceof se)
        switch (n.value) {
          case "bool":
            return new se(e.value);
          case "int":
            return new oe(e.value ? 1 : 0);
          case "float":
            return new Te(e.value ? 1 : 0);
          case "string":
            return new K(e.value ? "true" : "false");
          default:
            throw new Error(`Unknown BooleanValue filter: ${n.value}`);
        }
      throw new Error(`Cannot apply filter "${n.value}" to type: ${e.type}`);
    } else if (t.type === "CallExpression") {
      let n = t;
      if (n.callee.type !== "Identifier")
        throw new Error(`Unknown filter: ${n.callee.type}`);
      let s = n.callee.value;
      if (s === "tojson") {
        let [, a] = this.evaluateArguments(n.args, r), o = a.get("indent") ?? new Be();
        if (!(o instanceof oe || o instanceof Be))
          throw new Error("If set, indent must be a number");
        let i = a.get("ensure_ascii") ?? new se(!1);
        if (!(i instanceof se))
          throw new Error("If set, ensure_ascii must be a boolean");
        let l = a.get("sort_keys") ?? new se(!1);
        if (!(l instanceof se))
          throw new Error("If set, sort_keys must be a boolean");
        let c = a.get("separators") ?? new Be(), d = null;
        if (c instanceof pe || c instanceof Z_) {
          if (c.value.length !== 2)
            throw new Error("separators must be a tuple of two strings");
          let [h, _] = c.value;
          if (!(h instanceof K) || !(_ instanceof K))
            throw new Error("separators must be a tuple of two strings");
          d = [h.value, _.value];
        } else if (!(c instanceof Be))
          throw new Error("If set, separators must be a tuple of two strings");
        return new K(
          Fr(e, {
            indent: o.value,
            ensureAscii: i.value,
            sortKeys: l.value,
            separators: d
          })
        );
      } else if (s === "join") {
        let a;
        if (e instanceof K)
          a = Array.from(e.value);
        else if (e instanceof pe)
          a = e.value.map((c) => c.value);
        else
          throw new Error(`Cannot apply filter "${s}" to type: ${e.type}`);
        let [o, i] = this.evaluateArguments(n.args, r), l = o.at(0) ?? i.get("separator") ?? new K("");
        if (!(l instanceof K))
          throw new Error("separator must be a string");
        return new K(a.join(l.value));
      } else if (s === "int" || s === "float") {
        let [a, o] = this.evaluateArguments(n.args, r), i = a.at(0) ?? o.get("default") ?? (s === "int" ? new oe(0) : new Te(0));
        if (e instanceof K) {
          let l = s === "int" ? parseInt(e.value, 10) : parseFloat(e.value);
          return isNaN(l) ? i : s === "int" ? new oe(l) : new Te(l);
        } else {
          if (e instanceof oe || e instanceof Te)
            return e;
          if (e instanceof se)
            return s === "int" ? new oe(e.value ? 1 : 0) : new Te(e.value ? 1 : 0);
          throw new Error(`Cannot apply filter "${s}" to type: ${e.type}`);
        }
      } else if (s === "default") {
        let [a, o] = this.evaluateArguments(n.args, r), i = a[0] ?? new K(""), l = a[1] ?? o.get("boolean") ?? new se(!1);
        if (!(l instanceof se))
          throw new Error("`default` filter flag must be a boolean");
        return e instanceof Oe || l.value && !e.__bool__().value ? i : e;
      }
      if (e instanceof pe) {
        switch (s) {
          case "sort": {
            let [a, o] = this.evaluateArguments(n.args, r), i = a.at(0) ?? o.get("reverse") ?? new se(!1);
            if (!(i instanceof se))
              throw new Error("reverse must be a boolean");
            let l = a.at(1) ?? o.get("case_sensitive") ?? new se(!1);
            if (!(l instanceof se))
              throw new Error("case_sensitive must be a boolean");
            let c = a.at(2) ?? o.get("attribute") ?? new Be();
            if (!(c instanceof K || c instanceof oe || c instanceof Be))
              throw new Error("attribute must be a string, integer, or null");
            let d = (h) => {
              if (c instanceof Be)
                return h;
              let _ = c instanceof oe ? String(c.value) : c.value;
              return ep(h, _);
            };
            return new pe(
              e.value.slice().sort((h, _) => {
                let p = d(h), w = d(_), v = Li(p, w, l.value);
                return i.value ? -v : v;
              })
            );
          }
          case "selectattr":
          case "rejectattr": {
            let a = s === "selectattr";
            if (e.value.some((h) => !sa(h)))
              throw new Error(`\`${s}\` can only be applied to array of objects`);
            if (n.args.some((h) => h.type !== "StringLiteral"))
              throw new Error(`arguments of \`${s}\` must be strings`);
            let [o, i, l] = n.args.map((h) => this.evaluate(h, r)), c;
            if (i) {
              let h = r.tests.get(i.value);
              if (!h)
                throw new Error(`Unknown test: ${i.value}`);
              c = h;
            } else
              c = (...h) => h[0].__bool__().value;
            let d = e.value.filter((h) => {
              let _ = h.value.get(o.value), p = _ ? c(_, l) : !1;
              return a ? p : !p;
            });
            return new pe(d);
          }
          case "map": {
            let [, a] = this.evaluateArguments(n.args, r);
            if (a.has("attribute")) {
              let o = a.get("attribute");
              if (!(o instanceof K))
                throw new Error("attribute must be a string");
              let i = a.get("default"), l = e.value.map((c) => {
                if (!sa(c))
                  throw new Error("items in map must be an object");
                let d = ep(c, o.value);
                return d instanceof Oe ? i ?? new Oe() : d;
              });
              return new pe(l);
            } else
              throw new Error("`map` expressions without `attribute` set are not currently supported.");
          }
        }
        throw new Error(`Unknown ArrayValue filter: ${s}`);
      } else if (e instanceof K) {
        switch (s) {
          case "indent": {
            let [a, o] = this.evaluateArguments(n.args, r), i = a.at(0) ?? o.get("width") ?? new oe(4);
            if (!(i instanceof oe))
              throw new Error("width must be a number");
            let l = a.at(1) ?? o.get("first") ?? new se(!1), c = a.at(2) ?? o.get("blank") ?? new se(!1), d = e.value.split(`
`), h = " ".repeat(i.value), _ = d.map(
              (p, w) => !l.value && w === 0 || !c.value && p.length === 0 ? p : h + p
            );
            return new K(_.join(`
`));
          }
          case "replace": {
            let a = e.builtins.get("replace");
            if (!(a instanceof Ne))
              throw new Error("replace filter not available");
            let [o, i] = this.evaluateArguments(n.args, r);
            return a.value([...o, new tn(i)], r);
          }
        }
        throw new Error(`Unknown StringValue filter: ${s}`);
      } else if (e instanceof ct) {
        let a = e.builtins.get(s);
        if (a && a instanceof Ne) {
          let [o, i] = this.evaluateArguments(n.args, r);
          return i.size > 0 && o.push(new tn(i)), a.value(o, r);
        }
        throw new Error(`Unknown ObjectValue filter: ${s}`);
      } else
        throw new Error(`Cannot apply filter "${s}" to type: ${e.type}`);
    }
    throw new Error(`Unknown filter: ${t.type}`);
  }
  /**
   * Evaluates expressions following the filter operation type.
   */
  evaluateFilterExpression(e, t) {
    let r = this.evaluate(e.operand, t);
    return this.applyFilter(r, e.filter, t);
  }
  /**
   * Evaluates expressions following the test operation type.
   */
  evaluateTestExpression(e, t) {
    let r = this.evaluate(e.operand, t), n = t.tests.get(e.test.value);
    if (!n)
      throw new Error(`Unknown test: ${e.test.value}`);
    let s = n(r);
    return new se(e.negate ? !s : s);
  }
  /**
   * Evaluates expressions following the select operation type.
   */
  evaluateSelectExpression(e, t) {
    return this.evaluate(e.test, t).__bool__().value ? this.evaluate(e.lhs, t) : new Oe();
  }
  /**
   * Evaluates expressions following the unary operation type.
   */
  evaluateUnaryExpression(e, t) {
    let r = this.evaluate(e.argument, t);
    switch (e.operator.value) {
      case "not":
        return new se(!r.value);
      case "+":
      case "-": {
        let n = e.operator.value === "-" ? -1 : 1;
        if (r instanceof oe || r instanceof Te || r instanceof se) {
          let s = r instanceof se ? r.value ? 1 : 0 : r.value, a = n * s;
          return r instanceof Te ? new Te(a) : new oe(a);
        }
        throw new SyntaxError(`Unknown operator "${e.operator.value}" for ${r.type}`);
      }
      default:
        throw new SyntaxError(`Unknown operator: ${e.operator.value}`);
    }
  }
  evaluateTernaryExpression(e, t) {
    return this.evaluate(e.condition, t).__bool__().value ? this.evaluate(e.trueExpr, t) : this.evaluate(e.falseExpr, t);
  }
  evalProgram(e, t) {
    return this.evaluateBlock(e.body, t);
  }
  evaluateBlock(e, t) {
    let r = "";
    for (let n of e) {
      let s = this.evaluate(n, t);
      s.type !== "NullValue" && s.type !== "UndefinedValue" && (r += s.toString());
    }
    return new K(r);
  }
  evaluateIdentifier(e, t) {
    return t.lookupVariable(e.value);
  }
  evaluateCallExpression(e, t) {
    let [r, n] = this.evaluateArguments(e.args, t);
    n.size > 0 && r.push(new tn(n));
    let s = this.evaluate(e.callee, t);
    if (s.type !== "FunctionValue")
      throw new Error(`Cannot call something that is not a function: got ${s.type}`);
    return s.value(r, t);
  }
  evaluateSliceExpression(e, t, r) {
    if (!(e instanceof pe || e instanceof K))
      throw new Error("Slice object must be an array or string");
    let n = this.evaluate(t.start, r), s = this.evaluate(t.stop, r), a = this.evaluate(t.step, r);
    if (!(n instanceof oe || n instanceof Oe))
      throw new Error("Slice start must be numeric or undefined");
    if (!(s instanceof oe || s instanceof Oe))
      throw new Error("Slice stop must be numeric or undefined");
    if (!(a instanceof oe || a instanceof Oe))
      throw new Error("Slice step must be numeric or undefined");
    return e instanceof pe ? new pe(X_(e.value, n.value, s.value, a.value)) : new K(X_(Array.from(e.value), n.value, s.value, a.value).join(""));
  }
  evaluateMemberExpression(e, t) {
    let r = this.evaluate(e.object, t), n;
    if (e.computed) {
      if (e.property.type === "SliceExpression")
        return this.evaluateSliceExpression(r, e.property, t);
      n = this.evaluate(e.property, t);
    } else e.property.type === "IntegerLiteral" ? n = new oe(e.property.value) : n = new K(e.property.value);
    let s;
    if (sa(r)) {
      if (!(n instanceof K))
        throw new Error(`Cannot access property with non-string: got ${n.type}`);
      s = r.value.get(n.value) ?? (r instanceof ct ? r.builtins.get(n.value) : void 0);
    } else if (r instanceof pe || r instanceof K)
      if (n instanceof oe)
        s = r.value.at(n.value), r instanceof K && (s = new K(r.value.at(n.value)));
      else if (n instanceof K)
        s = r.builtins.get(n.value);
      else
        throw new Error(`Cannot access property with non-string/non-number: got ${n.type}`);
    else {
      if (!(n instanceof K))
        throw new Error(`Cannot access property with non-string: got ${n.type}`);
      s = r.builtins.get(n.value);
    }
    return s instanceof Vt ? s : new Oe();
  }
  evaluateSet(e, t) {
    let r = e.value ? this.evaluate(e.value, t) : this.evaluateBlock(e.body, t);
    if (e.assignee.type === "Identifier") {
      let n = e.assignee.value;
      t.setVariable(n, r);
    } else if (e.assignee.type === "TupleLiteral") {
      let n = e.assignee;
      if (!(r instanceof pe))
        throw new Error(`Cannot unpack non-iterable type in set: ${r.type}`);
      let s = r.value;
      if (s.length !== n.value.length)
        throw new Error(`Too ${n.value.length > s.length ? "few" : "many"} items to unpack in set`);
      for (let a = 0; a < n.value.length; ++a) {
        let o = n.value[a];
        if (o.type !== "Identifier")
          throw new Error(`Cannot unpack to non-identifier in set: ${o.type}`);
        t.setVariable(o.value, s[a]);
      }
    } else if (e.assignee.type === "MemberExpression") {
      let n = e.assignee, s = this.evaluate(n.object, t);
      if (!(s instanceof tl))
        throw new Error("cannot assign attribute on non-namespace object");
      if (n.property.type !== "Identifier")
        throw new Error("Cannot assign to member with non-identifier property");
      s.value.set(n.property.value, r);
    } else
      throw new Error(`Invalid LHS inside assignment expression: ${JSON.stringify(e.assignee)}`);
    return new Be();
  }
  evaluateIf(e, t) {
    let r = this.evaluate(e.test, t);
    return this.evaluateBlock(r.__bool__().value ? e.body : e.alternate, t);
  }
  evaluateFor(e, t) {
    let r = new Ar(t), n, s;
    if (e.iterable.type === "SelectExpression") {
      let c = e.iterable;
      s = this.evaluate(c.lhs, r), n = c.test;
    } else
      s = this.evaluate(e.iterable, r);
    if (!(s instanceof pe || s instanceof ct))
      throw new Error(`Expected iterable or object type in for loop: got ${s.type}`);
    s instanceof ct && (s = s.keys());
    let a = [], o = [];
    for (let c = 0; c < s.value.length; ++c) {
      let d = new Ar(r), h = s.value[c], _;
      if (e.loopvar.type === "Identifier")
        _ = (p) => p.setVariable(e.loopvar.value, h);
      else if (e.loopvar.type === "TupleLiteral") {
        let p = e.loopvar;
        if (h.type !== "ArrayValue")
          throw new Error(`Cannot unpack non-iterable type: ${h.type}`);
        let w = h;
        if (p.value.length !== w.value.length)
          throw new Error(`Too ${p.value.length > w.value.length ? "few" : "many"} items to unpack`);
        _ = (v) => {
          for (let y = 0; y < p.value.length; ++y) {
            if (p.value[y].type !== "Identifier")
              throw new Error(`Cannot unpack non-identifier type: ${p.value[y].type}`);
            v.setVariable(p.value[y].value, w.value[y]);
          }
        };
      } else
        throw new Error(`Invalid loop variable(s): ${e.loopvar.type}`);
      n && (_(d), !this.evaluate(n, d).__bool__().value) || (a.push(h), o.push(_));
    }
    let i = "", l = !0;
    for (let c = 0; c < a.length; ++c) {
      let d = /* @__PURE__ */ new Map([
        ["index", new oe(c + 1)],
        ["index0", new oe(c)],
        ["revindex", new oe(a.length - c)],
        ["revindex0", new oe(a.length - c - 1)],
        ["first", new se(c === 0)],
        ["last", new se(c === a.length - 1)],
        ["length", new oe(a.length)],
        ["previtem", c > 0 ? a[c - 1] : new Oe()],
        ["nextitem", c < a.length - 1 ? a[c + 1] : new Oe()]
      ]);
      r.setVariable("loop", new ct(d)), o[c](r);
      try {
        let h = this.evaluateBlock(e.body, r);
        i += h.value;
      } catch (h) {
        if (h instanceof K_)
          continue;
        if (h instanceof Y_)
          break;
        throw h;
      }
      l = !1;
    }
    if (l) {
      let c = this.evaluateBlock(e.defaultBlock, r);
      i += c.value;
    }
    return new K(i);
  }
  /**
   * Bind every parameter name and special argument before evaluating defaults,
   * preventing unbound parameters from resolving in an outer scope.
   */
  bindMacroArguments(e, t, r, n, s) {
    let a = n.slice(), o = /* @__PURE__ */ new Map();
    a.at(-1) instanceof tn && (o = new Map(a.pop().value));
    let i = [];
    for (let l = 0; l < t.length; ++l) {
      let { name: c, defaultValue: d } = Oi(t[l]), h = a[l];
      h === void 0 && o.has(c) && (h = o.get(c), o.delete(c)), h === void 0 && d !== void 0 && i.push([c, d]), s.setVariable(c, h ?? new Oe());
    }
    if (r.has("kwargs"))
      s.setVariable("kwargs", new ct(o));
    else if (o.size > 0)
      throw new Error(`macro ${e} takes no keyword argument '${o.keys().next().value}'`);
    if (r.has("varargs"))
      s.setVariable("varargs", new pe(a.slice(t.length)));
    else if (a.length > t.length)
      throw new Error(`macro ${e} takes not more than ${t.length} argument(s)`);
    for (let [l, c] of i)
      s.setVariable(l, this.evaluate(c, s));
  }
  /**
   * See https://jinja.palletsprojects.com/en/3.1.x/templates/#macros for more information.
   */
  evaluateMacro(e, t) {
    let r = rp(e.args, e.body);
    return t.setVariable(
      e.name.value,
      new Ne((n, s) => {
        let a = new Ar(s);
        return this.bindMacroArguments(`'${e.name.value}'`, e.args, r, n, a), this.evaluateBlock(e.body, a);
      })
    ), new Be();
  }
  evaluateCallStatement(e, t) {
    let r = e.callerArgs ?? [], n = rp(r, e.body), s = new Ne((c) => {
      let d = new Ar(t);
      return this.bindMacroArguments("None", r, n, c, d), this.evaluateBlock(e.body, d);
    }), [a, o] = this.evaluateArguments(e.call.args, t);
    a.push(new tn(o));
    let i = this.evaluate(e.call.callee, t);
    if (i.type !== "FunctionValue")
      throw new Error(`Cannot call something that is not a function: got ${i.type}`);
    let l = new Ar(t);
    return l.setVariable("caller", s), i.value(a, l);
  }
  evaluateFilterStatement(e, t) {
    let r = this.evaluateBlock(e.body, t);
    return this.applyFilter(r, e.filter, t);
  }
  evaluate(e, t) {
    if (!e)
      return new Oe();
    switch (e.type) {
      case "Program":
        return this.evalProgram(e, t);
      case "Set":
        return this.evaluateSet(e, t);
      case "If":
        return this.evaluateIf(e, t);
      case "For":
        return this.evaluateFor(e, t);
      case "Macro":
        return this.evaluateMacro(e, t);
      case "CallStatement":
        return this.evaluateCallStatement(e, t);
      case "Break":
        throw new Y_();
      case "Continue":
        throw new K_();
      case "IntegerLiteral":
        return new oe(e.value);
      case "FloatLiteral":
        return new Te(e.value);
      case "StringLiteral":
        return new K(e.value);
      case "ArrayLiteral":
        return new pe(e.value.map((r) => this.evaluate(r, t)));
      case "TupleLiteral":
        return new Z_(e.value.map((r) => this.evaluate(r, t)));
      case "ObjectLiteral": {
        let r = /* @__PURE__ */ new Map();
        for (let [n, s] of e.value) {
          let a = this.evaluate(n, t);
          if (!(a instanceof K))
            throw new Error(`Object keys must be strings: got ${a.type}`);
          r.set(a.value, this.evaluate(s, t));
        }
        return new ct(r);
      }
      case "Identifier":
        return this.evaluateIdentifier(e, t);
      case "CallExpression":
        return this.evaluateCallExpression(e, t);
      case "MemberExpression":
        return this.evaluateMemberExpression(e, t);
      case "UnaryExpression":
        return this.evaluateUnaryExpression(e, t);
      case "BinaryExpression":
        return this.evaluateBinaryExpression(e, t);
      case "FilterExpression":
        return this.evaluateFilterExpression(e, t);
      case "FilterStatement":
        return this.evaluateFilterStatement(e, t);
      case "TestExpression":
        return this.evaluateTestExpression(e, t);
      case "SelectExpression":
        return this.evaluateSelectExpression(e, t);
      case "Ternary":
        return this.evaluateTernaryExpression(e, t);
      case "Comment":
        return new Be();
      default:
        throw new SyntaxError(`Unknown node type: ${e.type}`);
    }
  }
};
function aa(e) {
  switch (typeof e) {
    case "number":
      return Number.isInteger(e) ? new oe(e) : new Te(e);
    case "string":
      return new K(e);
    case "boolean":
      return new se(e);
    case "undefined":
      return new Oe();
    case "object":
      return e === null ? new Be() : Array.isArray(e) ? new pe(e.map(aa)) : new ct(
        new Map(Object.entries(e).map(([t, r]) => [t, aa(r)]))
      );
    case "function":
      return new Ne((t, r) => {
        let n = e(...t.map((s) => s.value)) ?? null;
        return aa(n);
      });
    default:
      throw new Error(`Cannot convert to runtime value: ${e}`);
  }
}
var Je = `
`, Jk = "{%- ", Zk = " -%}", Ge = Object.freeze({
  CONDITIONAL: 0,
  // a if b else c
  LOGICAL_OR: 1,
  // or
  LOGICAL_AND: 2,
  // and
  LOGICAL_NOT: 3,
  // not a
  COMPARISON: 4,
  // == != < <= > >= in, not in
  ADDITIVE: 5,
  // + -
  MULTIPLICATIVE: 6,
  // * / // %
  EXPONENTIATION: 7,
  // **
  TEST: 8,
  // is
  FILTER: 9,
  // |
  UNARY_SIGN: 10,
  // -a +a
  ATOM: 11
  // literals, identifiers, calls, member accesses
});
function am(e) {
  switch (e.operator.type) {
    case "ExponentiationBinaryOperator":
      return Ge.EXPONENTIATION;
    case "MultiplicativeBinaryOperator":
      return Ge.MULTIPLICATIVE;
    case "AdditiveBinaryOperator":
      return Ge.ADDITIVE;
    case "ComparisonBinaryOperator":
      return Ge.COMPARISON;
    case "Identifier":
      return e.operator.value === "and" ? Ge.LOGICAL_AND : e.operator.value === "in" || e.operator.value === "not in" ? Ge.COMPARISON : Ge.LOGICAL_OR;
  }
  return Ge.LOGICAL_OR;
}
function om(e) {
  switch (e.type) {
    case "SelectExpression":
    case "Ternary":
      return Ge.CONDITIONAL;
    case "BinaryExpression":
      return am(e);
    case "UnaryExpression":
      return e.operator.value === "not" ? Ge.LOGICAL_NOT : Ge.UNARY_SIGN;
    case "TestExpression":
      return Ge.TEST;
    case "FilterExpression":
      return Ge.FILTER;
    default:
      return Ge.ATOM;
  }
}
function Nt(e, t) {
  let r = Re(e);
  return om(e) < t ? `(${r})` : r;
}
function eT(e, t = "	") {
  let r = typeof t == "number" ? " ".repeat(t) : t;
  return Bt(e.body, 0, r).replace(/\n$/, "");
}
function st(...e) {
  return Jk + e.join(" ") + Zk;
}
function Bt(e, t, r) {
  return e.map((n) => tT(n, t, r)).join(Je);
}
function ma(e) {
  return e.map((t) => Re(t)).join(", ");
}
function tT(e, t, r) {
  let n = r.repeat(t);
  switch (e.type) {
    case "Program":
      return Bt(e.body, t, r);
    case "If":
      return rT(e, t, r);
    case "For":
      return nT(e, t, r);
    case "Set":
      return sT(e, t, r);
    case "Macro":
      return aT(e, t, r);
    case "Break":
      return n + st("break");
    case "Continue":
      return n + st("continue");
    case "CallStatement":
      return oT(e, t, r);
    case "FilterStatement":
      return iT(e, t, r);
    case "Comment":
      return n + "{# " + e.value + " #}";
    default:
      return n + "{{- " + Re(e) + " -}}";
  }
}
function rT(e, t, r) {
  let n = r.repeat(t), s = [], a = e;
  for (; a && (s.push({ test: a.test, body: a.body }), a.alternate.length === 1 && a.alternate[0].type === "If"); )
    a = a.alternate[0];
  let o = n + st("if", Re(s[0].test)) + Je + Bt(s[0].body, t + 1, r);
  for (let i = 1; i < s.length; ++i)
    o += Je + n + st("elif", Re(s[i].test)) + Je + Bt(s[i].body, t + 1, r);
  return a && a.alternate.length > 0 && (o += Je + n + st("else") + Je + Bt(a.alternate, t + 1, r)), o += Je + n + st("endif"), o;
}
function nT(e, t, r) {
  let n = r.repeat(t), s = "";
  if (e.iterable.type === "SelectExpression") {
    let o = e.iterable;
    s = `${Re(o.lhs)} if ${Re(o.test)}`;
  } else
    s = Re(e.iterable);
  let a = n + st("for", Re(e.loopvar), "in", s) + Je + Bt(e.body, t + 1, r);
  return e.defaultBlock.length > 0 && (a += Je + n + st("else") + Je + Bt(e.defaultBlock, t + 1, r)), a += Je + n + st("endfor"), a;
}
function sT(e, t, r) {
  let n = r.repeat(t), s = Re(e.assignee), a = e.value ? Re(e.value) : "", o = n + st("set", `${s}${e.value ? " = " + a : ""}`);
  return e.body.length === 0 ? o : o + Je + Bt(e.body, t + 1, r) + Je + n + st("endset");
}
function aT(e, t, r) {
  let n = r.repeat(t), s = ma(e.args);
  return n + st("macro", `${e.name.value}(${s})`) + Je + Bt(e.body, t + 1, r) + Je + n + st("endmacro");
}
function oT(e, t, r) {
  let n = r.repeat(t), s = e.callerArgs && e.callerArgs.length > 0 ? `(${ma(e.callerArgs)})` : "", a = Re(e.call), o = n + st(`call${s}`, a) + Je;
  return o += Bt(e.body, t + 1, r) + Je, o += n + st("endcall"), o;
}
function iT(e, t, r) {
  let n = r.repeat(t), s = e.filter.type === "Identifier" ? e.filter.value : Re(e.filter), a = n + st("filter", s) + Je;
  return a += Bt(e.body, t + 1, r) + Je, a += n + st("endfilter"), a;
}
function Re(e) {
  switch (e.type) {
    case "SpreadExpression":
      return `*${Re(e.argument)}`;
    case "KeywordSpreadExpression":
      return `**${Re(e.argument)}`;
    case "Identifier":
      return e.value;
    case "IntegerLiteral":
      return `${e.value}`;
    case "FloatLiteral": {
      let t = e.value;
      return Object.is(t, -0) ? "-0.0" : t % 1 === 0 ? t.toFixed(1) : t.toString();
    }
    case "StringLiteral":
      return JSON.stringify(e.value);
    case "BinaryExpression": {
      let t = e, r = am(t), n = Nt(t.left, r), s = Nt(t.right, r + 1);
      return `${n} ${t.operator.value} ${s}`;
    }
    case "UnaryExpression": {
      let t = e, r = t.argument.type === "UnaryExpression" ? om(t) : Ge.ATOM;
      return t.operator.value + (t.operator.value === "not" ? " " : "") + Nt(t.argument, r);
    }
    case "CallExpression": {
      let t = e, r = ma(t.args);
      return `${Re(t.callee)}(${r})`;
    }
    case "MemberExpression": {
      let t = e, r = Nt(t.object, Ge.ATOM), n = Re(t.property);
      return !t.computed && t.property.type !== "Identifier" && t.property.type !== "IntegerLiteral" && (n = `(${n})`), t.computed ? `${r}[${n}]` : `${r}.${n}`;
    }
    case "FilterExpression": {
      let t = e, r = Nt(t.operand, Ge.FILTER);
      return t.filter.type === "CallExpression" ? `${r} | ${Re(t.filter)}` : `${r} | ${t.filter.value}`;
    }
    case "SelectExpression": {
      let t = e;
      return `${Nt(t.lhs, Ge.LOGICAL_OR)} if ${Nt(t.test, Ge.LOGICAL_OR)}`;
    }
    case "TestExpression": {
      let t = e;
      return `${Nt(t.operand, Ge.TEST)} is${t.negate ? " not" : ""} ${t.test.value}`;
    }
    case "ArrayLiteral":
    case "TupleLiteral": {
      let t = ma(e.value), r = e.type === "ArrayLiteral" ? "[]" : "()";
      return `${r[0]}${t}${r[1]}`;
    }
    case "ObjectLiteral":
      return `{${Array.from(e.value.entries()).map(
        ([r, n]) => `${Re(r)}: ${Re(n)}`
      ).join(", ")}}`;
    case "SliceExpression": {
      let t = e, r = t.start ? Re(t.start) : "", n = t.stop ? Re(t.stop) : "", s = t.step ? `:${Re(t.step)}` : "";
      return `${r}:${n}${s}`;
    }
    case "KeywordArgumentExpression": {
      let t = e;
      return `${t.key.value}=${Re(t.value)}`;
    }
    case "Ternary": {
      let t = e;
      return `${Nt(t.trueExpr, Ge.LOGICAL_OR)} if ${Nt(
        t.condition,
        Ge.LOGICAL_OR
      )} else ${Nt(t.falseExpr, Ge.CONDITIONAL)}`;
    }
    default:
      throw new Error(`Unknown expression type: ${e.type}`);
  }
}
var lT = class {
  parsed;
  /**
   * @param {string} template The template string
   */
  constructor(e) {
    let t = gk(e, {
      lstrip_blocks: !0,
      trim_blocks: !0
    });
    this.parsed = $k(t);
  }
  render(e) {
    let t = new Ar();
    if (Yk(t), e)
      for (let [s, a] of Object.entries(e))
        t.set(s, a);
    return new Kk(t).run(this.parsed).value;
  }
  format(e) {
    return eT(this.parsed, e?.indent || "	");
  }
}, cT = {
  txt: "text/plain",
  html: "text/html",
  css: "text/css",
  js: "text/javascript",
  json: "application/json",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif"
}, ga = class im {
  /**
   * Creates a new `FileResponse` object.
   * @param {string} filePath
   */
  constructor(t) {
    if (this.filePath = t, this.headers = new Headers(), this.exists = xt.existsSync(t), this.exists) {
      this.status = 200, this.statusText = "OK";
      let r = xt.statSync(t);
      this.headers.set("content-length", r.size.toString()), this.updateContentType();
      let n = xt.createReadStream(t);
      this.body = new ReadableStream({
        start(s) {
          n.on("data", (a) => s.enqueue(a)), n.on("end", () => s.close()), n.on("error", (a) => s.error(a));
        },
        cancel() {
          n.destroy();
        }
      });
    } else
      this.status = 404, this.statusText = "Not Found", this.body = null;
  }
  /**
   * Updates the 'content-type' header property of the response based on the extension of
   * the file specified by the filePath property of the current object.
   * @returns {void}
   */
  updateContentType() {
    let t = this.filePath.toString().split(".").pop().toLowerCase();
    this.headers.set("content-type", cT[t] ?? "application/octet-stream");
  }
  /**
   * Clone the current FileResponse object.
   * @returns {FileResponse} A new FileResponse object with the same properties as the current object.
   */
  clone() {
    let t = new im(this.filePath);
    return t.exists = this.exists, t.status = this.status, t.statusText = this.statusText, t.headers = new Headers(this.headers), t;
  }
  /**
   * Reads the contents of the file specified by the filePath property and returns a Promise that
   * resolves with an ArrayBuffer containing the file's contents.
   * @returns {Promise<ArrayBuffer>} A Promise that resolves with an ArrayBuffer containing the file's contents.
   * @throws {Error} If the file cannot be read.
   */
  async arrayBuffer() {
    return (
      /** @type {ArrayBuffer} */
      (await xt.promises.readFile(this.filePath)).buffer
    );
  }
  /**
   * Reads the contents of the file specified by the filePath property and returns a Promise that
   * resolves with a Blob containing the file's contents.
   * @returns {Promise<Blob>} A Promise that resolves with a Blob containing the file's contents.
   * @throws {Error} If the file cannot be read.
   */
  async blob() {
    let t = await xt.promises.readFile(this.filePath);
    return new Blob([
      /** @type {any} */
      t
    ], { type: this.headers.get("content-type") });
  }
  /**
   * Reads the contents of the file specified by the filePath property and returns a Promise that
   * resolves with a string containing the file's contents.
   * @returns {Promise<string>} A Promise that resolves with a string containing the file's contents.
   * @throws {Error} If the file cannot be read.
   */
  async text() {
    return await xt.promises.readFile(this.filePath, "utf8");
  }
  /**
   * Reads the contents of the file specified by the filePath property and returns a Promise that
   * resolves with a parsed JavaScript object containing the file's contents.
   *
   * @returns {Promise<Object>} A Promise that resolves with a parsed JavaScript object containing the file's contents.
   * @throws {Error} If the file cannot be read.
   */
  async json() {
    return JSON.parse(await this.text());
  }
}, Aa = class {
  constructor(e) {
    this._mt = new Uint32Array(624), this._idx = 625, this._gauss_next = null, this._random_fn = this.random.bind(this), this.seed(e);
  }
  /**
   * Seeds this instance's PRNG.
   *
   * When called with a number, initializes the state deterministically from that value.
   * When called with no arguments (or `undefined`/`null`), seeds from OS entropy
   * via `crypto.getRandomValues`, matching Python's `random.seed()` behavior.
   *
   * @param {number} [n] The seed value. Omit to seed from OS entropy.
   */
  seed(e) {
    if (e == null)
      if (me.IS_CRYPTO_AVAILABLE) {
        let o = new Uint32Array(1);
        crypto.getRandomValues(o), e = o[0];
      } else
        e = Date.now() >>> 0;
    let t = this._mt, r = (o, i) => Math.imul(o, i) >>> 0, n = [];
    for (let o = e || 0; o > 0; o = Math.floor(o / 4294967296)) n.push(o & 4294967295);
    n.length || n.push(0), t[0] = 19650218;
    for (let o = 1; o < 624; ++o) t[o] = r(1812433253, t[o - 1] ^ t[o - 1] >>> 30) + o >>> 0;
    let s = 1, a = 0;
    for (let o = Math.max(624, n.length); o > 0; --o, ++s, ++a)
      s >= 624 && (t[0] = t[623], s = 1), a >= n.length && (a = 0), t[s] = (t[s] ^ r(t[s - 1] ^ t[s - 1] >>> 30, 1664525)) + n[a] + a >>> 0;
    for (let o = 623; o > 0; --o, ++s)
      s >= 624 && (t[0] = t[623], s = 1), t[s] = (t[s] ^ r(t[s - 1] ^ t[s - 1] >>> 30, 1566083941)) - s >>> 0;
    t[0] = 2147483648, this._idx = 624, this._gauss_next = null;
  }
  /**
   * Generates a random unsigned 32-bit integer.
   *
   * Performs the "twist" step when the state buffer is exhausted,
   * then applies the standard MT19937 tempering transform.
   *
   * @returns {number} A random integer in the range [0, 2^32 - 1].
   * @internal
   */
  _int32() {
    let e = this._mt;
    if (this._idx >= 624) {
      for (let r = 0; r < 624; ++r) {
        let n = e[r] & 2147483648 | e[(r + 1) % 624] & 2147483647;
        e[r] = (e[(r + 397) % 624] ^ n >>> 1 ^ (n & 1 ? 2567483615 : 0)) >>> 0;
      }
      this._idx = 0;
    }
    let t = e[this._idx++];
    return t ^= t >>> 11, t ^= t << 7 & 2636928640, t ^= t << 15 & 4022730752, t ^= t >>> 18, t >>> 0;
  }
  /**
   * Generates a random floating-point number in the half-open interval [0, 1).
   *
   * Combines two 32-bit integers (using 53 bits of precision) to produce
   * a uniformly distributed double, matching Python's `random.random()`.
   *
   * @returns {number} A random float in [0, 1).
   */
  random() {
    return ((this._int32() >>> 5) * 67108864 + (this._int32() >>> 6)) / 9007199254740992;
  }
  /**
   * Generates a random number from a Gaussian (normal) distribution.
   *
   * Uses the Box-Muller transform with a cached spare value,
   * matching Python's `random.gauss()` output for the same seed.
   *
   * @param {number} [mu=0] The mean of the distribution.
   * @param {number} [sigma=1] The standard deviation of the distribution.
   * @returns {number} A normally distributed random value.
   */
  gauss(e = 0, t = 1) {
    let r = this._gauss_next;
    if (this._gauss_next = null, r === null) {
      let n = this.random() * 2 * Math.PI, s = Math.sqrt(-2 * Math.log(1 - this.random()));
      r = Math.cos(n) * s, this._gauss_next = Math.sin(n) * s;
    }
    return e + r * t;
  }
  /**
   * Shuffles an array in-place using the Fisher-Yates algorithm.
   *
   * Uses rejection sampling via `getrandbits`-style bit masking to ensure
   * a uniform distribution, matching Python's `random.shuffle()`.
   *
   * @param {any[]} arr The array to shuffle in-place.
   */
  shuffle(e) {
    for (let t = e.length - 1; t > 0; --t) {
      let r = 32 - Math.clz32(t + 1), n = this._int32() >>> 32 - r;
      for (; n > t; ) n = this._int32() >>> 32 - r;
      let s = e[t];
      e[t] = e[n], e[n] = s;
    }
  }
  /**
   * Selects a single element from a weighted population.
   *
   * Matches Python's `random.choices(population, weights=weights, k=1)[0]`
   *
   * @param {any[]} population The array of items to choose from.
   * @param {number[]} weights An array of non-negative weights, one per population element.
   * @returns {*} A single randomly selected element from the population.
   */
  choices(e, t) {
    return e[lm(this._random_fn, t)];
  }
};
function lm(e, t) {
  let r = 0;
  for (let s = 0; s < t.length; ++s) r += t[s];
  let n = e() * r;
  for (let s = 0; s < t.length; ++s)
    if (n -= t[s], n < 0) return s;
  return t.length - 1;
}
var Yt = new Aa(), rl = Object.freeze({
  Random: Aa,
  seed: Yt.seed.bind(Yt),
  random: Yt.random.bind(Yt),
  gauss: Yt.gauss.bind(Yt),
  shuffle: Yt.shuffle.bind(Yt),
  choices: Yt.choices.bind(Yt)
}), uT = (e) => lm(rl.random, e), dT = new Aa(), cm = class {
  /**
   * Instantiate a `FileCache` object.
   * @param {string} path
   */
  constructor(e) {
    this.path = e;
  }
  /**
   * Checks whether the given request is in the cache.
   * @param {string} request
   * @returns {Promise<FileResponse | undefined>}
   */
  async match(e) {
    let t = Zt.join(this.path, e), r = new ga(t);
    if (r.exists)
      return r;
  }
  /**
   * Adds the given response to the cache.
   * @param {string} request
   * @param {Response} response
   * @param {(data: {progress: number, loaded: number, total: number}) => void} [progress_callback] Optional.
   * The function to call with progress updates
   * @returns {Promise<void>}
   */
  async put(e, t, r = void 0) {
    let n = Zt.join(this.path, e), s = me.IS_PROCESS_AVAILABLE ? process.pid : Date.now(), a = dT._int32().toString(36), o = n + `.tmp.${s}.${a}`;
    try {
      let i = t.headers.get("Content-Length"), l = parseInt(i ?? "0"), c = 0;
      await xt.promises.mkdir(Zt.dirname(n), { recursive: !0 });
      let d = xt.createWriteStream(o), h = t.body.getReader();
      for (; ; ) {
        let { done: _, value: p } = await h.read();
        if (_)
          break;
        await new Promise((v, y) => {
          d.write(p, (b) => {
            if (b) {
              y(b);
              return;
            }
            v();
          });
        }), c += p.length;
        let w = l ? c / l * 100 : 0;
        r?.({ progress: w, loaded: c, total: l });
      }
      await new Promise((_, p) => {
        d.close((w) => w ? p(w) : _());
      }), await xt.promises.rename(o, n);
    } catch (i) {
      try {
        await xt.promises.unlink(o);
      } catch {
      }
      throw i;
    }
  }
  /**
   * Deletes the cache entry for the given request.
   * @param {string} request
   * @returns {Promise<boolean>} A Promise that resolves to `true` if the cache entry was deleted, `false` otherwise.
   */
  async delete(e) {
    let t = Zt.join(this.path, e);
    try {
      return await xt.promises.unlink(t), !0;
    } catch {
      return !1;
    }
  }
  // TODO add the rest?
  // addAll(requests: RequestInfo[]): Promise<void>;
  // keys(request?: RequestInfo | URL, options?: CacheQueryOptions): Promise<ReadonlyArray<Request>>;
  // match(request: RequestInfo | URL, options?: CacheQueryOptions): Promise<Response | undefined>;
  // matchAll(request?: RequestInfo | URL, options?: CacheQueryOptions): Promise<ReadonlyArray<Response>>;
}, hT = {
  // 4xx errors (https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#client_error_responses)
  400: "Bad request error occurred while trying to load file",
  401: "Unauthorized access to file",
  403: "Forbidden access to file",
  404: "Could not locate file",
  408: "Request timeout error occurred while trying to load file",
  // 5xx errors (https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#server_error_responses)
  500: "Internal server error error occurred while trying to load file",
  502: "Bad gateway error occurred while trying to load file",
  503: "Service unavailable error occurred while trying to load file",
  504: "Gateway timeout error occurred while trying to load file"
}, np = 100, fT = /^(\b[\w\-.]+\b\/)?\b[\w\-.]{1,96}\b$/;
function Ks(...e) {
  return e = e.map((t, r) => (r && (t = t.replace(new RegExp("^/"), "")), r !== e.length - 1 && (t = t.replace(new RegExp("/$"), "")), t)), e.join("/");
}
function rn(e, t = null, r = null) {
  let n;
  try {
    n = new URL(e);
  } catch {
    return !1;
  }
  return !(t && !t.includes(n.protocol) || r && !r.includes(n.hostname));
}
function _T(e) {
  return !(!fT.test(e) || e.includes("..") || e.includes("--") || e.endsWith(".git") || e.endsWith(".ipynb"));
}
function nl(e, t = {}, ...r) {
  return JSON.stringify([
    e,
    t.revision ?? "main",
    t.cache_dir ?? null,
    t.local_files_only ?? !1,
    ...r
  ]);
}
var Ni = class extends Error {
  /**
   * @param {string} message The error message.
   * @param {Object} [options] Additional error information.
   * @param {number|null} [options.status=null] The HTTP status code, when the failure came from a Hub response.
   */
  constructor(e, { status: t = null } = {}) {
    super(e), this.name = "ModelFileNotFoundError", this.status = t;
  }
}, pT = /* @__PURE__ */ new Set([401, 403, 404]);
function um(e, t, r) {
  if (!r)
    return null;
  let s = `${hT[e] ?? `Error (${e}) occurred while trying to load file`}: "${t}".`;
  throw pT.has(e) ? new Ni(s, { status: e }) : Error(s);
}
async function mT(e, t, r) {
  let n = e.headers.get("Content-Length"), s = n ? parseInt(n, 10) : r ?? 0;
  n === null && !r && le.warn("Unable to determine content-length from response headers. Will expand buffer when needed.");
  let a = new Uint8Array(s), o = 0, i = e.body.getReader();
  async function l() {
    let { done: c, value: d } = await i.read();
    if (c) return;
    let h = o + d.length;
    if (h > s) {
      s = h;
      let p = new Uint8Array(s);
      p.set(a), a = p;
    }
    a.set(d, o), o = h;
    let _ = o / s * 100;
    return t({ progress: _, loaded: o, total: s }), l();
  }
  return await l(), a;
}
function sp(e) {
  return rn(e, ["blob:"]);
}
function Di(e, { allowUnresolved: t = !1 } = {}) {
  let r;
  if (typeof location < "u" && location.href)
    r = location.href;
  else if (typeof import.meta < "u" && import.meta.url)
    r = import.meta.url;
  else
    return e;
  try {
    return new URL(e, r).href;
  } catch (n) {
    if (!t)
      throw n;
    return e;
  }
}
var dm = "SHA-256", gT = "experimental_transformers-hash-cache", ap = (e) => ({ algorithm: dm, value: e }), op = class {
  /** @type {Promise<Cache> | null} */
  #t = null;
  /**
   * Returns (and lazily opens) the hash cache, reusing the same promise across concurrent callers.
   * @returns {Promise<Cache>}
   */
  _getHashCache = () => (this.#t ??= caches.open(gT), this.#t);
  /**
   * Returns whether the `navigator.crossOriginStorage` API is available in the current environment.
   * @returns {boolean}
   */
  static isAvailable = () => typeof navigator < "u" && "crossOriginStorage" in navigator;
  /**
   * Looks up a cached response for the given URL by resolving its SHA-256 hash and requesting
   * the corresponding file handle from cross-origin storage.
   *
   * Implements `CacheInterface.match`.
   *
   * @param {string} request The URL of the resource to look up.
   * @returns {Promise<Response|undefined>} The cached `Response`, or `undefined` if not found.
   */
  match = async (e) => {
    let t = await this._getFileHash(e);
    if (t)
      try {
        let n = await (await navigator.crossOriginStorage.requestFileHandle(ap(t))).getFile();
        return new Response(n, {
          headers: {
            "Content-Length": String(n.size)
          }
        });
      } catch {
        return;
      }
  };
  /**
   * Stores a response in cross-origin storage, keyed by its SHA-256 hash.
   *
   * For LFS-backed URLs the hash is resolved cheaply via `_getFileHash` (which checks
   * `HASH_CACHE_NAME` first, then falls back to fetching the Git LFS pointer file)
   * without reading the response body a second time.
   *
   * For non-LFS resources the hash is unknown upfront.  In that case the body is consumed
   * in the background: the stream is read to compute the content hash, the file is written
   * into cross-origin storage, and the computed hash is persisted to `HASH_CACHE_NAME`
   * so that future `match` calls can resolve the file without a network round-trip.
   *
   * Implements `CacheInterface.put`.
   *
   * @param {string} request The URL of the resource (used as the hash-cache key).
   * @param {Response} response The response whose body will be written to the cache.
   * @returns {Promise<void>}
   */
  put = async (e, t) => {
    let r = await this._getFileHash(e);
    if (r) {
      let n = await t.blob();
      await this._storeBlobInCOS(n, r);
    } else
      this._processAndStore(e, t.body);
  };
  /**
   * Writes a blob into cross-origin storage using the given pre-computed hex hash string.
   *
   * @param {Blob} blob
   * @param {string} hashHex Hex-encoded SHA-256 hash of `blob`.
   * @returns {Promise<void>}
   */
  _storeBlobInCOS = async (e, t) => {
    let n = await (await navigator.crossOriginStorage.requestFileHandle(ap(t), {
      create: !0,
      origins: "*"
    })).createWritable();
    await n.write(e), await n.close();
  };
  /**
   * Background task for non-LFS resources: consumes `stream`, computes the SHA-256 hash
   * of the resulting blob, stores it in cross-origin storage, and persists the computed
   * hash to `HASH_CACHE_NAME` keyed by `request` so future `match` calls can resolve the
   * file without a network round-trip.
   *
   * Called fire-and-forget from `put` — errors are swallowed so failures never surface to
   * the caller.
   *
   * @param {string} request The original resource URL.
   * @param {ReadableStream} stream The response body stream to consume.
   * @returns {Promise<void>}
   */
  _processAndStore = async (e, t) => {
    try {
      let r = [];
      for await (let a of t)
        r.push(a);
      let n = new Blob(r), s = await this._getBlobHash(n);
      await this._storeBlobInCOS(n, s);
      try {
        await (await this._getHashCache()).put(e, new Response(s));
      } catch {
      }
    } catch {
    }
  };
  /**
   * Deletes the cache entry for the given request.
   *
   * Removes the hash entry from `HASH_CACHE_NAME`. Note: cross-origin storage itself does not
   * expose a delete API, so only the local hash mapping is removed. For non-LFS URLs this
   * permanently prevents `match` from resolving the file. For LFS-backed URLs, `match` will
   * re-fetch the LFS pointer file on the next call and repopulate the hash cache automatically.
   *
   * Implements `CacheInterface.delete`.
   *
   * @param {string} request
   * @returns {Promise<boolean>} Resolves to `true` if the hash entry was deleted, `false` otherwise.
   */
  delete = async (e) => {
    try {
      return await (await this._getHashCache()).delete(e);
    } catch {
      return !1;
    }
  };
  /**
   * Resolves the SHA-256 hash for a given URL.
   *
   * Returns the cached hash immediately if one has been persisted to `HASH_CACHE_NAME`.
   * Otherwise falls back to `_getLfsFileHash` to retrieve the hash from the Hugging Face
   * LFS pointer file, persisting the result to `HASH_CACHE_NAME` for future lookups.
   *
   * Returns `null` if the hash cannot be determined (e.g. non-LFS URL with no cached entry).
   *
   * @param {string} url The resource URL to resolve a hash for.
   * @returns {Promise<string|null>} The hex-encoded SHA-256 hash, or `null` if unavailable.
   */
  _getFileHash = async (e) => {
    try {
      let t = await this._getHashCache(), r = await t.match(e);
      if (r)
        return r.text();
      let n = await this._getLfsFileHash(e);
      return n ? (await t.put(e, new Response(n)), n) : null;
    } catch {
      return null;
    }
  };
  /**
   * Attempts to retrieve the SHA-256 hash for a Hugging Face resource URL from its raw
   * Git LFS pointer file.
   *
   * Only applicable to URLs containing `/resolve/` (i.e. Hugging Face resolved file URLs).
   * The `/resolve/` segment is rewritten to `/raw/` to fetch the LFS pointer directly.
   * Returns `null` for non-LFS URLs or when the network request fails.
   *
   * @see https://huggingface.co/docs/hub/en/storage-backends#xet
   * @param {string} url The resolved Hugging Face URL of the resource.
   * @returns {Promise<string|null>} The hex-encoded SHA-256 hash, or `null` if unavailable.
   */
  _getLfsFileHash = async (e) => {
    if (!e.includes("/resolve/"))
      return null;
    let t = e.replace("/resolve/", "/raw/");
    try {
      let n = (await fetch(t).then((s) => s.text())).match(/^oid sha256:([0-9a-f]+)$/m);
      return n ? n[1] : null;
    } catch {
      return null;
    }
  };
  /**
   * Computes the SHA-256 hash of a `Blob`'s contents.
   *
   * @param {Blob} blob The blob to hash.
   * @returns {Promise<string>} The lowercase hex-encoded SHA-256 hash.
   */
  _getBlobHash = async (e) => {
    let t = await e.arrayBuffer(), r = await crypto.subtle.digest(dm, t);
    return Array.from(new Uint8Array(r)).map((s) => s.toString(16).padStart(2, "0")).join("");
  };
};
async function sl(e = null) {
  let t = null;
  if (ge.useCustomCache) {
    if (!ge.customCache)
      throw Error("`env.useCustomCache=true`, but `env.customCache` is not defined.");
    if (!ge.customCache.match || !ge.customCache.put)
      throw new Error(
        "`env.customCache` must be an object which implements the `match` and `put` functions of the Web Cache API. For more information, see https://developer.mozilla.org/en-US/docs/Web/API/Cache"
      );
    t = ge.customCache;
  }
  if (!t && ge.experimental_useCrossOriginStorage && op.isAvailable() && (t = new op()), !t && ge.useBrowserCache) {
    if (typeof caches > "u")
      throw Error("Browser cache is not available in this environment.");
    try {
      t = await caches.open(ge.cacheKey);
    } catch (r) {
      le.warn("An error occurred while opening the browser cache:", r);
    }
  }
  if (!t && ge.useFSCache) {
    if (!me.IS_FS_AVAILABLE)
      throw Error("File System Cache is not available in this environment.");
    t = new cm(e ?? ge.cacheDir);
  }
  return t;
}
async function wT(e, ...t) {
  for (let r of t)
    try {
      let n = await e.match(r);
      if (n) return n;
    } catch {
      continue;
    }
}
var vT = class {
  /** @type {number} */
  #t;
  /** @type {Map<any, any>} */
  #e;
  /**
   * Creates an LRUCache instance.
   * @param {number} capacity The maximum number of items the cache can hold.
   */
  constructor(e) {
    this.#t = e, this.#e = /* @__PURE__ */ new Map();
  }
  /**
   * Retrieves the value associated with the given key and marks the key as recently used.
   * @param {any} key The key to retrieve.
   * @returns {any} The value associated with the key, or undefined if the key does not exist.
   */
  get(e) {
    if (!this.#e.has(e)) return;
    let t = this.#e.get(e);
    return this.#e.delete(e), this.#e.set(e, t), t;
  }
  /**
   * Inserts or updates the key-value pair in the cache.
   * If the key already exists, it is updated and marked as recently used.
   * If the cache exceeds its capacity, the least recently used item is evicted.
   * @param {any} key The key to add or update.
   * @param {any} value The value to associate with the key.
   */
  put(e, t) {
    this.#e.has(e) && this.#e.delete(e), this.#e.set(e, t), this.#e.size > this.#t && this.#e.delete(this.#e.keys().next().value);
  }
  /**
   * Removes the entry for the given key from the cache.
   * @param {any} key The key to delete.
   * @returns {boolean} `true` if the entry existed and was removed, `false` otherwise.
   */
  delete(e) {
    return this.#e.delete(e);
  }
  /**
   * Clears the cache.
   */
  clear() {
    this.#e.clear();
  }
}, yT = 100, bi = new vT(yT);
function hm(e, t) {
  let r = bi.get(e);
  if (r !== void 0)
    return r;
  let n = t().then(
    (s) => s,
    (s) => (bi.delete(e), Promise.reject(s))
  );
  return bi.put(e, n), n;
}
async function bT(e) {
  if (!rn(e, ["http:", "https:"]))
    return null;
  let t = fm(e);
  return t.set("Range", "bytes=0-0"), ge.fetch(e, { method: "GET", headers: t, cache: "no-store" });
}
function ms(e, t, r = {}) {
  let n = nl(e, r, t);
  return hm(n, () => MT(e, t, r));
}
async function MT(e, t, r) {
  let n = await sl(r?.cache_dir), { localPath: s, remoteURL: a, proposedCacheKey: o, validModelId: i } = _m(
    e,
    t,
    r,
    n
  ), l = await pm(n, s, o);
  if (l !== void 0 && typeof l != "string") {
    let c = l.headers.get("content-length"), d = l.headers.get("content-type");
    return {
      exists: !0,
      size: c ? parseInt(c, 10) : void 0,
      contentType: d || void 0,
      fromCache: !0
    };
  }
  if (ge.allowLocalModels && !rn(s, ["http:", "https:"]))
    try {
      let d = await cs(s);
      if (typeof d != "string" && d.status !== 404) {
        let h = d.headers.get("content-length"), _ = d.headers.get("content-type");
        return {
          exists: !0,
          size: h ? parseInt(h, 10) : void 0,
          contentType: _ || void 0,
          fromCache: !1
        };
      }
    } catch {
    }
  if (ge.allowRemoteModels && !r.local_files_only && i) {
    let c = await bT(a);
    if (c && c.status >= 200 && c.status < 300) {
      let d, h = c.headers.get("content-type");
      if (c.status === 206) {
        let _ = c.headers.get("content-range");
        if (_) {
          let p = _.match(/bytes \d+-\d+\/(\d+)/);
          p && (d = parseInt(p[1], 10));
        }
      } else if (c.status === 200)
        try {
          await c.body?.cancel();
        } catch {
        }
      if (d === void 0) {
        let _ = c.headers.get("content-length");
        d = _ ? parseInt(_, 10) : void 0;
      }
      return {
        exists: !0,
        size: d,
        contentType: h || void 0,
        fromCache: !1
      };
    }
    c && c.status !== 404 && c.status !== 416 && um(c.status, a, !0);
  }
  return { exists: !1, fromCache: !1 };
}
async function cs(e) {
  return ge.useFS && !rn(e, ["http:", "https:", "blob:"]) ? new ga(
    e instanceof URL ? e.protocol === "file:" ? e.pathname : e.toString() : e
  ) : ge.fetch(e, {
    headers: fm(e)
  });
}
function fm(e) {
  let t = typeof process < "u" && process?.release?.name === "node", r = new Headers();
  if (t) {
    let n = !!process.env?.TESTING_REMOTELY, s = ge.version;
    if (r.set("User-Agent", `transformers.js/${s}; is_ci/${n};`), rn(e, ["http:", "https:"], ["huggingface.co", "hf.co"])) {
      let o = process.env?.HF_TOKEN ?? process.env?.HF_ACCESS_TOKEN;
      o && r.set("Authorization", `Bearer ${o}`);
    }
  }
  return r;
}
function _m(e, t, r = {}, n = null) {
  let s = r.revision ?? "main", a = Ks(e, t), o = _T(e), i = o ? Ks(ge.localModelPath, a) : a, l = Ks(
    ge.remoteHost,
    ge.remotePathTemplate.replaceAll("{model}", e).replaceAll("{revision}", encodeURIComponent(s)),
    t
  ), c = n instanceof cm ? (
    // Choose cache key for filesystem cache
    // When using the main revision (default), we use the request URL as the cache key.
    // If a specific revision is requested, we account for this in the cache key.
    s === "main" ? a : Ks(e, s, t)
  ) : l;
  return {
    requestURL: a,
    localPath: i,
    remoteURL: l,
    proposedCacheKey: c,
    validModelId: o
  };
}
async function pm(e, t, r) {
  if (e)
    return await wT(e, t, r);
}
async function xT(e, t, r, n, s, a, o = {}) {
  if (await r.match(n) === void 0 && !(typeof Cache < "u" && r instanceof Cache && !rn(Di(n, { allowUnresolved: !0 }), ["http:", "https:"])))
    if (a) {
      if (typeof s != "string") {
        let i = new Headers(s.headers);
        i.set("content-length", a.byteLength.toString()), await r.put(
          n,
          new Response(
            /** @type {any} */
            a,
            {
              headers: i
            }
          )
        ).catch((l) => {
          le.warn(`Unable to add response to browser cache: ${l}.`);
        });
      }
    } else {
      let i = o.progress_callback ? (l) => Sr(o.progress_callback, {
        status: "progress",
        name: e,
        file: t,
        ...l
      }) : void 0;
      await r.put(
        n,
        /** @type {Response} */
        s,
        i
      );
    }
}
async function kT(e, t, r = !0, n = {}, s = !1, a = null) {
  let { requestURL: o, localPath: i, remoteURL: l, proposedCacheKey: c, validModelId: d } = _m(
    e,
    t,
    n,
    a
  ), h, _ = !1, p;
  p = await pm(a, i, c);
  let w = p !== void 0;
  if (w)
    h = c;
  else {
    if (ge.allowLocalModels)
      if (rn(o, ["http:", "https:"])) {
        if (n.local_files_only)
          throw new Error(`\`local_files_only=true\`, but attempted to load a remote file from: ${o}.`);
        if (!ge.allowRemoteModels)
          throw new Error(
            `\`env.allowRemoteModels=false\`, but attempted to load a remote file from: ${o}.`
          );
      } else try {
        p = await cs(i), h = i;
      } catch (k) {
        le.warn(`Unable to load from local path "${i}": "${k}"`);
      }
    if (p === void 0 || typeof p != "string" && p.status === 404) {
      if (n.local_files_only || !ge.allowRemoteModels) {
        if (r)
          throw new Ni(
            `\`local_files_only=true\` or \`env.allowRemoteModels=false\` and file was not found locally at "${i}".`
          );
        return null;
      }
      if (!d)
        throw new Ni(
          `Local file missing at "${i}" and download aborted due to invalid model ID "${e}".`
        );
      if (p = await cs(l), p.status !== 200)
        return um(p.status, l, r);
      h = c;
    }
    _ = a && // 1. A caching system is available
    typeof Response < "u" && // 2. `Response` is defined (i.e., we are in a browser-like environment)
    p instanceof Response && // 3. result is a `Response` object (i.e., not a `FileResponse`)
    p.status === 200;
  }
  Sr(n.progress_callback, {
    status: "download",
    name: e,
    file: t
  });
  let v;
  if (!(me.IS_NODE_ENV && s)) {
    let b;
    if (typeof p != "string")
      if (!n.progress_callback)
        b = new Uint8Array(await p.arrayBuffer());
      else if (w && // The item is being read from the cache
      typeof navigator < "u" && /firefox/i.test(navigator.userAgent))
        b = new Uint8Array(await p.arrayBuffer()), Sr(n.progress_callback, {
          status: "progress",
          name: e,
          file: t,
          progress: 100,
          loaded: b.length,
          total: b.length
        });
      else {
        let k, A = p.headers.get("content-length");
        if (A)
          k = parseInt(A, 10);
        else
          try {
            let E = await ms(e, t, n);
            E.size && (k = E.size);
          } catch {
          }
        b = await mT(
          p,
          (E) => {
            Sr(n.progress_callback, {
              status: "progress",
              name: e,
              file: t,
              ...E
            });
          },
          k
        );
      }
    v = b;
  }
  if (
    // Only cache web responses
    // i.e., do not cache FileResponses (prevents duplication)
    _ && h && typeof p != "string" && await xT(e, t, a, h, p, v, n), me.IS_NODE_ENV && s && n.progress_callback && typeof p != "string"
  ) {
    let b = parseInt(p.headers.get("content-length"), 10) || 0;
    Sr(n.progress_callback, {
      status: "progress",
      name: e,
      file: t,
      progress: 100,
      loaded: b,
      total: b
    });
  }
  if (Sr(n.progress_callback, {
    status: "done",
    name: e,
    file: t
  }), v) {
    if (!me.IS_NODE_ENV && s)
      throw new Error("Cannot return path in a browser environment.");
    return v;
  }
  if (p instanceof ga)
    return p.filePath;
  let y = await a?.match(h);
  if (y instanceof ga)
    return y.filePath;
  if (y instanceof Response)
    return new Uint8Array(await y.arrayBuffer());
  if (typeof y == "string")
    return y;
  throw new Error("Unable to get model file path or buffer.");
}
var Mi = /* @__PURE__ */ new Map();
async function wa(e, t, r = !0, n = {}, s = !1) {
  if (!ge.allowLocalModels) {
    if (n.local_files_only)
      throw Error(
        "Invalid configuration detected: local models are disabled (`env.allowLocalModels=false`) but you have requested to only use local models (`local_files_only=true`)."
      );
    if (!ge.allowRemoteModels)
      throw Error(
        "Invalid configuration detected: both local and remote models are disabled. Fix by setting `env.allowLocalModels` or `env.allowRemoteModels` to `true`."
      );
  }
  let a = nl(e, n, t, r, s), { progress_callback: o } = n, i = o instanceof ca ? o.loads : Mi, l = i.get(a);
  return l || (Sr(o, {
    status: "initiate",
    name: e,
    file: t
  }), l = sl(n.cache_dir).then(
    (c) => kT(e, t, r, n, s, c)
  ), i === Mi && (l = l.finally(() => Mi.delete(a))), i.set(a, l)), await l;
}
async function al(e, t, r = !0, n = {}) {
  let s = await wa(e, t, r, n, !1);
  return s === null ? null : new TextDecoder("utf-8").decode(
    /** @type {Uint8Array} */
    s
  );
}
async function sr(e, t, r = !0, n = {}) {
  let s = await al(e, t, r, n);
  return s === null ? {} : JSON.parse(s);
}
function TT(e, [t, r, n], [s, a], o = "bilinear", i = !1) {
  let l = a / n, c = s / r, d = new e.constructor(s * a * t), h = r * n, _ = s * a;
  for (let p = 0; p < s; ++p)
    for (let w = 0; w < a; ++w) {
      let v = p * a + w, y = (w + 0.5) / l - 0.5, b = (p + 0.5) / c - 0.5, k = Math.floor(y), A = Math.floor(b), E = Math.min(k + 1, n - 1), C = Math.min(A + 1, r - 1);
      k = Math.max(k, 0), A = Math.max(A, 0);
      let N = y - k, M = b - A, $ = (1 - N) * (1 - M), R = N * (1 - M), W = (1 - N) * M, Q = N * M, H = A * n, q = C * n, B = H + k, P = H + E, X = q + k, ce = q + E;
      for (let J = 0; J < t; ++J) {
        let ne = J * h;
        d[J * _ + v] = $ * e[ne + B] + R * e[ne + P] + W * e[ne + X] + Q * e[ne + ce];
      }
    }
  return d;
}
function ET(e, t, r) {
  let n = new Array(r.length), s = new Array(r.length);
  for (let i = r.length - 1, l = 1; i >= 0; --i)
    s[i] = l, n[i] = t[r[i]], l *= n[i];
  let a = r.map((i, l) => s[r.indexOf(l)]), o = new e.constructor(e.length);
  for (let i = 0; i < e.length; ++i) {
    let l = 0;
    for (let c = t.length - 1, d = i; c >= 0; --c)
      l += d % t[c] * a[c], d = Math.floor(d / t[c]);
    o[l] = e[i];
  }
  return [o, n];
}
function at(e) {
  let t = qe(e)[0], r = e.map((a) => Math.exp(a - t)), n = r.reduce((a, o) => a + o, 0);
  return r.map((a) => a / n);
}
function AT(e) {
  let t = qe(e)[0], r = 0;
  for (let a = 0; a < e.length; ++a)
    r += Math.exp(e[a] - t);
  let n = Math.log(r);
  return e.map((a) => a - t - n);
}
function zi(e) {
  if (e.length === 0) throw Error("Array must not be empty");
  let t = e[0], r = 0;
  for (let n = 1; n < e.length; ++n)
    e[n] < t && (t = e[n], r = n);
  return (
    /** @type {T extends bigint[]|BigTypedArray ? [bigint, number] : [number, number]} */
    [t, r]
  );
}
function qe(e) {
  if (e.length === 0) throw Error("Array must not be empty");
  let t = e[0], r = 0;
  for (let n = 1; n < e.length; ++n)
    e[n] > t && (t = e[n], r = n);
  return (
    /** @type {T extends bigint[]|BigTypedArray ? [bigint, number] : [number, number]} */
    [t, r]
  );
}
function mm(e) {
  return e > 0 && (e & e - 1) === 0;
}
var gm = class {
  /**
   * @param {number} size The size of the input array. Must be a power of two larger than 1.
   * @throws {Error} FFT size must be a power of two larger than 1.
   */
  constructor(e) {
    if (this.size = e | 0, this.size <= 1 || !mm(this.size))
      throw new Error("FFT size must be a power of two larger than 1");
    this._csize = e << 1, this.table = new Float64Array(this.size * 2);
    for (let r = 0; r < this.table.length; r += 2) {
      let n = Math.PI * r / this.size;
      this.table[r] = Math.cos(n), this.table[r + 1] = -Math.sin(n);
    }
    let t = 0;
    for (let r = 1; this.size > r; r <<= 1) ++t;
    this._width = t % 2 === 0 ? t - 1 : t, this._bitrev = new Int32Array(1 << this._width);
    for (let r = 0; r < this._bitrev.length; ++r) {
      this._bitrev[r] = 0;
      for (let n = 0; n < this._width; n += 2) {
        let s = this._width - n - 2;
        this._bitrev[r] |= (r >>> n & 3) << s;
      }
    }
  }
  /**
   * Create a complex number array with size `2 * size`
   *
   * @returns {Float64Array} A complex number array with size `2 * size`
   */
  createComplexArray() {
    return new Float64Array(this._csize);
  }
  /**
   * Converts a complex number representation stored in a Float64Array to an array of real numbers.
   *
   * @param {Float64Array} complex The complex number representation to be converted.
   * @param {number[]} [storage] An optional array to store the result in.
   * @returns {number[]} An array of real numbers representing the input complex number representation.
   */
  fromComplexArray(e, t) {
    let r = t || new Array(e.length >>> 1);
    for (let n = 0; n < e.length; n += 2) r[n >>> 1] = e[n];
    return r;
  }
  /**
   * Convert a real-valued input array to a complex-valued output array.
   * @param {Float64Array} input The real-valued input array.
   * @param {Float64Array} [storage] Optional buffer to store the output array.
   * @returns {Float64Array} The complex-valued output array.
   */
  toComplexArray(e, t) {
    let r = t || this.createComplexArray();
    for (let n = 0; n < r.length; n += 2)
      r[n] = e[n >>> 1], r[n + 1] = 0;
    return r;
  }
  /**
   * Performs a Fast Fourier Transform (FFT) on the given input data and stores the result in the output buffer.
   *
   * @param {Float64Array} out The output buffer to store the result.
   * @param {Float64Array} data The input data to transform.
   *
   * @throws {Error} Input and output buffers must be different.
   *
   * @returns {void}
   */
  transform(e, t) {
    if (e === t) throw new Error("Input and output buffers must be different");
    this._transform4(
      e,
      t,
      1
      /* DONE */
    );
  }
  /**
   * Performs a real-valued forward FFT on the given input buffer and stores the result in the given output buffer.
   * The input buffer must contain real values only, while the output buffer will contain complex values. The input and
   * output buffers must be different.
   *
   * @param {Float64Array} out The output buffer.
   * @param {Float64Array} data The input buffer containing real values.
   *
   * @throws {Error} If the input and output buffers are the same.
   */
  realTransform(e, t) {
    if (e === t) throw new Error("Input and output buffers must be different");
    this._realTransform4(
      e,
      t,
      1
      /* DONE */
    );
  }
  /**
   * Performs an inverse FFT transformation on the given `data` array, and stores the result in `out`.
   * The `out` array must be a different buffer than the `data` array. The `out` array will contain the
   * result of the transformation. The `data` array will not be modified.
   *
   * @param {Float64Array} out The output buffer for the transformed data.
   * @param {Float64Array} data The input data to transform.
   * @throws {Error} If `out` and `data` refer to the same buffer.
   * @returns {void}
   */
  inverseTransform(e, t) {
    if (e === t) throw new Error("Input and output buffers must be different");
    this._transform4(
      e,
      t,
      -1
      /* DONE */
    );
    for (let r = 0; r < e.length; ++r) e[r] /= this.size;
  }
  /**
   * Performs a radix-4 implementation of a discrete Fourier transform on a given set of data.
   *
   * @param {Float64Array} out The output buffer for the transformed data.
   * @param {Float64Array} data The input buffer of data to be transformed.
   * @param {number} inv A scaling factor to apply to the transform.
   * @returns {void}
   */
  _transform4(e, t, r) {
    let n = this._csize, a = 1 << this._width, o = n / a << 1, i, l, c = this._bitrev;
    if (o === 4)
      for (i = 0, l = 0; i < n; i += o, ++l) {
        let h = c[l];
        this._singleTransform2(t, e, i, h, a);
      }
    else
      for (i = 0, l = 0; i < n; i += o, ++l) {
        let h = c[l];
        this._singleTransform4(t, e, i, h, a, r);
      }
    let d = this.table;
    for (a >>= 2; a >= 2; a >>= 2) {
      o = n / a << 1;
      let h = o >>> 2;
      for (i = 0; i < n; i += o) {
        let _ = i + h - 1;
        for (let p = i, w = 0; p < _; p += 2, w += a) {
          let v = p, y = v + h, b = y + h, k = b + h, A = e[v], E = e[v + 1], C = e[y], N = e[y + 1], M = e[b], $ = e[b + 1], R = e[k], W = e[k + 1], Q = d[w], H = r * d[w + 1], q = C * Q - N * H, B = C * H + N * Q, P = d[2 * w], X = r * d[2 * w + 1], ce = M * P - $ * X, J = M * X + $ * P, ne = d[3 * w], L = r * d[3 * w + 1], O = R * ne - W * L, G = R * L + W * ne, ue = A + ce, ee = E + J, We = A - ce, Pe = E - J, be = q + O, $e = B + G, Le = r * (q - O), ye = r * (B - G);
          e[v] = ue + be, e[v + 1] = ee + $e, e[y] = We + ye, e[y + 1] = Pe - Le, e[b] = ue - be, e[b + 1] = ee - $e, e[k] = We - ye, e[k + 1] = Pe + Le;
        }
      }
    }
  }
  /**
   * Performs a radix-2 implementation of a discrete Fourier transform on a given set of data.
   *
   * @param {Float64Array} data The input buffer of data to be transformed.
   * @param {Float64Array} out The output buffer for the transformed data.
   * @param {number} outOff The offset at which to write the output data.
   * @param {number} off The offset at which to begin reading the input data.
   * @param {number} step The step size for indexing the input data.
   * @returns {void}
   */
  _singleTransform2(e, t, r, n, s) {
    let a = e[n], o = e[n + 1], i = e[n + s], l = e[n + s + 1];
    t[r] = a + i, t[r + 1] = o + l, t[r + 2] = a - i, t[r + 3] = o - l;
  }
  /**
   * Performs radix-4 transformation on input data of length 8
   *
   * @param {Float64Array} data Input data array of length 8
   * @param {Float64Array} out Output data array of length 8
   * @param {number} outOff Index of output array to start writing from
   * @param {number} off Index of input array to start reading from
   * @param {number} step Step size between elements in input array
   * @param {number} inv Scaling factor for inverse transform
   *
   * @returns {void}
   */
  _singleTransform4(e, t, r, n, s, a) {
    let o = s * 2, i = s * 3, l = e[n], c = e[n + 1], d = e[n + s], h = e[n + s + 1], _ = e[n + o], p = e[n + o + 1], w = e[n + i], v = e[n + i + 1], y = l + _, b = c + p, k = l - _, A = c - p, E = d + w, C = h + v, N = a * (d - w), M = a * (h - v);
    t[r] = y + E, t[r + 1] = b + C, t[r + 2] = k + M, t[r + 3] = A - N, t[r + 4] = y - E, t[r + 5] = b - C, t[r + 6] = k - M, t[r + 7] = A + N;
  }
  /**
   * Real input radix-4 implementation
   * @param {Float64Array} out Output array for the transformed data
   * @param {Float64Array} data Input array of real data to be transformed
   * @param {number} inv The scale factor used to normalize the inverse transform
   */
  _realTransform4(e, t, r) {
    let n = this._csize, a = 1 << this._width, o = n / a << 1, i, l, c = this._bitrev;
    if (o === 4)
      for (i = 0, l = 0; i < n; i += o, ++l) {
        let _ = c[l];
        this._singleRealTransform2(t, e, i, _ >>> 1, a >>> 1);
      }
    else
      for (i = 0, l = 0; i < n; i += o, ++l) {
        let _ = c[l];
        this._singleRealTransform4(t, e, i, _ >>> 1, a >>> 1, r);
      }
    let d = this.table;
    for (a >>= 2; a >= 2; a >>= 2) {
      o = n / a << 1;
      let _ = o >>> 1, p = _ >>> 1, w = p >>> 1;
      for (i = 0; i < n; i += o)
        for (let v = 0, y = 0; v <= w; v += 2, y += a) {
          let b = i + v, k = b + p, A = k + p, E = A + p, C = e[b], N = e[b + 1], M = e[k], $ = e[k + 1], R = e[A], W = e[A + 1], Q = e[E], H = e[E + 1], q = C, B = N, P = d[y], X = r * d[y + 1], ce = M * P - $ * X, J = M * X + $ * P, ne = d[2 * y], L = r * d[2 * y + 1], O = R * ne - W * L, G = R * L + W * ne, ue = d[3 * y], ee = r * d[3 * y + 1], We = Q * ue - H * ee, Pe = Q * ee + H * ue, be = q + O, $e = B + G, Le = q - O, ye = B - G, Ye = ce + We, Wt = J + Pe, Me = r * (ce - We), Fe = r * (J - Pe);
          if (e[b] = be + Ye, e[b + 1] = $e + Wt, e[k] = Le + Fe, e[k + 1] = ye - Me, v === 0) {
            e[A] = be - Ye, e[A + 1] = $e - Wt;
            continue;
          }
          if (v === w) continue;
          let sn = i + p - v, Wn = i + _ - v;
          e[sn] = Le - r * Fe, e[sn + 1] = -ye - r * Me, e[Wn] = be - r * Ye, e[Wn + 1] = -$e + r * Wt;
        }
    }
    let h = n >>> 1;
    for (let _ = 2; _ < h; _ += 2)
      e[n - _] = e[_], e[n - _ + 1] = -e[_ + 1];
  }
  /**
   * Performs a single real input radix-2 transformation on the provided data
   *
   * @param {Float64Array} data The input data array
   * @param {Float64Array} out The output data array
   * @param {number} outOff The output offset
   * @param {number} off The input offset
   * @param {number} step The step
   *
   * @returns {void}
   */
  _singleRealTransform2(e, t, r, n, s) {
    let a = e[n], o = e[n + s];
    t[r] = a + o, t[r + 1] = 0, t[r + 2] = a - o, t[r + 3] = 0;
  }
  /**
   * Computes a single real-valued transform using radix-4 algorithm.
   * This method is only called for len=8.
   *
   * @param {Float64Array} data The input data array.
   * @param {Float64Array} out The output data array.
   * @param {number} outOff The offset into the output array.
   * @param {number} off The offset into the input array.
   * @param {number} step The step size for the input array.
   * @param {number} inv The value of inverse.
   */
  _singleRealTransform4(e, t, r, n, s, a) {
    let o = s * 2, i = s * 3, l = e[n], c = e[n + s], d = e[n + o], h = e[n + i], _ = l + d, p = l - d, w = c + h, v = a * (c - h);
    t[r] = _ + w, t[r + 1] = 0, t[r + 2] = p, t[r + 3] = -v, t[r + 4] = _ - w, t[r + 5] = 0, t[r + 6] = p, t[r + 7] = v;
  }
}, CT = class {
  /**
   * Constructs a new NP2FFT object.
   * @param {number} fft_length The length of the FFT
   */
  constructor(e) {
    let t = 2 * (e - 1), r = 2 * (2 * e - 1), n = 2 ** Math.ceil(Math.log2(r));
    this.bufferSize = n, this._a = t;
    let s = new Float64Array(r), a = new Float64Array(n);
    this._chirpBuffer = new Float64Array(n), this._buffer1 = new Float64Array(n), this._buffer2 = new Float64Array(n), this._outBuffer1 = new Float64Array(n), this._outBuffer2 = new Float64Array(n);
    let o = -2 * Math.PI / e, i = Math.cos(o), l = Math.sin(o);
    for (let c = 0; c < r >> 1; ++c) {
      let d = (c + 1 - e) ** 2 / 2, h = Math.sqrt(i ** 2 + l ** 2) ** d, _ = d * Math.atan2(l, i), p = 2 * c;
      s[p] = h * Math.cos(_), s[p + 1] = h * Math.sin(_), a[p] = s[p], a[p + 1] = -s[p + 1];
    }
    this._slicedChirpBuffer = s.subarray(t, r), this._f = new gm(n >> 1), this._f.transform(this._chirpBuffer, a);
  }
  _transform(e, t, r) {
    let n = this._buffer1, s = this._buffer2, a = this._outBuffer1, o = this._outBuffer2, i = this._chirpBuffer, l = this._slicedChirpBuffer, c = this._a;
    if (r)
      for (let d = 0; d < l.length; d += 2) {
        let h = d + 1, _ = d >> 1, p = t[_];
        n[d] = p * l[d], n[h] = p * l[h];
      }
    else
      for (let d = 0; d < l.length; d += 2) {
        let h = d + 1;
        n[d] = t[d] * l[d] - t[h] * l[h], n[h] = t[d] * l[h] + t[h] * l[d];
      }
    this._f.transform(a, n);
    for (let d = 0; d < i.length; d += 2) {
      let h = d + 1;
      s[d] = a[d] * i[d] - a[h] * i[h], s[h] = a[d] * i[h] + a[h] * i[d];
    }
    this._f.inverseTransform(o, s);
    for (let d = 0; d < o.length; d += 2) {
      let h = o[d + c], _ = o[d + c + 1], p = l[d], w = l[d + 1];
      e[d] = h * p - _ * w, e[d + 1] = h * w + _ * p;
    }
  }
  transform(e, t) {
    this._transform(e, t, !1);
  }
  realTransform(e, t) {
    this._transform(e, t, !0);
  }
}, ST = class {
  constructor(e) {
    this.fft_length = e, this.isPowerOfTwo = mm(e), this.isPowerOfTwo ? (this.fft = new gm(e), this.outputBufferSize = 2 * e) : (this.fft = new CT(e), this.outputBufferSize = this.fft.bufferSize);
  }
  realTransform(e, t) {
    this.fft.realTransform(e, t);
  }
  transform(e, t) {
    this.fft.transform(e, t);
  }
};
function PT(e, t) {
  if (t % 2 === 0 || t <= 0)
    throw new Error("Window size must be a positive odd number");
  let r = new e.constructor(e.length), n = new e.constructor(t), s = Math.floor(t / 2);
  for (let a = 0; a < e.length; ++a) {
    let o = 0;
    for (let i = -s; i <= s; ++i) {
      let l = a + i;
      l < 0 ? l = Math.abs(l) : l >= e.length && (l = 2 * (e.length - 1) - l), n[o++] = e[l];
    }
    n.sort(), r[a] = n[s];
  }
  return r;
}
function as(e, t) {
  let r = Math.pow(10, t);
  return Math.round(e * r) / r;
}
function FT(e) {
  let t = Math.round(e);
  return Math.abs(e) % 1 === 0.5 ? t % 2 === 0 ? t : t - 1 : t;
}
function IT(e) {
  let t = e.length, r = e[0].length, n = [t + 1, r + 1], s = Array.from({ length: n[0] }, () => Array(n[1]).fill(1 / 0));
  s[0][0] = 0;
  let a = Array.from({ length: n[0] }, () => Array(n[1]).fill(-1));
  for (let d = 1; d < n[1]; ++d)
    for (let h = 1; h < n[0]; ++h) {
      let _ = s[h - 1][d - 1], p = s[h - 1][d], w = s[h][d - 1], v, y;
      _ < p && _ < w ? (v = _, y = 0) : p < _ && p < w ? (v = p, y = 1) : (v = w, y = 2), s[h][d] = e[h - 1][d - 1] + v, a[h][d] = y;
    }
  for (let d = 0; d < n[1]; ++d)
    a[0][d] = 2;
  for (let d = 0; d < n[0]; ++d)
    a[d][0] = 1;
  let o = t, i = r, l = [], c = [];
  for (; o > 0 || i > 0; )
    switch (l.push(o - 1), c.push(i - 1), a[o][i]) {
      case 0:
        --o, --i;
        break;
      case 1:
        --o;
        break;
      case 2:
        --i;
        break;
      default:
        throw new Error(
          `Internal error in dynamic time warping. Unexpected trace[${o}, ${i}]. Please file a bug report.`
        );
    }
  return l.reverse(), c.reverse(), [l, c];
}
var LT = /* @__PURE__ */ (function() {
  let e = null;
  return function(t) {
    if (!e) {
      e = new Float32Array(65536);
      let a = new ArrayBuffer(4), o = new Uint32Array(a), i = new Float32Array(a);
      for (let l = 0; l < e.length; ++l) {
        let c = 0, d = (l & 32768) << 16, h = (l & 31744) >> 10, _ = l & 1023;
        if (h === 31)
          c = d | 2139095040 | _ << 13;
        else if (h === 0)
          if (_ === 0)
            c = d;
          else {
            let p = 113;
            for (; (_ & 1024) === 0; )
              _ <<= 1, --p;
            _ &= -1025, c = d | p << 23 | _ << 13;
          }
        else
          c = d | h + 112 << 23 | _ << 13;
        o[0] = c, e[l] = i[0];
      }
    }
    let r = t.length, n = e, s = new Float32Array(r);
    for (let a = 0; a < r; ++a)
      s[a] = n[t[a]];
    return s;
  };
})(), OT = {};
async function wm(e) {
  let t = e.split("/").pop(), r;
  try {
    if (r = await sl(), r) {
      let s = await r.match(e);
      if (s)
        return s;
    }
  } catch (s) {
    le.warn(`Failed to load ${t} from cache:`, s);
  }
  let n = await ge.fetch(e);
  if (!n.ok)
    throw new Error(`Failed to fetch ${t}: ${n.status} ${n.statusText}`);
  if (r)
    try {
      await r.put(e, n.clone());
    } catch (s) {
      le.warn(`Failed to cache ${t}:`, s);
    }
  return n;
}
async function NT(e) {
  let t = await wm(e);
  if (!t || typeof t == "string") return null;
  try {
    return await t.arrayBuffer();
  } catch (r) {
    return le.warn("Failed to read WASM binary:", r), null;
  }
}
async function DT(e) {
  if (me.IS_SERVICE_WORKER_ENV || me.IS_CHROME_AVAILABLE)
    return e;
  let t = await wm(e);
  if (!t || typeof t == "string") return null;
  try {
    let r = await t.text();
    r = r.replaceAll("globalThis.process?.versions?.node", "false");
    let n = new Blob([r], { type: "text/javascript" });
    return URL.createObjectURL(n);
  } catch (r) {
    return le.warn("Failed to read WASM factory:", r), null;
  }
}
var zT = Object.freeze({
  auto: null,
  // Auto-detect based on device and environment
  gpu: null,
  // Auto-detect GPU
  cpu: "cpu",
  // CPU
  wasm: "wasm",
  // WebAssembly
  webgpu: "webgpu",
  // WebGPU
  cuda: "cuda",
  // CUDA
  dml: "dml",
  // DirectML
  coreml: "coreml",
  // CoreML
  webnn: { name: "webnn", deviceType: "cpu" },
  // WebNN (default)
  "webnn-npu": { name: "webnn", deviceType: "npu" },
  // WebNN NPU
  "webnn-gpu": { name: "webnn", deviceType: "gpu" },
  // WebNN GPU
  "webnn-cpu": { name: "webnn", deviceType: "cpu" }
  // WebNN CPU
});
function vm(e) {
  return e <= Dt.DEBUG ? 0 : e <= Dt.INFO ? 2 : e <= Dt.WARNING || e <= Dt.ERROR ? 3 : 4;
}
var BT = {
  0: "verbose",
  1: "info",
  2: "warning",
  3: "error",
  4: "fatal"
}, St = [], Bi, kn, ip = /* @__PURE__ */ Symbol.for("onnxruntime");
if (ip in globalThis)
  kn = globalThis[ip];
else if (me.IS_NODE_ENV) {
  switch (kn = OT, process.platform) {
    case "win32":
      St.push("dml");
      break;
    case "linux":
      process.arch === "x64" && St.push("cuda");
      break;
    case "darwin":
      St.push("coreml");
      break;
  }
  St.push("webgpu"), St.push("cpu"), Bi = ["cpu"];
} else
  kn = pi, me.IS_WEBNN_AVAILABLE && St.push("webnn-npu", "webnn-gpu", "webnn-cpu", "webnn"), me.IS_WEBGPU_AVAILABLE && St.push("webgpu"), St.push("wasm"), Bi = ["wasm"];
var RT = kn.InferenceSession;
function $T(e = null) {
  if (!e) return Bi;
  switch (e) {
    case "auto":
      return St;
    case "gpu":
      return St.filter((t) => ["webgpu", "cuda", "dml", "webnn-gpu"].includes(t));
  }
  if (St.includes(e))
    return [zT[e] ?? e];
  throw new Error(`Unsupported device: "${e}". Should be one of: ${St.join(", ")}.`);
}
var lp = Promise.resolve(), mn = null;
async function GT() {
  if (mn)
    return mn;
  if (!(ge.useWasmCache && typeof Ke?.wasm?.wasmPaths == "object" && Ke?.wasm?.wasmPaths?.wasm && Ke?.wasm?.wasmPaths?.mjs)) {
    if (me.IS_DENO_WEB_RUNTIME)
      throw new Error(
        "env.useWasmCache=false is not supported in Deno's web runtime. Remove the useWasmCache override."
      );
    return mn = Promise.resolve(), mn;
  }
  return mn = (async () => {
    let t = (
      /** @type {{ wasm: string, mjs: string }} */
      Ke.wasm.wasmPaths
    ), r = !1;
    await Promise.all([
      // Load and cache the WASM binary
      t.wasm && !sp(t.wasm) ? (async () => {
        try {
          let n = await NT(Di(t.wasm));
          n && (Ke.wasm.wasmBinary = n, r = !0);
        } catch (n) {
          le.warn("Failed to pre-load WASM binary:", n);
        }
      })() : Promise.resolve(),
      // Load and cache the WASM factory as a blob URL
      t.mjs && !sp(t.mjs) ? (async () => {
        try {
          let n = await DT(Di(t.mjs));
          n && (Ke.wasm.wasmPaths.mjs = n);
        } catch (n) {
          le.warn("Failed to pre-load WASM factory:", n);
        }
      })() : Promise.resolve()
    ]), r || (Ke.wasm.wasmPaths.mjs = t.mjs);
  })(), mn;
}
async function ym(e, t, r) {
  await GT();
  let n = vm(ge.logLevel ?? Dt.WARNING), s = () => RT.create(e, {
    // Set default log severity level, but allow overriding through session options
    logSeverityLevel: n,
    ...t
  }), a = await (me.IS_WEB_ENV ? lp = lp.then(s) : s());
  return a.config = r, a;
}
var cp = Promise.resolve();
async function bm(e, t) {
  let r = () => e.run(t);
  return me.IS_WEB_ENV ? cp = cp.then(r) : r();
}
function Mm(e) {
  return e instanceof kn.Tensor;
}
var Ke = kn?.env;
function ol() {
  return Ke?.wasm?.proxy;
}
if (Ke) {
  let e = function(t) {
    let r = vm(t);
    Ke.logLevel = BT[r];
  };
  if (Ke.wasm) {
    if (
      // @ts-ignore Cannot find name 'ServiceWorkerGlobalScope'.ts(2304)
      !(typeof ServiceWorkerGlobalScope < "u" && self instanceof ServiceWorkerGlobalScope) && Ke.versions?.web && !Ke.wasm.wasmPaths
    ) {
      let t = `https://cdn.jsdelivr.net/npm/onnxruntime-web@${Ke.versions.web}/dist/`, r = ".asyncify";
      me.IS_SAFARI_BELOW_26 && !me.IS_WEBGPU_AVAILABLE && (r = ""), Ke.wasm.wasmPaths = {
        mjs: `${t}ort-wasm-simd-threaded${r}.mjs`,
        wasm: `${t}ort-wasm-simd-threaded${r}.wasm`
      };
    }
    Ke.wasm.proxy = !1;
  }
  Ke.webgpu && (Ke.webgpu.powerPreference = "high-performance"), e(ge.logLevel ?? Dt.WARNING), ge.backends.onnx = {
    ...Ke,
    setLogLevel: e
  };
}
var Er = async (e, t, r) => {
  let n = await ym(new Uint8Array(e), t);
  return (
    /** @type {any} */
    (async (s) => {
      let a = ol(), o = Object.fromEntries(
        Object.entries(s).map(([l, c]) => [l, (a ? c.clone() : c).ort_tensor])
      ), i = await bm(n, o);
      return Array.isArray(r) ? r.map((l) => new V(i[l])) : new V(i[
        /** @type {string} */
        r
      ]);
    })
  );
}, Tn = class {
  static session_options = {
    // TODO: Allow for multiple execution providers
    // executionProviders: ['webgpu'],
  };
  static get nearest_interpolate_4d() {
    return this._nearest_interpolate_4d || (this._nearest_interpolate_4d = Er(
      [
        8,
        10,
        18,
        0,
        58,
        129,
        1,
        10,
        41,
        10,
        1,
        120,
        10,
        0,
        10,
        0,
        10,
        1,
        115,
        18,
        1,
        121,
        34,
        6,
        82,
        101,
        115,
        105,
        122,
        101,
        42,
        18,
        10,
        4,
        109,
        111,
        100,
        101,
        34,
        7,
        110,
        101,
        97,
        114,
        101,
        115,
        116,
        160,
        1,
        3,
        18,
        1,
        114,
        90,
        31,
        10,
        1,
        120,
        18,
        26,
        10,
        24,
        8,
        1,
        18,
        20,
        10,
        3,
        18,
        1,
        98,
        10,
        3,
        18,
        1,
        99,
        10,
        3,
        18,
        1,
        104,
        10,
        3,
        18,
        1,
        119,
        90,
        15,
        10,
        1,
        115,
        18,
        10,
        10,
        8,
        8,
        7,
        18,
        4,
        10,
        2,
        8,
        4,
        98,
        31,
        10,
        1,
        121,
        18,
        26,
        10,
        24,
        8,
        1,
        18,
        20,
        10,
        3,
        18,
        1,
        98,
        10,
        3,
        18,
        1,
        99,
        10,
        3,
        18,
        1,
        104,
        10,
        3,
        18,
        1,
        119,
        66,
        2,
        16,
        21
      ],
      this.session_options,
      "y"
    )), this._nearest_interpolate_4d;
  }
  static get bilinear_interpolate_4d() {
    return this._bilinear_interpolate_4d || (this._bilinear_interpolate_4d = Er(
      [
        8,
        9,
        18,
        0,
        58,
        128,
        1,
        10,
        40,
        10,
        1,
        120,
        10,
        0,
        10,
        0,
        10,
        1,
        115,
        18,
        1,
        121,
        34,
        6,
        82,
        101,
        115,
        105,
        122,
        101,
        42,
        17,
        10,
        4,
        109,
        111,
        100,
        101,
        34,
        6,
        108,
        105,
        110,
        101,
        97,
        114,
        160,
        1,
        3,
        18,
        1,
        114,
        90,
        31,
        10,
        1,
        120,
        18,
        26,
        10,
        24,
        8,
        1,
        18,
        20,
        10,
        3,
        18,
        1,
        98,
        10,
        3,
        18,
        1,
        99,
        10,
        3,
        18,
        1,
        104,
        10,
        3,
        18,
        1,
        119,
        90,
        15,
        10,
        1,
        115,
        18,
        10,
        10,
        8,
        8,
        7,
        18,
        4,
        10,
        2,
        8,
        4,
        98,
        31,
        10,
        1,
        121,
        18,
        26,
        10,
        24,
        8,
        1,
        18,
        20,
        10,
        3,
        18,
        1,
        98,
        10,
        3,
        18,
        1,
        99,
        10,
        3,
        18,
        1,
        104,
        10,
        3,
        18,
        1,
        119,
        66,
        2,
        16,
        20
      ],
      this.session_options,
      "y"
    )), this._bilinear_interpolate_4d;
  }
  static get bicubic_interpolate_4d() {
    return this._bicubic_interpolate_4d || (this._bicubic_interpolate_4d = Er(
      [
        8,
        9,
        18,
        0,
        58,
        127,
        10,
        39,
        10,
        1,
        120,
        10,
        0,
        10,
        0,
        10,
        1,
        115,
        18,
        1,
        121,
        34,
        6,
        82,
        101,
        115,
        105,
        122,
        101,
        42,
        16,
        10,
        4,
        109,
        111,
        100,
        101,
        34,
        5,
        99,
        117,
        98,
        105,
        99,
        160,
        1,
        3,
        18,
        1,
        114,
        90,
        31,
        10,
        1,
        120,
        18,
        26,
        10,
        24,
        8,
        1,
        18,
        20,
        10,
        3,
        18,
        1,
        98,
        10,
        3,
        18,
        1,
        99,
        10,
        3,
        18,
        1,
        104,
        10,
        3,
        18,
        1,
        119,
        90,
        15,
        10,
        1,
        115,
        18,
        10,
        10,
        8,
        8,
        7,
        18,
        4,
        10,
        2,
        8,
        4,
        98,
        31,
        10,
        1,
        121,
        18,
        26,
        10,
        24,
        8,
        1,
        18,
        20,
        10,
        3,
        18,
        1,
        98,
        10,
        3,
        18,
        1,
        99,
        10,
        3,
        18,
        1,
        104,
        10,
        3,
        18,
        1,
        119,
        66,
        2,
        16,
        20
      ],
      this.session_options,
      "y"
    )), this._bicubic_interpolate_4d;
  }
  static get matmul() {
    return this._matmul || (this._matmul = Er(
      [
        8,
        9,
        18,
        0,
        58,
        55,
        10,
        17,
        10,
        1,
        97,
        10,
        1,
        98,
        18,
        1,
        99,
        34,
        6,
        77,
        97,
        116,
        77,
        117,
        108,
        18,
        1,
        114,
        90,
        9,
        10,
        1,
        97,
        18,
        4,
        10,
        2,
        8,
        1,
        90,
        9,
        10,
        1,
        98,
        18,
        4,
        10,
        2,
        8,
        1,
        98,
        9,
        10,
        1,
        99,
        18,
        4,
        10,
        2,
        8,
        1,
        66,
        2,
        16,
        20
      ],
      this.session_options,
      "c"
    )), this._matmul;
  }
  static get stft() {
    return this._stft || (this._stft = Er(
      [
        8,
        7,
        18,
        0,
        58,
        148,
        1,
        10,
        38,
        10,
        1,
        115,
        10,
        1,
        106,
        10,
        1,
        119,
        10,
        1,
        108,
        18,
        1,
        111,
        34,
        4,
        83,
        84,
        70,
        84,
        42,
        15,
        10,
        8,
        111,
        110,
        101,
        115,
        105,
        100,
        101,
        100,
        24,
        1,
        160,
        1,
        2,
        18,
        1,
        115,
        90,
        26,
        10,
        1,
        115,
        18,
        21,
        10,
        19,
        8,
        1,
        18,
        15,
        10,
        3,
        18,
        1,
        98,
        10,
        3,
        18,
        1,
        115,
        10,
        3,
        18,
        1,
        99,
        90,
        11,
        10,
        1,
        106,
        18,
        6,
        10,
        4,
        8,
        7,
        18,
        0,
        90,
        16,
        10,
        1,
        119,
        18,
        11,
        10,
        9,
        8,
        1,
        18,
        5,
        10,
        3,
        18,
        1,
        119,
        90,
        11,
        10,
        1,
        108,
        18,
        6,
        10,
        4,
        8,
        7,
        18,
        0,
        98,
        31,
        10,
        1,
        111,
        18,
        26,
        10,
        24,
        8,
        1,
        18,
        20,
        10,
        3,
        18,
        1,
        98,
        10,
        3,
        18,
        1,
        102,
        10,
        3,
        18,
        1,
        100,
        10,
        3,
        18,
        1,
        99,
        66,
        2,
        16,
        17
      ],
      this.session_options,
      "o"
    )), this._stft;
  }
  static get rfft() {
    return this._rfft || (this._rfft = Er(
      [
        8,
        9,
        58,
        93,
        10,
        33,
        10,
        1,
        120,
        10,
        0,
        10,
        1,
        97,
        18,
        1,
        121,
        34,
        3,
        68,
        70,
        84,
        42,
        15,
        10,
        8,
        111,
        110,
        101,
        115,
        105,
        100,
        101,
        100,
        24,
        1,
        160,
        1,
        2,
        18,
        1,
        100,
        90,
        19,
        10,
        1,
        120,
        18,
        14,
        10,
        12,
        8,
        1,
        18,
        8,
        10,
        0,
        10,
        0,
        10,
        2,
        8,
        1,
        90,
        11,
        10,
        1,
        97,
        18,
        6,
        10,
        4,
        8,
        7,
        18,
        0,
        98,
        19,
        10,
        1,
        121,
        18,
        14,
        10,
        12,
        8,
        1,
        18,
        8,
        10,
        0,
        10,
        0,
        10,
        2,
        8,
        2,
        66,
        2,
        16,
        20
      ],
      this.session_options,
      "y"
    )), this._rfft;
  }
  static get top_k() {
    return this._top_k || (this._top_k = Er(
      [
        8,
        10,
        18,
        0,
        58,
        73,
        10,
        18,
        10,
        1,
        120,
        10,
        1,
        107,
        18,
        1,
        118,
        18,
        1,
        105,
        34,
        4,
        84,
        111,
        112,
        75,
        18,
        1,
        116,
        90,
        9,
        10,
        1,
        120,
        18,
        4,
        10,
        2,
        8,
        1,
        90,
        15,
        10,
        1,
        107,
        18,
        10,
        10,
        8,
        8,
        7,
        18,
        4,
        10,
        2,
        8,
        1,
        98,
        9,
        10,
        1,
        118,
        18,
        4,
        10,
        2,
        8,
        1,
        98,
        9,
        10,
        1,
        105,
        18,
        4,
        10,
        2,
        8,
        7,
        66,
        2,
        16,
        21
      ],
      this.session_options,
      [
        /* Values */
        "v",
        /* Indices */
        "i"
      ]
    )), this._top_k;
  }
  static get slice() {
    return this._slice || (this._slice = Er(
      [
        8,
        7,
        18,
        0,
        58,
        96,
        10,
        25,
        10,
        1,
        120,
        10,
        1,
        115,
        10,
        1,
        101,
        10,
        1,
        97,
        10,
        1,
        116,
        18,
        1,
        121,
        34,
        5,
        83,
        108,
        105,
        99,
        101,
        18,
        1,
        114,
        90,
        9,
        10,
        1,
        120,
        18,
        4,
        10,
        2,
        8,
        1,
        90,
        9,
        10,
        1,
        115,
        18,
        4,
        10,
        2,
        8,
        7,
        90,
        9,
        10,
        1,
        101,
        18,
        4,
        10,
        2,
        8,
        7,
        90,
        9,
        10,
        1,
        97,
        18,
        4,
        10,
        2,
        8,
        7,
        90,
        9,
        10,
        1,
        116,
        18,
        4,
        10,
        2,
        8,
        7,
        98,
        9,
        10,
        1,
        121,
        18,
        4,
        10,
        2,
        8,
        1,
        66,
        2,
        16,
        13
      ],
      this.session_options,
      "y"
    )), this._slice;
  }
}, VT = Object.freeze({
  auto: "auto",
  // Auto-detect based on device and environment
  gpu: "gpu",
  // Auto-detect GPU
  cpu: "cpu",
  // CPU
  wasm: "wasm",
  // WebAssembly
  webgpu: "webgpu",
  // WebGPU
  cuda: "cuda",
  // CUDA
  dml: "dml",
  // DirectML
  coreml: "coreml",
  // CoreML
  webnn: "webnn",
  // WebNN (default)
  "webnn-npu": "webnn-npu",
  // WebNN NPU
  "webnn-gpu": "webnn-gpu",
  // WebNN GPU
  "webnn-cpu": "webnn-cpu"
  // WebNN CPU
}), xi = me.IS_NODE_ENV ? "cpu" : "wasm";
function xm(e, t, { warn: r } = {}) {
  return e ? typeof e == "string" ? e : e.hasOwnProperty(t) ? e[t] : (r && r(`device not specified for "${t}". Using the default device (${xi}).`), xi) : xi;
}
var UT = /* @__PURE__ */ (function() {
  let e;
  return async function() {
    if (e === void 0)
      if (!me.IS_WEBGPU_AVAILABLE)
        e = !1;
      else
        try {
          e = (await navigator.gpu.requestAdapter()).features.has("shader-f16");
        } catch {
          e = !1;
        }
    return e;
  };
})(), Qe = Object.freeze({
  auto: "auto",
  // Auto-detect based on environment
  fp32: "fp32",
  fp16: "fp16",
  q8: "q8",
  int8: "int8",
  uint8: "uint8",
  q4: "q4",
  bnb4: "bnb4",
  q4f16: "q4f16",
  // fp16 model with 4-bit block weight quantization
  q2: "q2",
  q2f16: "q2f16",
  // fp16 model with 2-bit block weight quantization
  q1: "q1",
  q1f16: "q1f16"
  // fp16 model with 1-bit block weight quantization
}), up = Qe.fp32, dp = Object.freeze({
  // NOTE: If not specified, will default to fp32
  [VT.wasm]: Qe.q8
}), va = Object.freeze({
  [Qe.fp32]: "",
  [Qe.fp16]: "_fp16",
  [Qe.int8]: "_int8",
  [Qe.uint8]: "_uint8",
  [Qe.q8]: "_quantized",
  [Qe.q4]: "_q4",
  [Qe.q2]: "_q2",
  [Qe.q1]: "_q1",
  [Qe.q4f16]: "_q4f16",
  [Qe.q2f16]: "_q2f16",
  [Qe.q1f16]: "_q1f16",
  [Qe.bnb4]: "_bnb4"
});
function km(e, t, r, { configDtype: n = null, warn: s } = {}) {
  let a, o = !1;
  e && typeof e != "string" ? e.hasOwnProperty(t) ? a = e[t] : (a = null, o = !0) : a = /** @type {string|null|undefined} */
  e;
  let i;
  if (a === Qe.auto) {
    if (n) {
      let l = typeof n == "string" ? n : n?.[t];
      if (l && l !== Qe.auto && Qe.hasOwnProperty(l))
        return (
          /** @type {DataType} */
          l
        );
    }
    i = dp[r] ?? up;
  } else a && Qe.hasOwnProperty(a) ? i = /** @type {DataType} */
  a : i = dp[r] ?? up;
  return o && s && s(
    `dtype not specified for "${t}". Using the default dtype (${i}) for this device (${r}).`
  ), i;
}
var us = Object.freeze({
  float32: Float32Array,
  // @ts-ignore ts(2552) Limited availability of Float16Array across browsers:
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Float16Array
  float16: typeof Float16Array < "u" ? Float16Array : Uint16Array,
  float64: Float64Array,
  string: Array,
  // string[]
  int8: Int8Array,
  uint8: Uint8Array,
  int16: Int16Array,
  uint16: Uint16Array,
  int32: Int32Array,
  uint32: Uint32Array,
  int64: BigInt64Array,
  uint64: BigUint64Array,
  bool: Uint8Array,
  uint4: Uint8Array,
  int4: Int8Array
}), V = class Ue {
  /**
   * Dimensions of the tensor.
   * @type {number[]}
   */
  get dims() {
    return this.ort_tensor.dims;
  }
  set dims(t) {
    this.ort_tensor.dims = t;
  }
  /**
   * Type of the tensor.
   * @type {DataType}
   */
  get type() {
    return this.ort_tensor.type;
  }
  /**
   * The data stored in the tensor.
   * @type {DataArray}
   */
  get data() {
    return this.ort_tensor.data;
  }
  /**
   * The number of elements in the tensor.
   * @type {number}
   */
  get size() {
    return this.ort_tensor.size;
  }
  /**
   * The location of the tensor data.
   * @type {string}
   */
  get location() {
    return this.ort_tensor.location;
  }
  ort_tensor;
  /**
   * Create a new Tensor, either from raw data or by wrapping an `onnxruntime` tensor:
   * - `new Tensor(dataType, data, dims)`, e.g. `new Tensor('float32', new Float32Array([1, 2, 3]), [3])`.
   * - `new Tensor(ortTensor)`.
   *
   * @param {[DataType, DataArray, number[]]|[ONNXTensor]} args
   */
  constructor(...t) {
    return Mm(t[0]) ? this.ort_tensor = /** @type {ONNXTensor} */
    t[0] : this.ort_tensor = new wi(
      /** @type {DataType} */
      t[0],
      // @ts-expect-error ts(2769) Type 'number' is not assignable to type 'bigint'.
      /** @type {Exclude<import('./maths.js').AnyTypedArray, Uint8ClampedArray>} */
      t[1],
      t[2]
    ), new Proxy(this, {
      get: (r, n) => {
        if (typeof n == "string") {
          let s = Number(n);
          if (Number.isInteger(s))
            return r._getitem(s);
        }
        return r[n];
      },
      set: (r, n, s) => r[n] = s
    });
  }
  /**
   * Releases the underlying ONNX Runtime tensor (e.g., GPU buffers). Do not use the tensor afterwards.
   */
  dispose() {
    this.ort_tensor.dispose();
  }
  /**
   * Returns an iterator object for iterating over the tensor data in row-major order.
   * If the tensor has more than one dimension, the iterator will yield subarrays.
   * @returns {Iterator<any>} An iterator object for iterating over the tensor data in row-major order.
   */
  *[Symbol.iterator]() {
    let [t, ...r] = this.dims;
    if (r.length > 0) {
      let n = r.reduce((s, a) => s * a);
      for (let s = 0; s < t; ++s)
        yield this._subarray(s, n, r);
    } else
      yield* this.data;
  }
  /**
   * Index into a Tensor object.
   * @param {number} index The index to access.
   * @returns {Tensor} The data at the specified index.
   * @private
   */
  _getitem(t) {
    let [r, ...n] = this.dims;
    if (t = Jt(t, r), n.length > 0) {
      let s = n.reduce((a, o) => a * o);
      return this._subarray(t, s, n);
    } else
      return new Ue(this.type, [this.data[t]], n);
  }
  /**
   * @param {number} index
   * @param {number} iterSize
   * @param {any} iterDims
   * @returns {Tensor}
   */
  _subarray(t, r, n) {
    let s = t * r, a = (t + 1) * r, o = "subarray" in this.data ? this.data.subarray(s, a) : this.data.slice(s, a);
    return new Ue(this.type, o, n);
  }
  /**
   * Returns the value of this tensor as a standard JavaScript Number. This only works
   * for tensors with one element. For other cases, see `Tensor.tolist()`.
   * @returns {number|bigint} The value of this tensor as a standard JavaScript Number.
   * @throws {Error} If the tensor has more than one element.
   */
  item() {
    let t = this.data;
    if (t.length !== 1)
      throw new Error(`a Tensor with ${t.length} elements cannot be converted to Scalar`);
    return t[0];
  }
  /**
   * Convert tensor data to a n-dimensional JS list
   * @returns {any[]}
   */
  tolist() {
    return jT(this.data, this.dims);
  }
  /**
   * Return a new Tensor with the sigmoid function applied to each element.
   * @returns {Tensor} The tensor with the sigmoid function applied.
   */
  sigmoid() {
    return this.clone().sigmoid_();
  }
  /**
   * Applies the sigmoid function to the tensor in place.
   * @returns {Tensor} Returns `this`.
   */
  sigmoid_() {
    let t = this.data;
    for (let r = 0; r < t.length; ++r)
      t[r] = 1 / (1 + Math.exp(-t[r]));
    return this;
  }
  /**
   * Return a new Tensor with a callback function applied to each element.
   * @param {Function} callback - The function to apply to each element. It should take three arguments:
   *                              the current element, its index, and the tensor's data array.
   * @returns {Tensor} A new Tensor with the callback function applied to each element.
   */
  map(t) {
    return this.clone().map_(t);
  }
  /**
   * Apply a callback function to each element of the tensor in place.
   * @param {Function} callback - The function to apply to each element. It should take three arguments:
   *                              the current element, its index, and the tensor's data array.
   * @returns {Tensor} Returns `this`.
   */
  map_(t) {
    let r = this.data;
    for (let n = 0; n < r.length; ++n)
      r[n] = t(r[n], n, r);
    return this;
  }
  /**
   * Return a new Tensor with every element multiplied by a constant.
   * @param {number} val The value to multiply by.
   * @returns {Tensor} The new tensor.
   */
  mul(t) {
    return this.clone().mul_(t);
  }
  /**
   * Multiply the tensor by a constant in place.
   * @param {number} val The value to multiply by.
   * @returns {Tensor} Returns `this`.
   */
  mul_(t) {
    let r = this.data;
    for (let n = 0; n < r.length; ++n)
      r[n] *= t;
    return this;
  }
  /**
   * Return a new Tensor with every element divided by a constant.
   * @param {number} val The value to divide by.
   * @returns {Tensor} The new tensor.
   */
  div(t) {
    return this.clone().div_(t);
  }
  /**
   * Divide the tensor by a constant in place.
   * @param {number} val The value to divide by.
   * @returns {Tensor} Returns `this`.
   */
  div_(t) {
    let r = this.data;
    for (let n = 0; n < r.length; ++n)
      r[n] /= t;
    return this;
  }
  /**
   * Return a new Tensor with every element added by a constant.
   * @param {number} val The value to add by.
   * @returns {Tensor} The new tensor.
   */
  add(t) {
    return this.clone().add_(t);
  }
  /**
   * Add the tensor by a constant in place.
   * @param {number} val The value to add by.
   * @returns {Tensor} Returns `this`.
   */
  add_(t) {
    let r = this.data;
    for (let n = 0; n < r.length; ++n)
      r[n] += t;
    return this;
  }
  /**
   * Return a new Tensor with every element subtracted by a constant.
   * @param {number} val The value to subtract by.
   * @returns {Tensor} The new tensor.
   */
  sub(t) {
    return this.clone().sub_(t);
  }
  /**
   * Subtract the tensor by a constant in place.
   * @param {number} val The value to subtract by.
   * @returns {Tensor} Returns `this`.
   */
  sub_(t) {
    let r = this.data;
    for (let n = 0; n < r.length; ++n)
      r[n] -= t;
    return this;
  }
  /**
   * Return a new Tensor with the element-wise remainder of division by a constant.
   * Uses Python-style modulo signs (e.g. `-1 mod 2 = 1`) while preserving the tensor's dtype.
   * Negative divisors are unsupported for unsigned and boolean tensors.
   * This operation does not implement PyTorch's dtype promotion or scalar casting rules.
   * @param {number|bigint} val The divisor.
   * @returns {Tensor} The new tensor.
   */
  remainder(t) {
    return this.clone().remainder_(t);
  }
  /**
   * In-place version of @see {@link Tensor.remainder}
   * @param {number|bigint} val The divisor.
   * @returns {Tensor} Returns `this`.
   */
  remainder_(t) {
    let r = this.data, s = (
      /** @type {any} */
      r instanceof BigInt64Array || r instanceof BigUint64Array ? BigInt(t) : Number(t)
    );
    if ((s === 0 || s === 0n) && (this.type.includes("int") || this.type === "bool"))
      throw new RangeError("Division by zero");
    if (s < 0 && (this.type.startsWith("uint") || this.type === "bool"))
      throw new RangeError("Negative divisors are not supported for unsigned or boolean tensors");
    for (let a = 0; a < r.length; ++a) {
      let o = r[a] % s, i = o < 0 && s > 0 || o > 0 && s < 0;
      r[a] = i ? o + s : o;
    }
    return this;
  }
  /**
   * Creates a deep copy of the current Tensor.
   * @returns {Tensor} A new Tensor with the same type, data, and dimensions as the original.
   */
  clone() {
    return new Ue(this.type, this.data.slice(), this.dims.slice());
  }
  /**
   * Performs a slice operation on the Tensor along specified dimensions.
   *
   * Consider a Tensor that has a dimension of [4, 7]:
   * ```
   * [ 1,  2,  3,  4,  5,  6,  7]
   * [ 8,  9, 10, 11, 12, 13, 14]
   * [15, 16, 17, 18, 19, 20, 21]
   * [22, 23, 24, 25, 26, 27, 28]
   * ```
   * We can slice against the two dims of row and column, for instance in this
   * case we can start at the second element, and return to the second last,
   * like this:
   * ```
   * tensor.slice([1, -1], [1, -1]);
   * ```
   * which would return:
   * ```
   * [  9, 10, 11, 12, 13 ]
   * [ 16, 17, 18, 19, 20 ]
   * ```
   *
   * @param {...(number|number[]|null)} slices The slice specifications for each dimension.
   * - If a number is given, then a single element is selected.
   * - If an array of two numbers is given, then a range of elements [start, end (exclusive)] is selected.
   * - If null is given, then the entire dimension is selected.
   * @returns {Tensor} A new Tensor containing the selected elements.
   * @throws {Error} If the slice input is invalid.
   */
  slice(...t) {
    let r = [], n = [];
    for (let d = 0; d < this.dims.length; ++d) {
      let h = t[d];
      if (h == null)
        n.push([0, this.dims[d]]), r.push(this.dims[d]);
      else if (typeof h == "number")
        h = Jt(h, this.dims[d], d), n.push([h, h + 1]);
      else if (Array.isArray(h) && h.length === 2) {
        let [_, p] = h;
        if (_ = _ === null ? 0 : Jt(_, this.dims[d], d, !1), p = p === null ? this.dims[d] : Jt(p, this.dims[d], d, !1), _ > p)
          throw new Error(`Invalid slice: ${h}`);
        let w = [Math.max(_, 0), Math.min(p, this.dims[d])];
        n.push(w), r.push(w[1] - w[0]);
      } else
        throw new Error(`Invalid slice: ${h}`);
    }
    let s = n.map(([d, h]) => h - d), a = s.reduce((d, h) => d * h), o = this.data, i = new o.constructor(a), l = this.stride(), c = !0;
    for (let d = 1; d < s.length; ++d)
      if (n[d][0] !== 0 || n[d][1] !== this.dims[d]) {
        c = !1;
        break;
      }
    if (c) {
      let d = n[0][0] * l[0], h = n[0][1] * l[0];
      if (ArrayBuffer.isView(o))
        i.set(o.subarray(d, h));
      else if (Array.isArray(o)) {
        let _ = o.slice(d, h);
        for (let p = 0; p < _.length; ++p)
          i[p] = _[p];
      } else
        throw new Error("Unsupported data type for slicing");
    } else
      for (let d = 0; d < a; ++d) {
        let h = 0;
        for (let _ = s.length - 1, p = d; _ >= 0; --_) {
          let w = s[_];
          h += (p % w + n[_][0]) * l[_], p = Math.floor(p / w);
        }
        i[d] = o[h];
      }
    return new Ue(this.type, i, r);
  }
  /**
   * Return a permuted version of this Tensor, according to the provided dimensions.
   * @param  {...number} dims Dimensions to permute.
   * @returns {Tensor} The permuted tensor.
   */
  permute(...t) {
    return WT(this, t);
  }
  // TODO: implement transpose. For now (backwards compatibility), it's just an alias for permute()
  /** @type {Tensor['permute']} */
  transpose(...t) {
    return this.permute(...t);
  }
  /**
   * Returns the sum of each row of the input tensor in the given dimension dim.
   *
   * @param {number|null} [dim=null] The dimension or dimensions to reduce. If `null`, all dimensions are reduced.
   * @param {boolean} keepdim Whether the output tensor has `dim` retained or not.
   * @returns The summed tensor
   */
  sum(t = null, r = !1) {
    return this.norm(1, t, r);
  }
  /**
   * Returns the matrix norm or vector norm of a given tensor.
   * @param {number|string} [p='fro'] The order of norm
   * @param {number|null} [dim=null] Specifies which dimension of the tensor to calculate the norm across.
   * If dim is None, the norm will be calculated across all dimensions of input.
   * @param {boolean} [keepdim=false] Whether the output tensors have dim retained or not.
   * @returns {Tensor} The norm of the tensor.
   */
  norm(t = "fro", r = null, n = !1) {
    if (t === "fro")
      t = 2;
    else if (typeof t == "string")
      throw Error(`Unsupported norm: ${t}`);
    let s = this.data, a = s instanceof BigInt64Array || s instanceof BigUint64Array;
    if (a && t !== 1)
      throw Error(`Expected a floating point tensor as input. Got ${this.type}`);
    let o, i;
    if (a ? (o = (h, _) => h + _, i = 0n) : (o = (h, _) => h + _ ** t, i = 0), r === null) {
      let h = s.reduce(o, i);
      return t !== 1 && (h = h ** (1 / t)), new Ue(this.type, [h], []);
    }
    let [l, c, d] = is(o, this, r, n);
    if (t !== 1)
      for (let h = 0; h < c.length; ++h)
        c[h] = c[h] ** (1 / t);
    return new Ue(l, c, d);
  }
  /**
   * Performs `L_p` normalization of inputs over specified dimension. Operates in place.
   * @param {number} [p=2] The exponent value in the norm formulation
   * @param {number} [dim=1] The dimension to reduce
   * @returns {Tensor} `this` for operation chaining.
   */
  normalize_(t = 2, r = 1) {
    r = Jt(r, this.dims.length);
    let n = this.norm(t, r, !0), s = this.data, a = n.data;
    for (let o = 0; o < s.length; ++o) {
      let i = 0;
      for (let l = this.dims.length - 1, c = o, d = 1; l >= 0; --l) {
        let h = this.dims[l];
        if (l !== r) {
          let _ = c % h;
          i += _ * d, d *= this.dims[l];
        }
        c = Math.floor(c / h);
      }
      s[o] /= a[i];
    }
    return this;
  }
  /**
   * Performs `L_p` normalization of inputs over specified dimension.
   * @param {number} [p=2] The exponent value in the norm formulation
   * @param {number} [dim=1] The dimension to reduce
   * @returns {Tensor} The normalized tensor.
   */
  normalize(t = 2, r = 1) {
    return this.clone().normalize_(t, r);
  }
  /**
   * Compute and return the stride of this tensor.
   * Stride is the jump necessary to go from one element to the next one in the specified dimension dim.
   * @returns {number[]} The stride of this tensor.
   */
  stride() {
    return ki(this.dims);
  }
  /**
   * Returns a tensor with all specified dimensions of input of size 1 removed.
   *
   * NOTE: The returned tensor shares the storage with the input tensor, so changing the contents of one will change the contents of the other.
   * If you would like a copy, use `tensor.clone()` before squeezing.
   *
   * @param {number|number[]|null} [dim=null] If given, the input will be squeezed only in the specified dimensions.
   * @returns {Tensor} The squeezed tensor
   */
  squeeze(t = null) {
    return new Ue(this.type, this.data, hp(this.dims, t));
  }
  /**
   * In-place version of @see {@link Tensor.squeeze}
   * @param {number|number[]|null} [dim=null] If given, the input will be squeezed only in the specified dimensions.
   * @returns {Tensor} `this`, with the specified dimensions of size 1 removed.
   */
  squeeze_(t = null) {
    return this.dims = hp(this.dims, t), this;
  }
  /**
   * Returns a new tensor with a dimension of size one inserted at the specified position.
   *
   * NOTE: The returned tensor shares the same underlying data with this tensor.
   *
   * @param {number} dim The index at which to insert the singleton dimension
   * @returns {Tensor} The unsqueezed tensor
   */
  unsqueeze(t) {
    return new Ue(this.type, this.data, fp(this.dims, t));
  }
  /**
   * In-place version of @see {@link Tensor.unsqueeze}
   * @type {Tensor['unsqueeze']}
   */
  unsqueeze_(t) {
    return this.dims = fp(this.dims, t), this;
  }
  /**
   * In-place version of @see {@link Tensor.flatten}
   * @param {number} [start_dim=0] the first dim to flatten
   * @param {number} [end_dim=-1] the last dim to flatten
   * @returns {Tensor} `this`, flattened along the specified dimensions.
   */
  flatten_(t = 0, r = -1) {
    r = (r + this.dims.length) % this.dims.length;
    let n = this.dims.slice(0, t), s = this.dims.slice(t, r + 1), a = this.dims.slice(r + 1);
    return this.dims = [...n, s.reduce((o, i) => o * i, 1), ...a], this;
  }
  /**
   * Flattens input by reshaping it into a one-dimensional tensor.
   * If `start_dim` or `end_dim` are passed, only dimensions starting with `start_dim`
   * and ending with `end_dim` are flattened. The order of elements in input is unchanged.
   * @param {number} start_dim the first dim to flatten
   * @param {number} end_dim the last dim to flatten
   * @returns {Tensor} The flattened tensor.
   */
  flatten(t = 0, r = -1) {
    return this.clone().flatten_(t, r);
  }
  /**
   * Returns a new tensor with the same data as the `self` tensor but of a different `shape`.
   * @param  {...number} dims the desired size
   * @returns {Tensor} The tensor with the same data but different shape
   */
  view(...t) {
    let r = -1;
    for (let s = 0; s < t.length; ++s)
      if (t[s] === -1) {
        if (r !== -1)
          throw new Error("Only one dimension can be inferred");
        r = s;
      }
    let n = this.data;
    if (r !== -1) {
      let s = t.reduce((a, o, i) => i !== r ? a * o : a, 1);
      t[r] = n.length / s;
    }
    return new Ue(this.type, n, t);
  }
  /**
   * In-place version of @see {@link Tensor.neg}
   * @returns {Tensor} `this`, with every element negated.
   */
  neg_() {
    let t = this.data;
    for (let r = 0; r < t.length; ++r)
      t[r] = -t[r];
    return this;
  }
  /**
   * Returns a new tensor with the negative of the elements of this tensor.
   * @returns {Tensor} the output tensor.
   */
  neg() {
    return this.clone().neg_();
  }
  /**
   * Computes input > val element-wise.
   * @param {number} val The value to compare with.
   * @returns {Tensor} A boolean tensor that is `true` where input is greater than other and `false` elsewhere.
   */
  gt(t) {
    let r = new Uint8Array(this.data.length), n = this.data;
    for (let s = 0; s < n.length; ++s)
      r[s] = n[s] > t ? 1 : 0;
    return new Ue("bool", r, this.dims);
  }
  /**
   * Computes input < val element-wise.
   * @param {number} val The value to compare with.
   * @returns {Tensor} A boolean tensor that is `true` where input is less than other and `false` elsewhere.
   */
  lt(t) {
    let r = new Uint8Array(this.data.length), n = this.data;
    for (let s = 0; s < n.length; ++s)
      r[s] = n[s] < t ? 1 : 0;
    return new Ue("bool", r, this.dims);
  }
  /**
   * In-place version of @see {@link Tensor.clamp}
   * @type {Tensor['clamp']}
   */
  clamp_(t, r) {
    let n = this.data;
    for (let s = 0; s < n.length; ++s)
      n[s] = Math.min(Math.max(n[s], t), r);
    return this;
  }
  /**
   * Clamps all elements in input into the range [ min, max ]
   * @param {number} min lower-bound of the range to be clamped to
   * @param {number} max upper-bound of the range to be clamped to
   * @returns {Tensor} the output tensor.
   */
  clamp(t, r) {
    return this.clone().clamp_(t, r);
  }
  /**
   * In-place version of @see {@link Tensor.round}
   */
  round_() {
    let t = this.data;
    for (let r = 0; r < t.length; ++r)
      t[r] = Math.round(t[r]);
    return this;
  }
  /**
   * Rounds elements of input to the nearest integer.
   * @returns {Tensor} the output tensor.
   */
  round() {
    return this.clone().round_();
  }
  /**
   * Returns the mean value of each row of this tensor in the given dimension `dim`.
   * @param {number|null} [dim=null] the dimension to reduce. If `null`, the mean of all elements is computed.
   * @param {boolean} [keepdim=false] whether the output tensor has `dim` retained or not.
   * @returns {Tensor} A new tensor with means taken along the specified dimension.
   */
  mean(t = null, r = !1) {
    return il(this, t, r);
  }
  /**
   * Returns the minimum value of each row of this tensor in the given dimension `dim`.
   * @param {number|null} [dim=null] the dimension to reduce. If `null`, the minimum of all elements is computed.
   * @param {boolean} [keepdim=false] whether the output tensor has `dim` retained or not.
   * @returns {Tensor} A new tensor with minimum values taken along the specified dimension.
   */
  min(t = null, r = !1) {
    if (t === null) {
      let o = zi(this.data)[0];
      return new Ue(
        this.type,
        [o],
        [
          /* scalar */
        ]
      );
    }
    let [n, s, a] = is((o, i) => Math.min(o, i), this, t, r, 1 / 0);
    return new Ue(n, s, a);
  }
  /**
   * Returns the maximum value of each row of this tensor in the given dimension `dim`.
   * @param {number|null} [dim=null] the dimension to reduce. If `null`, the maximum of all elements is computed.
   * @param {boolean} [keepdim=false] whether the output tensor has `dim` retained or not.
   * @returns {Tensor} A new tensor with maximum values taken along the specified dimension.
   */
  max(t = null, r = !1) {
    if (t === null) {
      let o = qe(this.data)[0];
      return new Ue(
        this.type,
        [o],
        [
          /* scalar */
        ]
      );
    }
    let [n, s, a] = is((o, i) => Math.max(o, i), this, t, r, -1 / 0);
    return new Ue(n, s, a);
  }
  /**
   * Returns the index of the minimum value of all elements in this tensor.
   * @param {number|null} [dim=null] the dimension to reduce. Only `null` (reduce over all elements) is currently supported.
   * @param {boolean} [keepdim=false] whether the output tensor has `dim` retained or not.
   * @returns {Tensor} An `int64` scalar tensor containing the index of the minimum value.
   * @throws {Error} If `dim` is not `null`.
   */
  argmin(t = null, r = !1) {
    if (t !== null)
      throw new Error("`dim !== null` not yet implemented.");
    let n = zi(this.data)[1];
    return new Ue("int64", [BigInt(n)], []);
  }
  /**
   * Returns the index of the maximum value of all elements in this tensor.
   * @param {number|null} [dim=null] the dimension to reduce. Only `null` (reduce over all elements) is currently supported.
   * @param {boolean} [keepdim=false] whether the output tensor has `dim` retained or not.
   * @returns {Tensor} An `int64` scalar tensor containing the index of the maximum value.
   * @throws {Error} If `dim` is not `null`.
   */
  argmax(t = null, r = !1) {
    if (t !== null)
      throw new Error("`dim !== null` not yet implemented.");
    let n = qe(this.data)[1];
    return new Ue("int64", [BigInt(n)], []);
  }
  /**
   * Repeats this tensor along the specified dimensions.
   * @param {...number} repeats The number of times to repeat this tensor along each dimension.
   * @returns {Tensor} The repeated tensor.
   * @throws {Error} If the number of repeats is less than the number of dimensions.
   */
  repeat(...t) {
    if (t.length < this.dims.length)
      throw new Error(
        `Number of dimensions of repeat dims (${t.length}) cannot be smaller than number of dimensions of tensor (${this.dims.length})`
      );
    if (t.every((d) => d === 1)) {
      if (t.length === this.dims.length)
        return this.clone();
      let d = t.length - this.dims.length, h = Array(d).fill(1).concat(this.dims);
      return new Ue(this.type, this.data.slice(), h);
    }
    let r = t.length - this.dims.length, n = Array(r).fill(1).concat(this.dims), s = n.map((d, h) => d * t[h]), a = s.reduce((d, h) => d * h, 1), o = this.data, i = new o.constructor(a), l = ki(n), c = ki(s);
    for (let d = 0; d < a; ++d) {
      let h = d, _ = 0;
      for (let p = 0; p < s.length; ++p) {
        let w = Math.floor(h / c[p]);
        h = h % c[p];
        let v = w % n[p];
        _ += v * l[p];
      }
      i[d] = o[_];
    }
    return new Ue(this.type, i, s);
  }
  /**
   * Constructs a tensor by repeating the elements of input. The dims argument specifies the number of repetitions in each dimension.
   * @param  {...number} dims The number of repetitions per dimension.
   * @returns {Tensor} The tiled tensor.
   */
  tile(...t) {
    if (t.length < this.dims.length) {
      let r = this.dims.length - t.length;
      t = Array(r).fill(1).concat(t);
    }
    return this.repeat(...t);
  }
  /**
   * Performs Tensor dtype conversion.
   * @param {DataType} type The desired data type.
   * @returns {Tensor} The converted tensor.
   */
  to(t) {
    if (this.type === t) return this;
    if (!us.hasOwnProperty(t))
      throw new Error(`Unsupported type: ${t}`);
    let r, n = ["int64", "uint64"].includes(this.type), s = ["int64", "uint64"].includes(t);
    if (n && !s)
      r = Number;
    else if (!n && s)
      ["float16", "float32", "float64"].includes(this.type) ? r = (a) => BigInt(Math.floor(a)) : r = BigInt;
    else if (this.type === "float16" && t == "float32" && this.data instanceof Uint16Array)
      return new Ue(t, LT(this.data), this.dims);
    return new Ue(
      t,
      // @ts-ignore - TypeScript can't verify .from() across union of TypedArray constructors
      us[t].from(this.data, r),
      this.dims
    );
  }
};
function jT(e, t) {
  let r = e.length, n = t.length === 0 ? 1 : t.reduce((a, o) => a * o);
  if (r !== n)
    throw Error(`cannot reshape array of size ${r} into shape (${t})`);
  let s = e;
  for (let a = t.length - 1; a >= 0; a--)
    s = s.reduce(
      (o, i) => {
        let l = o[o.length - 1];
        return l.length < t[a] ? l.push(i) : o.push([i]), o;
      },
      [[]]
    );
  return s[0];
}
function WT(e, t) {
  let [r, n] = ET(e.data, e.dims, t);
  return new V(e.type, r, n);
}
function Tm(e, [t, r], n = "bilinear", s = !1) {
  let a = e.dims.at(-3) ?? 1, o = e.dims.at(-2), i = e.dims.at(-1), l = TT(
    /** @type {import('./maths.js').TypedArray}*/
    e.data,
    [a, o, i],
    [t, r],
    n,
    s
  );
  return new V(e.type, l, [a, t, r]);
}
async function Rt(e, { size: t = null, mode: r = "bilinear" } = {}) {
  if (e.dims.length !== 4)
    throw new Error("`interpolate_4d` currently only supports 4D input.");
  if (!t)
    throw new Error("`interpolate_4d` requires a `size` argument.");
  let n;
  if (t.length === 2)
    n = [...e.dims.slice(0, 2), ...t];
  else if (t.length === 3)
    n = [e.dims[0], ...t];
  else if (t.length === 4)
    n = t;
  else
    throw new Error("`size` must be of length 2, 3, or 4.");
  let s;
  if (r === "nearest")
    s = await Tn.nearest_interpolate_4d;
  else if (r === "bilinear")
    s = await Tn.bilinear_interpolate_4d;
  else if (r === "bicubic")
    s = await Tn.bicubic_interpolate_4d;
  else
    throw new Error(`Unsupported mode: ${r}`);
  let a = new V("int64", new BigInt64Array(n.map(BigInt)), [n.length]);
  return await s({ x: e, s: a });
}
async function qT(e, t) {
  return await (await Tn.matmul)({ a: e, b: t });
}
async function Pn(e, t) {
  let r = await Tn.top_k;
  return t == null ? t = e.dims.at(-1) : t = Math.min(t, e.dims.at(-1)), await r({
    x: e,
    k: new V("int64", [BigInt(t)], [1])
  });
}
var Js = (e) => new V("int64", e, [e.length]);
async function Em(e, t, r, n, s) {
  return await (await Tn.slice)({
    x: e,
    s: Js(t),
    e: Js(r),
    a: Js(n),
    t: Js(s ?? new Array(n.length).fill(1))
  });
}
function HT(e, t) {
  let r = e.data, n = t.data, s = [e.dims[0], e.dims[2]], a = new r.constructor(s[0] * s[1]), [o, i, l] = e.dims, c = 0;
  for (let d = 0; d < o; ++d) {
    let h = d * l * i;
    for (let _ = 0; _ < l; ++_) {
      let p = 0, w = 0, v = d * i, y = h + _;
      for (let k = 0; k < i; ++k) {
        let A = Number(n[v + k]);
        w += A, p += r[y + k * l] * A;
      }
      let b = p / w;
      a[c++] = b;
    }
  }
  return new V(e.type, a, s);
}
function hp(e, t) {
  return e = e.slice(), t === null ? e = e.filter((r) => r !== 1) : typeof t == "number" ? e[t] === 1 && e.splice(t, 1) : Array.isArray(t) && (e = e.filter((r, n) => r !== 1 || !t.includes(n))), e;
}
function fp(e, t) {
  return t = Jt(t, e.length + 1), e = e.slice(), e.splice(t, 0, 1), e;
}
function Jt(e, t, r = null, n = !0) {
  if (e < -t || e >= t) {
    if (n)
      throw new Error(
        `IndexError: index ${e} is out of bounds for dimension${r === null ? "" : " " + r} with size ${t}`
      );
    return e < -t ? 0 : t;
  }
  return e < 0 && (e = (e % t + t) % t), e;
}
function De(e, t = 0) {
  t = Jt(t, e[0].dims.length);
  let r = e[0].dims.slice();
  r[t] = e.reduce((o, i) => o + i.dims[t], 0);
  let n = r.reduce((o, i) => o * i, 1), s = new e[0].data.constructor(n), a = e[0].type;
  if (t === 0) {
    let o = 0;
    for (let i of e) {
      let l = i.data;
      s.set(l, o), o += l.length;
    }
  } else {
    let o = 0;
    for (let i = 0; i < e.length; ++i) {
      let { data: l, dims: c } = e[i];
      for (let d = 0; d < l.length; ++d) {
        let h = 0;
        for (let _ = c.length - 1, p = d, w = 1; _ >= 0; --_) {
          let v = c[_], y = p % v;
          _ === t && (y += o), h += y * w, w *= r[_], p = Math.floor(p / v);
        }
        s[h] = l[d];
      }
      o += c[t];
    }
  }
  return new V(a, s, r);
}
function fr(e, t = 0) {
  return De(
    e.map((r) => r.unsqueeze(t)),
    t
  );
}
function is(e, t, r, n = !1, s = null) {
  let a = t.data, o = t.dims;
  r = Jt(r, o.length);
  let i = o.slice();
  i[r] = 1;
  let l = new a.constructor(a.length / o[r]);
  s !== null && l.fill(s);
  for (let c = 0; c < a.length; ++c) {
    let d = 0;
    for (let h = o.length - 1, _ = c, p = 1; h >= 0; --h) {
      let w = o[h];
      if (h !== r) {
        let v = _ % w;
        d += v * p, p *= i[h];
      }
      _ = Math.floor(_ / w);
    }
    l[d] = e(l[d], a[c], c, d);
  }
  return n || i.splice(r, 1), [t.type, l, i];
}
function QT(e, t = null, r = 1, n = !1) {
  let s = (
    /** @type {Float32Array} */
    e.data
  ), a = e.dims;
  if (t === null) {
    let p = s.reduce((b, k) => b + k, 0) / s.length, w = Math.sqrt(s.reduce((b, k) => b + (k - p) ** 2, 0) / (s.length - r)), v = new V(
      e.type,
      [p],
      [
        /* scalar */
      ]
    );
    return [new V(
      e.type,
      [w],
      [
        /* scalar */
      ]
    ), v];
  }
  t = Jt(t, a.length);
  let o = il(e, t, n), i = o.data, [l, c, d] = is(
    (_, p, w, v) => _ + (p - i[v]) ** 2,
    e,
    t,
    n
  );
  for (let _ = 0; _ < c.length; ++_)
    c[_] = Math.sqrt(c[_] / (a[t] - r));
  return [new V(l, c, d), o];
}
function il(e, t = null, r = !1) {
  let n = e.dims, s = (
    /** @type {Float32Array} */
    e.data
  );
  if (t === null) {
    let l = s.reduce((c, d) => c + d, 0);
    return new V(
      e.type,
      [l / s.length],
      [
        /* scalar */
      ]
    );
  }
  t = Jt(t, n.length);
  let [a, o, i] = is((l, c) => l + c, e, t, r);
  if (n[t] !== 1)
    for (let l = 0; l < o.length; ++l)
      o[l] /= n[t];
  return new V(a, o, i);
}
function ki(e) {
  let t = new Array(e.length);
  for (let r = e.length - 1, n = 1; r >= 0; --r)
    t[r] = n, n *= e[r];
  return t;
}
function ll(e, t, r, n) {
  let s = e.reduce((a, o) => a * o, 1);
  return new V(r, new n(s).fill(t), e);
}
function ut(e, t) {
  let r, n;
  if (typeof t == "number")
    r = "float32", n = Float32Array;
  else if (typeof t == "bigint")
    r = "int64", n = BigInt64Array;
  else if (typeof t == "boolean")
    r = "bool", n = Uint8Array;
  else
    throw new Error(`Unsupported data type: ${typeof t}`);
  return ll(e, t, r, n);
}
function Ri(e, t) {
  return ut(e.dims, t);
}
function gt(e) {
  return ll(e, 1n, "int64", BigInt64Array);
}
function cl(e) {
  return gt(e.dims);
}
function Am(e) {
  return ll(e, 0n, "int64", BigInt64Array);
}
function ul(e) {
  return Am(e.dims);
}
function XT(e) {
  let t = e.reduce((r, n) => r * n, 1);
  return new V(
    "float32",
    Float32Array.from({ length: t }, () => rl.gauss()),
    e
  );
}
function YT(e, t) {
  if (e.dims.length !== 2)
    throw new Error("The tensor must have 2 dimensions");
  if (e.dims.at(-1) % 8 !== 0)
    throw new Error("The last dimension of the tensor must be a multiple of 8");
  if (!["binary", "ubinary"].includes(t))
    throw new Error("The precision must be either 'binary' or 'ubinary'");
  let r = t === "binary", n = r ? "int8" : "uint8", s = r ? Int8Array : Uint8Array, a = e.data, o = new s(a.length / 8);
  for (let i = 0; i < a.length; ++i) {
    let l = a[i] > 0 ? 1 : 0, c = Math.floor(i / 8), d = i % 8;
    o[c] |= l << 7 - d, r && d === 0 && (o[c] -= 128);
  }
  return new V(n, o, [e.dims[0], e.dims[1] / 8]);
}
async function Cm(e) {
  if (!e)
    throw new Error("modelId is required for get_tokenizer_files");
  return (await ms(e, "tokenizer_config.json", {})).exists ? ["tokenizer.json", "tokenizer_config.json"] : [];
}
async function Sm(e, t) {
  let r = await Cm(e);
  return await Promise.all(
    r.map((n) => sr(e, n, !0, t))
  );
}
function dl(e) {
  let t = e.dims;
  switch (t.length) {
    case 1:
      return e.tolist();
    case 2:
      if (t[0] !== 1)
        throw new Error(
          "Unable to decode tensor with `batch size !== 1`. Use `tokenizer.batch_decode(...)` for batched inputs."
        );
      return e.tolist()[0];
    default:
      throw new Error(`Expected tensor to have 1-2 dimensions, got ${t.length}.`);
  }
}
var KT = [
  "bos_token",
  "eos_token",
  "unk_token",
  "sep_token",
  "pad_token",
  "cls_token",
  "mask_token"
  // additional_special_tokens (TODO)
];
function JT(e, t, r, n) {
  for (let s of Object.keys(e)) {
    let a = t - e[s].length, o = r(s), i = new Array(a).fill(o);
    e[s] = n === "right" ? er(e[s], i) : er(i, e[s]);
  }
}
function ZT(e, t) {
  for (let r of Object.keys(e))
    e[r].length = t;
}
function Zr(e, ...t) {
  for (let r of t) {
    if (!Object.hasOwn(e, r)) continue;
    let n = e[r];
    if (n)
      if (typeof n == "object") {
        if (n.__type === "AddedToken")
          return n.content;
        throw Error(`Unknown token: ${n}`);
      } else
        return n;
  }
  return null;
}
function eE(e) {
  let t = [];
  for (let r of e.get_added_tokens_decoder().values())
    r.special && t.push(r);
  return t;
}
var ie = class extends /** @type {new (tokenizerJSON: Object, tokenizerConfig: Object) => PreTrainedTokenizerCallback} */
mt {
  return_token_type_ids = !1;
  padding_side = "right";
  /**
   * Create a new PreTrainedTokenizer instance.
   * @param {Object} tokenizerJSON The JSON of the tokenizer.
   * @param {Object} tokenizerConfig The config of the tokenizer.
   */
  constructor(e, t) {
    if (super(), this._tokenizerJSON = e, this._tokenizerConfig = t, this._tokenizer = new uk(e, t), this.config = t, this.padding_side = t.padding_side ?? this.padding_side, this.mask_token = Zr(t, "mask_token"), this.mask_token_id = this._tokenizer.token_to_id(this.mask_token), this.pad_token = Zr(t, "pad_token", "eos_token"), this.pad_token_id = this._tokenizer.token_to_id(this.pad_token), this.sep_token = Zr(t, "sep_token"), this.sep_token_id = this._tokenizer.token_to_id(this.sep_token), this.unk_token = Zr(t, "unk_token"), this.unk_token_id = this._tokenizer.token_to_id(this.unk_token), this.bos_token = Zr(t, "bos_token"), this.bos_token_id = this._tokenizer.token_to_id(this.bos_token), this.eos_token = Zr(t, "eos_token"), this.eos_token_id = this._tokenizer.token_to_id(this.eos_token), this.chat_template = t.chat_template ?? null, Array.isArray(this.chat_template)) {
      let n = /* @__PURE__ */ Object.create(null);
      for (let { name: s, template: a } of this.chat_template) {
        if (typeof s != "string" || typeof a != "string")
          throw new Error('Chat template must be a list of objects with "name" and "template" properties');
        n[s] = a;
      }
      this.chat_template = n;
    }
    this._compiled_template_cache = /* @__PURE__ */ new Map();
    let r = eE(this._tokenizer);
    this.all_special_ids = r.map((n) => n.id), this.all_special_tokens = r.map((n) => n.content);
  }
  /**
   * Loads a pretrained tokenizer from the given `pretrained_model_name_or_path`.
   *
   * @param {string} pretrained_model_name_or_path The path to the pretrained tokenizer.
   * @param {PretrainedTokenizerOptions} options Additional options for loading the tokenizer.
   *
   * @throws {Error} Throws an error if the tokenizer.json or tokenizer_config.json files are not found in the `pretrained_model_name_or_path`.
   * @returns {Promise<PreTrainedTokenizer>} A new instance of the `PreTrainedTokenizer` class.
   */
  static async from_pretrained(e, { progress_callback: t = null, config: r = null, cache_dir: n = null, local_files_only: s = !1, revision: a = "main" } = {}) {
    let o = await Sm(e, {
      progress_callback: t,
      config: r,
      cache_dir: n,
      local_files_only: s,
      revision: a
    });
    return new this(...o);
  }
  get_vocab() {
    return this._tokenizer.get_vocab();
  }
  get model_max_length() {
    return this._tokenizerConfig.model_max_length ?? 1 / 0;
  }
  get add_eos_token() {
    return this._tokenizerConfig.add_eos_token;
  }
  get add_bos_token() {
    return this._tokenizerConfig.add_bos_token;
  }
  /**
   * Converts a token string (or a sequence of tokens) into a single integer id (or a sequence of ids), using the vocabulary.
   *
   * @template {string|string[]} T
   * @param {T} tokens One or several token(s) to convert to token id(s).
   * @returns {T extends string ? number : number[]} The token id or list of token ids.
   */
  convert_tokens_to_ids(e) {
    return typeof e == "string" ? (
      /** @type {any} */
      this._tokenizer.token_to_id(e)
    ) : (
      /** @type {any} */
      e.map((t) => this._tokenizer.token_to_id(t))
    );
  }
  /**
   * Encode/tokenize the given text(s).
   * @template {string|string[]} TText
   * @template {boolean} [TReturnTensor=true]
   * @param {TText} text The text to tokenize.
   * @param {TokenizerCallOptions<TText, TReturnTensor>} [options] Additional tokenization options.
   * @returns {BatchEncoding<BatchEncodingItem<TText, TReturnTensor>>} Object to be passed to the model.
   */
  _call(e, t = {}) {
    let { text_pair: r = null, add_special_tokens: n = !0, padding: s = !1, return_token_type_ids: a = null } = t, { truncation: o = null, max_length: i = null } = t, l = (
      /** @type {TReturnTensor} */
      t.return_tensor ?? !0
    ), c = Array.isArray(e), d;
    if (c) {
      if (e.length === 0)
        throw Error("text array must be non-empty");
      if (r !== null) {
        if (Array.isArray(r)) {
          if (e.length !== r.length)
            throw Error("text and text_pair must have the same length");
        } else throw Error("text_pair must also be an array");
        d = e.map(
          (_, p) => this._encode_plus(_, { text_pair: r[p], add_special_tokens: n, return_token_type_ids: a })
        );
      } else
        d = e.map((_) => this._encode_plus(_, { add_special_tokens: n, return_token_type_ids: a }));
    } else {
      if (e == null)
        throw Error("text may not be null or undefined");
      if (Array.isArray(r))
        throw Error(
          "When specifying `text_pair`, since `text` is a string, `text_pair` must also be a string (i.e., not an array)."
        );
      d = [this._encode_plus(e, { text_pair: r, add_special_tokens: n, return_token_type_ids: a })];
    }
    if (i === null ? i = this.model_max_length : o === null && (s === !0 ? (le.warn(
      "`max_length` is ignored when `padding: true` and there is no truncation strategy. To pad to max length, use `padding: 'max_length'`."
    ), i = this.model_max_length) : s === !1 && (le.warn(
      "Truncation was not explicitly activated but `max_length` is provided a specific value, please use `truncation: true` to explicitly truncate examples to max length."
    ), o = !0)), s === !0 && (i = Math.min(qe(d.map((_) => _.input_ids.length))[0], i ?? 1 / 0)), i = Math.min(i, this.model_max_length ?? 1 / 0), s || o)
      for (let _ = 0; _ < d.length; ++_)
        d[_].input_ids.length !== i && (d[_].input_ids.length > i ? o && ZT(d[_], i) : s && JT(
          d[_],
          i,
          (p) => p === "input_ids" ? this.pad_token_id : 0,
          this.padding_side
        ));
    let h = {};
    if (l) {
      if (!(s && o) && d.some((p) => {
        for (let w of Object.keys(p))
          if (p[w].length !== d[0][w]?.length)
            return !0;
        return !1;
      }))
        throw Error(
          "Unable to create tensor, you should probably activate truncation and/or padding with 'padding=true' and 'truncation=true' to have batched tensors with the same length."
        );
      let _ = [d.length, d[0].input_ids.length];
      for (let p of Object.keys(d[0]))
        h[p] = new V(
          "int64",
          BigInt64Array.from(d.flatMap((w) => w[p]).map(BigInt)),
          _
        );
    } else {
      for (let _ of Object.keys(d[0]))
        h[_] = d.map((p) => p[_]);
      if (!c)
        for (let _ of Object.keys(h))
          h[_] = h[_][0];
    }
    return (
      /** @type {BatchEncoding<BatchEncodingItem<TText, TReturnTensor>>} */
      h
    );
  }
  /**
   * Encodes a single text using the preprocessor pipeline of the tokenizer.
   *
   * @param {string|null} text The text to encode.
   * @returns {string[]|null} The encoded tokens.
   */
  _encode_text(e) {
    return e === null ? null : this._tokenizer.encode(e).tokens;
  }
  /**
   * Encodes a single text or a pair of texts using the model's tokenizer.
   *
   * @param {string} text The text to encode.
   * @param {Object} options An optional object containing the following properties:
   * @param {string|null} [options.text_pair=null] The optional second text to encode.
   * @param {boolean} [options.add_special_tokens=true] Whether or not to add the special tokens associated with the corresponding model.
   * @param {boolean|null} [options.return_token_type_ids=null] Whether to return token_type_ids.
   * @returns {{input_ids: number[], attention_mask: number[], token_type_ids?: number[]}} An object containing the encoded text.
   * @private
   */
  _encode_plus(e, { text_pair: t = null, add_special_tokens: r = !0, return_token_type_ids: n = null } = {}) {
    let { ids: s, attention_mask: a, token_type_ids: o } = this._tokenizer.encode(e, {
      text_pair: t,
      add_special_tokens: r,
      return_token_type_ids: n ?? this.return_token_type_ids
    });
    return {
      input_ids: s,
      attention_mask: a,
      ...o ? { token_type_ids: o } : {}
    };
  }
  /**
   * Converts a string into a sequence of tokens.
   * @param {string} text The sequence to be encoded.
   * @param {Object} options An optional object containing the following properties:
   * @param {string|null} [options.pair] A second sequence to be encoded with the first.
   * @param {boolean} [options.add_special_tokens=false] Whether or not to add the special tokens associated with the corresponding model.
   * @returns {string[]} The list of tokens.
   */
  tokenize(e, { pair: t = null, add_special_tokens: r = !1 } = {}) {
    return this._tokenizer.tokenize(e, { text_pair: t, add_special_tokens: r });
  }
  /**
   * Encodes a single text or a pair of texts using the model's tokenizer.
   *
   * @param {string} text The text to encode.
   * @param {Object} options An optional object containing the following properties:
   * @param {string|null} [options.text_pair=null] The optional second text to encode.
   * @param {boolean} [options.add_special_tokens=true] Whether or not to add the special tokens associated with the corresponding model.
   * @param {boolean|null} [options.return_token_type_ids=null] Whether to return token_type_ids.
   * @returns {number[]} An array of token IDs representing the encoded text(s).
   */
  encode(e, { text_pair: t = null, add_special_tokens: r = !0, return_token_type_ids: n = null } = {}) {
    return this._tokenizer.encode(e, {
      text_pair: t,
      add_special_tokens: r,
      return_token_type_ids: n
    }).ids;
  }
  /**
   * Decode a batch of tokenized sequences.
   * @param {number[][]|Tensor} batch List/Tensor of tokenized input sequences.
   * @param {Object} decode_args (Optional) Object with decoding arguments.
   * @returns {string[]} List of decoded sequences.
   */
  batch_decode(e, t = {}) {
    return e instanceof V && (e = e.tolist()), e.map((r) => this.decode(r, t));
  }
  /**
   * Decodes a sequence of token IDs back to a string.
   *
   * @param {number[]|bigint[]|Tensor} token_ids List/Tensor of token IDs to decode.
   * @param {Object} [decode_args={}]
   * @param {boolean} [decode_args.skip_special_tokens=false] If true, special tokens are removed from the output string.
   * @param {boolean} [decode_args.clean_up_tokenization_spaces=true] If true, spaces before punctuation and abbreviated forms are removed.
   *
   * @returns {string} The decoded string.
   * @throws {Error} If `token_ids` is not a non-empty array of integers.
   */
  decode(e, t = {}) {
    if (e instanceof V && (e = dl(e)), !Array.isArray(e) || e.length === 0 || !NM(e[0]))
      throw Error("token_ids must be a non-empty array of integers.");
    return this.decode_single(e, t);
  }
  /**
   * Decode a single list of token ids to a string.
   * @param {number[]|bigint[]} token_ids List of token ids to decode
   * @param {Object} decode_args Optional arguments for decoding
   * @param {boolean} [decode_args.skip_special_tokens=false] Whether to skip special tokens during decoding
   * @param {boolean|null} [decode_args.clean_up_tokenization_spaces=null] Whether to clean up tokenization spaces during decoding.
   * If null, the value is set to `this.decoder.cleanup` if it exists, falling back to `this.clean_up_tokenization_spaces` if it exists, falling back to `true`.
   * @returns {string} The decoded string
   */
  decode_single(e, { skip_special_tokens: t = !1, clean_up_tokenization_spaces: r = null }) {
    return this._tokenizer.decode(e, {
      skip_special_tokens: t,
      clean_up_tokenization_spaces: r
    });
  }
  /**
   * Retrieve the chat template string used for tokenizing chat messages. This template is used
   * internally by the `apply_chat_template` method and can also be used externally to retrieve the model's chat
   * template for better generation tracking.
   *
   * @param {Object} options An optional object containing the following properties:
   * @param {string|null} [options.chat_template=null]
   * A Jinja template or the name of a template to use for this conversion.
   * It is usually not necessary to pass anything to this argument,
   * as the model's template will be used by default.
   * @param {Object[]} [options.tools=null]
   * A list of tools (callable functions) that will be accessible to the model. If the template does not
   * support function calling, this argument will have no effect. Each tool should be passed as a JSON Schema,
   * giving the name, description and argument types for the tool. See our
   * [chat templating guide](https://huggingface.co/docs/transformers/main/en/chat_templating#automated-function-conversion-for-tool-use)
   * for more information.
   * @returns {string} The chat template string.
   */
  get_chat_template({ chat_template: e = null, tools: t = null } = {}) {
    if (this.chat_template && typeof this.chat_template == "object") {
      let r = this.chat_template;
      if (e !== null && Object.hasOwn(r, e))
        e = r[e];
      else if (e === null)
        if (t !== null && "tool_use" in r)
          e = r.tool_use;
        else if ("default" in r)
          e = r.default;
        else
          throw Error(
            `This model has multiple chat templates with no default specified! Please either pass a chat template or the name of the template you wish to use to the 'chat_template' argument. Available template names are ${Object.keys(r).sort()}.`
          );
    } else if (e === null)
      if (this.chat_template)
        e = this.chat_template;
      else
        throw Error(
          "Cannot use apply_chat_template() because tokenizer.chat_template is not set and no template argument was passed! For information about writing templates and setting the tokenizer.chat_template attribute, please see the documentation at https://huggingface.co/docs/transformers/main/en/chat_templating"
        );
    return e;
  }
  /**
   * Converts a list of message objects with `"role"` and `"content"` keys to a list of token
   * ids. This method is intended for use with chat models, and will read the tokenizer's chat_template attribute to
   * determine the format and control tokens to use when converting.
   *
   * See the [chat templating guide](https://huggingface.co/docs/transformers/chat_templating) for more information.
   *
   * **Example:** Applying a chat template to a conversation.
   *
   * ```javascript
   * import { AutoTokenizer } from "@huggingface/transformers";
   *
   * const tokenizer = await AutoTokenizer.from_pretrained("Xenova/mistral-tokenizer-v1");
   *
   * const chat = [
   *   { "role": "user", "content": "Hello, how are you?" },
   *   { "role": "assistant", "content": "I'm doing great. How can I help you today?" },
   *   { "role": "user", "content": "I'd like to show off how chat templating works!" },
   * ]
   *
   * const text = tokenizer.apply_chat_template(chat, { tokenize: false });
   * // "<s>[INST] Hello, how are you? [/INST]I'm doing great. How can I help you today?</s> [INST] I'd like to show off how chat templating works! [/INST]"
   *
   * const input_ids = tokenizer.apply_chat_template(chat, { tokenize: true, return_tensor: false });
   * // [1, 733, 16289, 28793, 22557, 28725, 910, 460, 368, 28804, 733, 28748, 16289, 28793, 28737, 28742, 28719, 2548, 1598, 28723, 1602, 541, 315, 1316, 368, 3154, 28804, 2, 28705, 733, 16289, 28793, 315, 28742, 28715, 737, 298, 1347, 805, 910, 10706, 5752, 1077, 3791, 28808, 733, 28748, 16289, 28793]
   * ```
   *
   * @param {Message[]} conversation A list of message objects with `"role"` and `"content"` keys,
   * representing the chat history so far.
   * @template {boolean} [TTokenize=true]
   * @template {boolean} [TReturnTensor=true]
   * @template {boolean} [TReturnDict=true]
   * @param {ApplyChatTemplateOptions<TTokenize, TReturnTensor, TReturnDict>} [options] Options controlling
   * template rendering and tokenization.
   * @returns {ApplyChatTemplateReturn<TTokenize, TReturnTensor, TReturnDict>} The tokenized output.
   */
  apply_chat_template(e, t = (
    /** @type {ApplyChatTemplateOptions<TTokenize, TReturnTensor, TReturnDict>} */
    {}
  )) {
    let {
      tools: r = null,
      documents: n = null,
      chat_template: s = null,
      add_generation_prompt: a = !1,
      tokenize: o = (
        /** @type {TTokenize} */
        !0
      ),
      padding: i = !1,
      truncation: l = !1,
      max_length: c = null,
      return_tensor: d = (
        /** @type {TReturnTensor} */
        !0
      ),
      return_dict: h = (
        /** @type {TReturnDict} */
        !0
      ),
      tokenizer_kwargs: _ = {},
      ...p
    } = t;
    if (s = this.get_chat_template({ chat_template: s, tools: r }), typeof s != "string")
      throw Error(`chat_template must be a string, but got ${typeof s}`);
    let w = this._compiled_template_cache.get(s);
    w === void 0 && (w = new lT(s), this._compiled_template_cache.set(s, w));
    let v = /* @__PURE__ */ Object.create(null);
    for (let b of KT) {
      let k = Zr(this.config, b);
      k && (v[b] = k);
    }
    let y = w.render({
      messages: e,
      add_generation_prompt: a,
      tools: r,
      documents: n,
      ...v,
      ...p
    });
    if (o) {
      let b = this._call(y, {
        add_special_tokens: !1,
        padding: i,
        truncation: l,
        max_length: c,
        return_tensor: d,
        ..._
      });
      return (
        /** @type {ApplyChatTemplateReturn<TTokenize, TReturnTensor, TReturnDict>} */
        h ? b : b.input_ids
      );
    }
    return (
      /** @type {ApplyChatTemplateReturn<TTokenize, TReturnTensor, TReturnDict>} */
      y
    );
  }
};
function hl(e, t, r, n) {
  if (!("language_codes" in e) || !Array.isArray(e.language_codes))
    throw new Error(
      "Tokenizer must have `language_codes` attribute set and it should be an array of language ids."
    );
  if (!("languageRegex" in e) || !(e.languageRegex instanceof RegExp))
    throw new Error("Tokenizer must have `languageRegex` attribute set and it should be a regular expression.");
  if (!("lang_to_token" in e) || typeof e.lang_to_token != "function")
    throw new Error("Tokenizer must have `lang_to_token` attribute set and it should be a function.");
  let s = n.src_lang, a = n.tgt_lang;
  if (!e.language_codes.includes(a))
    throw new Error(
      `Target language code "${a}" is not valid. Must be one of: {${e.language_codes.join(", ")}}`
    );
  if (s !== void 0) {
    if (!e.language_codes.includes(s))
      throw new Error(
        `Source language code "${s}" is not valid. Must be one of: {${e.language_codes.join(", ")}}`
      );
    let o = e._tokenizer.post_processor?.config;
    if (o && "single" in o) {
      for (let i of o.single)
        if ("SpecialToken" in i && e.languageRegex.test(i.SpecialToken.id)) {
          i.SpecialToken.id = e.lang_to_token(s);
          break;
        }
    }
  }
  return n.forced_bos_token_id = e._tokenizer.token_to_id(e.lang_to_token(a)), e._call(t, r);
}
var Pm = {};
fs(Pm, {
  AlbertTokenizer: () => tE,
  AutoTokenizer: () => Ee,
  BartTokenizer: () => rE,
  BertTokenizer: () => nE,
  BlenderbotSmallTokenizer: () => sE,
  BlenderbotTokenizer: () => aE,
  BloomTokenizer: () => oE,
  CLIPTokenizer: () => lE,
  CamembertTokenizer: () => iE,
  CodeGenTokenizer: () => uE,
  CodeLlamaTokenizer: () => cE,
  CohereAsrTokenizer: () => hE,
  CohereTokenizer: () => dE,
  ConvBertTokenizer: () => fE,
  DebertaTokenizer: () => pE,
  DebertaV2Tokenizer: () => _E,
  DistilBertTokenizer: () => mE,
  ElectraTokenizer: () => gE,
  EsmTokenizer: () => wE,
  FalconTokenizer: () => vE,
  GPT2Tokenizer: () => ME,
  GPTNeoXTokenizer: () => bE,
  GemmaTokenizer: () => yE,
  HerbertTokenizer: () => xE,
  LlamaTokenizer: () => kE,
  M2M100Tokenizer: () => TE,
  MBart50Tokenizer: () => AE,
  MBartTokenizer: () => Fm,
  MPNetTokenizer: () => PE,
  MarianTokenizer: () => EE,
  MgpstrTokenizer: () => CE,
  MobileBertTokenizer: () => SE,
  NllbTokenizer: () => FE,
  NougatTokenizer: () => IE,
  PreTrainedTokenizer: () => ie,
  Qwen2Tokenizer: () => LE,
  RoFormerTokenizer: () => NE,
  RobertaTokenizer: () => OE,
  SiglipTokenizer: () => DE,
  SpeechT5Tokenizer: () => zE,
  SqueezeBertTokenizer: () => BE,
  T5Tokenizer: () => RE,
  TokenizersBackend: () => ie,
  VitsTokenizer: () => GE,
  Wav2Vec2CTCTokenizer: () => VE,
  WhisperTokenizer: () => HE,
  XLMRobertaTokenizer: () => QE,
  XLMTokenizer: () => XE
});
var tE = class extends ie {
  return_token_type_ids = !0;
}, rE = class extends ie {
}, nE = class extends ie {
  return_token_type_ids = !0;
}, sE = class extends ie {
}, aE = class extends ie {
}, oE = class extends ie {
}, iE = class extends ie {
}, lE = class extends ie {
}, cE = class extends ie {
}, uE = class extends ie {
}, dE = class extends ie {
}, hE = class extends ie {
}, fE = class extends ie {
  return_token_type_ids = !0;
}, _E = class extends ie {
  return_token_type_ids = !0;
}, pE = class extends ie {
  return_token_type_ids = !0;
}, mE = class extends ie {
}, gE = class extends ie {
  return_token_type_ids = !0;
}, wE = class extends ie {
}, vE = class extends ie {
}, yE = class extends ie {
}, bE = class extends ie {
}, ME = class extends ie {
}, xE = class extends ie {
  return_token_type_ids = !0;
}, kE = class extends ie {
  padding_side = "left";
}, TE = class extends ie {
  constructor(e, t) {
    super(e, t), this.languageRegex = /^__[a-z]{2,3}__$/, this.language_codes = this.all_special_tokens.filter((r) => this.languageRegex.test(r)).map((r) => r.slice(2, -2)), this.lang_to_token = (r) => `__${r}__`;
  }
  /**
   * Helper function to build translation inputs for an `M2M100Tokenizer`.
   * @param {string|string[]} raw_inputs The text to tokenize.
   * @param {Object} tokenizer_options Options to be sent to the tokenizer
   * @param {Object} generate_kwargs Generation options.
   * @returns {Object} Object to be passed to the model.
   */
  _build_translation_inputs(e, t, r) {
    return hl(this, e, t, r);
  }
}, EE = class extends ie {
  /**
   * Create a new MarianTokenizer instance.
   * @param {Object} tokenizerJSON The JSON of the tokenizer.
   * @param {Object} tokenizerConfig The config of the tokenizer.
   */
  constructor(e, t) {
    super(e, t), this.languageRegex = /^(>>\w+<<)\s*/g, this.supported_language_codes = Array.from(this.get_vocab().keys()).filter((r) => this.languageRegex.test(r)), le.warn(
      'WARNING: `MarianTokenizer` is not yet supported by Hugging Face\'s "fast" tokenizers library. Therefore, you may experience slightly inaccurate results.'
    );
  }
  /**
   * Encodes a single text. Overriding this method is necessary since the language codes
   * must be removed before encoding with sentencepiece model.
   * @see https://github.com/huggingface/transformers/blob/12d51db243a00726a548a43cc333390ebae731e3/src/transformers/models/marian/tokenization_marian.py#L204-L213
   *
   * @param {string|null} text The text to encode.
   * @returns {string[]|null} The encoded tokens.
   */
  _encode_text(e) {
    if (e === null) return null;
    let [t, ...r] = e.trim().split(this.languageRegex);
    if (r.length === 0)
      return super._encode_text(t);
    if (r.length === 2) {
      let [n, s] = r;
      return this.supported_language_codes.includes(n) || le.warn(
        `Unsupported language code "${n}" detected, which may lead to unexpected behavior. Should be one of: ${JSON.stringify(this.supported_language_codes)}`
      ), er([n], super._encode_text(s));
    }
  }
}, Fm = class extends ie {
  constructor(e, t) {
    super(e, t), this.languageRegex = /^[a-z]{2}_[A-Z]{2}$/, this.language_codes = this.all_special_tokens.filter((r) => this.languageRegex.test(r)).map((r) => r), this.lang_to_token = (r) => r;
  }
  /**
   * Helper function to build translation inputs for an `MBartTokenizer`.
   * @param {string|string[]} raw_inputs The text to tokenize.
   * @param {Object} tokenizer_options Options to be sent to the tokenizer
   * @param {Object} generate_kwargs Generation options.
   * @returns {Object} Object to be passed to the model.
   */
  _build_translation_inputs(e, t, r) {
    return hl(this, e, t, r);
  }
}, AE = class extends Fm {
}, CE = class extends ie {
}, SE = class extends ie {
  return_token_type_ids = !0;
}, PE = class extends ie {
}, FE = class extends ie {
  constructor(e, t) {
    super(e, t), this.languageRegex = /^[a-z]{3}_[A-Z][a-z]{3}$/, this.language_codes = this.all_special_tokens.filter((r) => this.languageRegex.test(r)), this.lang_to_token = (r) => r;
  }
  /**
   * Helper function to build translation inputs for an `NllbTokenizer`.
   * @param {string|string[]} raw_inputs The text to tokenize.
   * @param {Object} tokenizer_options Options to be sent to the tokenizer
   * @param {Object} generate_kwargs Generation options.
   * @returns {Object} Object to be passed to the model.
   */
  _build_translation_inputs(e, t, r) {
    return hl(this, e, t, r);
  }
}, IE = class extends ie {
}, LE = class extends ie {
}, OE = class extends ie {
}, NE = class extends ie {
  return_token_type_ids = !0;
}, DE = class extends ie {
}, zE = class extends ie {
}, BE = class extends ie {
  return_token_type_ids = !0;
}, RE = class extends ie {
}, $E = class extends Gt {
  /** @type {Decoder['decode_chain']} */
  decode_chain(e) {
    let t = "";
    for (let r = 1; r < e.length; r += 2)
      t += e[r];
    return [t];
  }
}, GE = class extends ie {
  constructor(e, t) {
    super(e, t), this._tokenizer.decoder = new $E({ type: "VitsDecoder" });
  }
}, VE = class extends ie {
}, Im = [
  ["en", "english"],
  ["zh", "chinese"],
  ["de", "german"],
  ["es", "spanish"],
  ["ru", "russian"],
  ["ko", "korean"],
  ["fr", "french"],
  ["ja", "japanese"],
  ["pt", "portuguese"],
  ["tr", "turkish"],
  ["pl", "polish"],
  ["ca", "catalan"],
  ["nl", "dutch"],
  ["ar", "arabic"],
  ["sv", "swedish"],
  ["it", "italian"],
  ["id", "indonesian"],
  ["hi", "hindi"],
  ["fi", "finnish"],
  ["vi", "vietnamese"],
  ["he", "hebrew"],
  ["uk", "ukrainian"],
  ["el", "greek"],
  ["ms", "malay"],
  ["cs", "czech"],
  ["ro", "romanian"],
  ["da", "danish"],
  ["hu", "hungarian"],
  ["ta", "tamil"],
  ["no", "norwegian"],
  ["th", "thai"],
  ["ur", "urdu"],
  ["hr", "croatian"],
  ["bg", "bulgarian"],
  ["lt", "lithuanian"],
  ["la", "latin"],
  ["mi", "maori"],
  ["ml", "malayalam"],
  ["cy", "welsh"],
  ["sk", "slovak"],
  ["te", "telugu"],
  ["fa", "persian"],
  ["lv", "latvian"],
  ["bn", "bengali"],
  ["sr", "serbian"],
  ["az", "azerbaijani"],
  ["sl", "slovenian"],
  ["kn", "kannada"],
  ["et", "estonian"],
  ["mk", "macedonian"],
  ["br", "breton"],
  ["eu", "basque"],
  ["is", "icelandic"],
  ["hy", "armenian"],
  ["ne", "nepali"],
  ["mn", "mongolian"],
  ["bs", "bosnian"],
  ["kk", "kazakh"],
  ["sq", "albanian"],
  ["sw", "swahili"],
  ["gl", "galician"],
  ["mr", "marathi"],
  ["pa", "punjabi"],
  ["si", "sinhala"],
  ["km", "khmer"],
  ["sn", "shona"],
  ["yo", "yoruba"],
  ["so", "somali"],
  ["af", "afrikaans"],
  ["oc", "occitan"],
  ["ka", "georgian"],
  ["be", "belarusian"],
  ["tg", "tajik"],
  ["sd", "sindhi"],
  ["gu", "gujarati"],
  ["am", "amharic"],
  ["yi", "yiddish"],
  ["lo", "lao"],
  ["uz", "uzbek"],
  ["fo", "faroese"],
  ["ht", "haitian creole"],
  ["ps", "pashto"],
  ["tk", "turkmen"],
  ["nn", "nynorsk"],
  ["mt", "maltese"],
  ["sa", "sanskrit"],
  ["lb", "luxembourgish"],
  ["my", "myanmar"],
  ["bo", "tibetan"],
  ["tl", "tagalog"],
  ["mg", "malagasy"],
  ["as", "assamese"],
  ["tt", "tatar"],
  ["haw", "hawaiian"],
  ["ln", "lingala"],
  ["ha", "hausa"],
  ["ba", "bashkir"],
  ["jw", "javanese"],
  ["su", "sundanese"]
], oa = new Map(Im), UE = new Map([
  ...Im.map(([e, t]) => [t, e]),
  ["burmese", "my"],
  ["valencian", "ca"],
  ["flemish", "nl"],
  ["haitian", "ht"],
  ["letzeburgesch", "lb"],
  ["pushto", "ps"],
  ["panjabi", "pa"],
  ["moldavian", "ro"],
  ["moldovan", "ro"],
  ["sinhalese", "si"],
  ["castilian", "es"]
]);
function jE(e) {
  e = e.toLowerCase();
  let t = UE.get(e);
  if (t === void 0) {
    let r = e.match(/^<\|([a-z]{2})\|>$/);
    if (r && (e = r[1]), oa.has(e))
      t = e;
    else {
      let s = e.length === 2 ? oa.keys() : oa.values();
      throw new Error(
        `Language "${e}" is not supported. Must be one of: ${JSON.stringify(Array.from(s))}`
      );
    }
  }
  return t;
}
var WE = "\\p{P}\\u0021-\\u002F\\u003A-\\u0040\\u005B-\\u0060\\u007B-\\u007E", _p = new RegExp(`^[${WE}]+$`, "gu"), qE = 0.1, HE = class extends ie {
  get timestamp_begin() {
    return this._tokenizer.token_to_id("<|notimestamps|>") + 1;
  }
  /**
   * Decodes automatic speech recognition (ASR) sequences.
   * @param {Array<{tokens: bigint[], token_timestamps?: number[], stride: number[]}>} sequences The sequences to decode.
   * @param {Object} options The options to use for decoding.
   * @returns {Array<string|{chunks?: undefined|Array<{language: string|null, timestamp: Array<number|null>, text: string}>}>} The decoded sequences.
   */
  _decode_asr(e, { return_timestamps: t = !1, return_language: r = !1, time_precision: n = null, force_full_sequences: s = !0 } = {}) {
    if (n === null)
      throw Error("Must specify time_precision");
    let a = null, o = t === "word";
    function i() {
      return { language: a, timestamp: [null, null], text: "" };
    }
    let l = [], c = i(), d = 0, h = this.timestamp_begin, p = h + 1500, w = [], v = [], y = !1, b = null, k = new Set(this.all_special_ids);
    for (let C of e) {
      let N = C.tokens, M = o ? C.token_timestamps : null, $ = null, R = h;
      if ("stride" in C) {
        let [H, q, B] = C.stride;
        if (d -= q, b = H - B, q && (R = q / n + h), B)
          for (let P = N.length - 1; P >= 0; --P) {
            let X = Number(N[P]);
            if (X >= h) {
              if ($ !== null && (X - h) * n < b)
                break;
              $ = X;
            }
          }
      }
      let W = [], Q = [];
      for (let H = 0; H < N.length; ++H) {
        let q = Number(N[H]);
        if (k.has(q)) {
          let B = this.decode([q]), P = oa.get(B.slice(2, -2));
          if (P !== void 0) {
            if (a !== null && P !== a && !t) {
              w.push(W);
              let X = this.findLongestCommonSequence(w)[0], ce = this.decode(X);
              c.text = ce, l.push(c), w = [], W = [], c = i();
            }
            a = c.language = P;
          }
        } else if (q >= h && q <= p) {
          let B = (q - h) * n + d, P = as(B, 2);
          if ($ !== null && q >= $)
            y = !0;
          else if (y || w.length > 0 && q < R)
            y = !1;
          else if (c.timestamp[0] === null)
            c.timestamp[0] = P;
          else if (P !== c.timestamp[0]) {
            c.timestamp[1] = P, w.push(W), o && v.push(Q);
            let [X, ce] = this.findLongestCommonSequence(
              w,
              v
            ), J = this.decode(X);
            if (c.text = J, o && (c.words = this.collateWordTimestamps(
              X,
              ce,
              a
            ), c.words.length > 0 && c.timestamp[1] !== null))
              for (let ne of c.words)
                ne.timestamp[1] > c.timestamp[1] && c.timestamp[1] >= ne.timestamp[0] && (ne.timestamp[1] = c.timestamp[1]);
            l.push(c), w = [], W = [], v = [], Q = [], c = i();
          }
        } else if (W.push(q), o) {
          let B = as(M[H] + d, 2), P;
          if (H + 1 < M.length) {
            P = as(M[H + 1] + d, 2);
            let X = this.decode([q]);
            _p.test(X) && (P = as(Math.min(B + n, P), 2));
          } else
            P = null;
          Q.push([B, P]);
        }
      }
      if ("stride" in C) {
        let [H, q, B] = C.stride;
        d += H - B;
      }
      W.length > 0 ? (w.push(W), o && v.push(Q)) : w.every((H) => H.length === 0) && (c = i(), w = [], W = [], v = [], Q = []);
    }
    if (w.length > 0) {
      if (s && t)
        throw new Error(
          "Whisper did not predict an ending timestamp, which can happen if audio is cut off in the middle of a word. Also make sure WhisperTimeStampLogitsProcessor was used during generation."
        );
      let [C, N] = this.findLongestCommonSequence(
        w,
        v
      ), M = this.decode(C);
      c.text = M, o && (c.words = this.collateWordTimestamps(C, N, a)), l.push(c);
    }
    let A = /* @__PURE__ */ Object.create(null), E = l.map((C) => C.text).join("");
    if (t || r) {
      for (let C = 0; C < l.length; ++C) {
        let N = l[C];
        t || delete N.timestamp, r || delete N.language;
      }
      if (o) {
        let C = [];
        for (let N of l)
          for (let M of N.words)
            C.push(M);
        A = { chunks: C };
      } else
        A = { chunks: l };
    }
    return [E, A];
  }
  /**
   * Finds the longest common sequence among the provided sequences.
   * @param {number[][]} sequences An array of sequences of token ids to compare.
   * @returns {number[][]} The longest common sequence found.
   * @throws {Error} If there is a bug within the function.
   * @private
   */
  findLongestCommonSequence(e, t = null) {
    let r = e[0], n = r.length, s = [], a = Array.isArray(t) && t.length > 0, o = a ? [] : null, i = a ? t[0] : null;
    for (let l = 1; l < e.length; ++l) {
      let c = e[l], d = 0, h = [n, n, 0, 0], _ = c.length;
      for (let A = 1; A < n + _; ++A) {
        let E = Math.max(0, n - A), C = Math.min(n, n + _ - A), N = r.slice(E, C), M = Math.max(0, A - n), $ = Math.min(_, A), R = c.slice(M, $);
        if (N.length !== R.length)
          throw new Error(
            "There is a bug within whisper `decode_asr` function, please report it. Dropping to prevent bad inference."
          );
        let W;
        a ? W = N.filter(
          (q, B) => q === R[B] && i[E + B][0] - qE <= t[l][M + B][0]
        ).length : W = N.filter((q, B) => q === R[B]).length;
        let Q = A / 1e4, H = W / A + Q;
        W > 1 && H > d && (d = H, h = [E, C, M, $]);
      }
      let [p, w, v, y] = h, b = Math.floor((w + p) / 2), k = Math.floor((y + v) / 2);
      if (a && d === 0 && n > 0) {
        let A = i[n - 1][0], E = t[l].findIndex((C) => C[0] >= A);
        k = E === -1 ? c.length : E;
      }
      s.push(...r.slice(0, b)), r = c.slice(k), n = r.length, a && (o.push(...i.slice(0, b)), i = t[l].slice(k));
    }
    return s.push(...r), a ? (o.push(...i), [s, o]) : [s, []];
  }
  /** @private */
  collateWordTimestamps(e, t, r) {
    let [n, s, a] = this.combineTokensIntoWords(e, r), o = [];
    for (let i = 0; i < n.length; ++i) {
      let l = a[i];
      o.push({
        text: n[i],
        timestamp: [t[l.at(0)][0], t[l.at(-1)][1]]
      });
    }
    return o;
  }
  /**
   * Groups tokens by word. Returns a tuple containing a list of strings with the words,
   * and a list of `token_id` sequences with the tokens making up each word.
   * @param {number[]} tokens
   * @param {string} [language]
   * @param {string} prepend_punctionations
   * @param {string} append_punctuations
   *
   * @private
   */
  combineTokensIntoWords(e, t, r = `"'\u201C\xA1\xBF([{-`, n = `"'.\u3002,\uFF0C!\uFF01?\uFF1F:\uFF1A\u201D)]}\u3001`) {
    t = t ?? "english";
    let s, a, o;
    return ["chinese", "japanese", "thai", "lao", "myanmar"].includes(t) ? [s, a, o] = this.splitTokensOnUnicode(e) : [s, a, o] = this.splitTokensOnSpaces(e), this.mergePunctuations(s, a, o, r, n);
  }
  /** @type {PreTrainedTokenizer['decode']} */
  decode(e, t) {
    let r;
    return t?.decode_with_timestamps ? (e instanceof V && (e = dl(e)), r = this.decodeWithTimestamps(e, t)) : r = super.decode(e, t), r;
  }
  /**
   * @param {number[]|bigint[]} token_ids List of token IDs to decode.
   * @param {Object} decode_args Optional arguments for decoding
   * @private
   */
  decodeWithTimestamps(e, t) {
    let r = t?.time_precision ?? 0.02, n = this.all_special_ids.at(-1) + 1, s = [[]];
    for (let a of e)
      if (a = Number(a), a >= n) {
        let o = ((a - n) * r).toFixed(2);
        s.push(`<|${o}|>`), s.push([]);
      } else
        s[s.length - 1].push(a);
    return s = s.map((a) => typeof a == "string" ? a : super.decode(a, t)), s.join("");
  }
  /**
   * Combine tokens into words by splitting at any position where the tokens are decoded as valid unicode points.
   * @param {number[]} tokens
   * @returns {*}
   * @private
   */
  splitTokensOnUnicode(e) {
    let t = this.decode(e, {
      // @ts-ignore
      decode_with_timestamps: !0
    }), r = "\uFFFD", n = [], s = [], a = [], o = [], i = [], l = 0;
    for (let c = 0; c < e.length; ++c) {
      let d = e[c];
      o.push(d), i.push(c);
      let h = this.decode(o, {
        // @ts-ignore
        decode_with_timestamps: !0
      });
      (!h.includes(r) || t[l + h.indexOf(r)] === r) && (n.push(h), s.push(o), a.push(i), o = [], i = [], l += h.length);
    }
    return [n, s, a];
  }
  /**
   * Combine tokens into words by splitting at whitespace and punctuation tokens.
   * @param {number[]} tokens
   * @private
   */
  splitTokensOnSpaces(e) {
    let [t, r, n] = this.splitTokensOnUnicode(e), s = [], a = [], o = [];
    for (let i = 0; i < t.length; ++i) {
      let l = t[i], c = r[i], d = n[i], h = c[0] >= this._tokenizer.token_to_id("<|endoftext|>"), _ = l.startsWith(" "), p = l.trim(), w = _p.test(p);
      if (h || _ || w || s.length === 0)
        s.push(l), a.push(c), o.push(d);
      else {
        let v = s.length - 1;
        s[v] += l, a[v].push(...c), o[v].push(...d);
      }
    }
    return [s, a, o];
  }
  /**
   * Merges punctuation tokens with neighboring words.
   * @param {string[]} words
   * @param {number[][]} tokens
   * @param {number[][]} indices
   * @param {string} prepended
   * @param {string} appended
   * @private
   */
  mergePunctuations(e, t, r, n, s) {
    let a = structuredClone(e), o = structuredClone(t), i = structuredClone(r), l = a.length - 2, c = a.length - 1;
    for (; l >= 0; )
      a[l].startsWith(" ") && n.includes(a[l].trim()) ? (a[c] = a[l] + a[c], o[c] = er(o[l], o[c]), i[c] = er(i[l], i[c]), a[l] = "", o[l] = [], i[l] = []) : c = l, --l;
    for (l = 0, c = 1; c < a.length; )
      !a[l].endsWith(" ") && s.includes(a[c]) ? (a[l] += a[c], o[l] = er(o[l], o[c]), i[l] = er(i[l], i[c]), a[c] = "", o[c] = [], i[c] = []) : l = c, ++c;
    return [
      a.filter((d) => d),
      o.filter((d) => d.length > 0),
      i.filter((d) => d.length > 0)
    ];
  }
}, QE = class extends ie {
}, XE = class extends ie {
  return_token_type_ids = !0;
  constructor(e, t) {
    super(e, t), le.warn(
      'WARNING: `XLMTokenizer` is not yet supported by Hugging Face\'s "fast" tokenizers library. Therefore, you may experience slightly inaccurate results.'
    );
  }
}, Ee = class {
  /**
   * Instantiate one of the tokenizer classes of the library from a pretrained model.
   *
   * The tokenizer class to instantiate is selected based on the `tokenizer_class` property of the config object
   * (either passed as an argument or loaded from `pretrained_model_name_or_path` if possible)
   *
   * @param {string} pretrained_model_name_or_path The name or path of the pretrained model. Can be either:
   * - A string, the *model id* of a pretrained tokenizer hosted inside a model repo on huggingface.co.
   *   Valid model ids can be located at the root-level, like `bert-base-uncased`, or namespaced under a
   *   user or organization name, like `dbmdz/bert-base-german-cased`.
   * - A path to a *directory* containing tokenizer files, e.g., `./my_model_directory/`.
   * @param {import('../../tokenization_utils.js').PretrainedTokenizerOptions} options Additional options for loading the tokenizer.
   *
   * @returns {Promise<PreTrainedTokenizer>} The loaded tokenizer.
   */
  static async from_pretrained(e, { progress_callback: t = null, config: r = null, cache_dir: n = null, local_files_only: s = !1, revision: a = "main" } = {}) {
    let [o, i] = await Sm(e, {
      progress_callback: t,
      config: r,
      cache_dir: n,
      local_files_only: s,
      revision: a
    }), l = i.tokenizer_class?.replace(/Fast$/, "") ?? "PreTrainedTokenizer", c = Pm[l];
    return c || (le.warn(`Unknown tokenizer class "${l}", attempting to construct from base class.`), c = ie), new c(o, i);
  }
}, Ca = "https://github.com/huggingface/transformers.js/issues/new/choose", Lm = "preprocessor_config.json", ds = "preprocessor_config.json", Om = "processor_config.json", Nm = "chat_template.jinja", Ae = class extends mt {
  static classes = ["image_processor_class", "tokenizer_class", "feature_extractor_class"];
  static uses_processor_config = !1;
  static uses_chat_template_file = !1;
  /**
   * Create a processor from parsed config and its component preprocessors.
   * @param {Object} config Processor configuration.
   * @param {Record<string, Object>} components Loaded tokenizer, image processor, and/or feature extractor.
   * @param {string|null} chat_template Optional chat template loaded from the model repo.
   */
  constructor(e, t, r) {
    super(), this.config = e, this.components = t, this.chat_template = r;
  }
  /**
   * The image processor used by this processor, if any.
   * @returns {import('./image_processors_utils.js').ImageProcessor|undefined} The image processor of the processor, if it exists.
   */
  get image_processor() {
    return this.components.image_processor;
  }
  /**
   * The tokenizer used by this processor, if any.
   * @returns {PreTrainedTokenizer|undefined} The tokenizer of the processor, if it exists.
   */
  get tokenizer() {
    return this.components.tokenizer;
  }
  /**
   * The feature extractor used by this processor, if any.
   * @returns {import('./feature_extraction_utils.js').FeatureExtractor|undefined} The feature extractor of the processor, if it exists.
   */
  get feature_extractor() {
    return this.components.feature_extractor;
  }
  /**
   * Delegates to the underlying tokenizer's `apply_chat_template`.
   * @param {Parameters<PreTrainedTokenizer['apply_chat_template']>[0]} messages
   * @param {Parameters<PreTrainedTokenizer['apply_chat_template']>[1]} options
   * @returns {ReturnType<PreTrainedTokenizer['apply_chat_template']>}
   */
  apply_chat_template(e, t = {}) {
    if (!this.tokenizer)
      throw new Error("Unable to apply chat template without a tokenizer.");
    return this.tokenizer.apply_chat_template(e, {
      tokenize: !1,
      // default to false
      chat_template: this.chat_template ?? void 0,
      ...t
    });
  }
  /**
   * Decode a batch of tokenized sequences via the underlying tokenizer.
   * @param {Parameters<PreTrainedTokenizer['batch_decode']>} args
   * @returns {ReturnType<PreTrainedTokenizer['batch_decode']>}
   */
  batch_decode(...e) {
    if (!this.tokenizer)
      throw new Error("Unable to decode without a tokenizer.");
    return this.tokenizer.batch_decode(...e);
  }
  /**
   * Decode a single tokenized sequence via the underlying tokenizer.
   * @param {Parameters<PreTrainedTokenizer['decode']>} args
   * @returns {ReturnType<PreTrainedTokenizer['decode']>}
   */
  decode(...e) {
    if (!this.tokenizer)
      throw new Error("Unable to decode without a tokenizer.");
    return this.tokenizer.decode(...e);
  }
  /**
   * Calls the feature_extractor function with the given input.
   * @param {any} input The input to extract features from.
   * @param {...any} args Additional arguments.
   * @returns {Promise<any>} A Promise that resolves with the extracted features.
   */
  async _call(e, ...t) {
    for (let r of [this.image_processor, this.feature_extractor, this.tokenizer])
      if (r)
        return r(e, ...t);
    throw new Error("No image processor, feature extractor, or tokenizer found.");
  }
  /**
   * Instantiate one of the processor classes of the library from a pretrained model.
   *
   * The processor class to instantiate is selected based on the `image_processor_type` (or `feature_extractor_type`; legacy)
   * property of the config object (either passed as an argument or loaded from `pretrained_model_name_or_path` if possible)
   *
   * @param {string} pretrained_model_name_or_path The name or path of the pretrained model. Can be either:
   * - A string, the *model ID* of a pretrained processor hosted inside a model repo on huggingface.co.
   *   Valid model IDs can be located at the root level, like `bert-base-uncased`, or namespaced under a
   *   user or organization name, like `dbmdz/bert-base-german-cased`.
   * - A path to a *directory* containing processor files, e.g., `./my_model_directory/`.
   * @param {PretrainedProcessorOptions} options Additional options for loading the processor.
   *
   * @returns {Promise<Processor>} A new processor instance.
   */
  static async from_pretrained(e, t = {}) {
    let [r, n, s] = await Promise.all([
      // TODO:
      this.uses_processor_config ? sr(e, Om, !0, t) : {},
      Promise.all(
        this.classes.filter((a) => a in this).map(async (a) => {
          let o = await this[a].from_pretrained(e, t);
          return [a.replace(/_class$/, ""), o];
        })
      ).then(Object.fromEntries),
      this.uses_chat_template_file ? al(e, Nm, !0, t) : null
    ]);
    return new this(r, n, s);
  }
}, $i = {};
fs($i, {
  ChatterboxProcessor: () => E2,
  CohereAsrProcessor: () => C2,
  EmbeddingGemma2Processor: () => O2,
  EmbeddingGemma2VideoProcessor: () => Hm,
  Florence2Processor: () => FA,
  Gemma3Processor: () => IA,
  Gemma3nProcessor: () => LA,
  Gemma4Processor: () => qm,
  Glm46VProcessor: () => OA,
  GraniteSpeechProcessor: () => NA,
  GroundingDinoProcessor: () => zA,
  Idefics3Processor: () => bp,
  JinaCLIPProcessor: () => VA,
  Lfm2VlProcessor: () => UA,
  LlavaProcessor: () => jA,
  MgpstrProcessor: () => WA,
  MoonshineProcessor: () => qA,
  OwlViTProcessor: () => HA,
  PaliGemmaProcessor: () => XA,
  Phi3VProcessor: () => KA,
  PixtralProcessor: () => JA,
  Processor: () => Ae,
  PyAnnoteProcessor: () => ZA,
  Qwen2VLProcessor: () => vl,
  Qwen2_5_VLProcessor: () => fg,
  Qwen3VLProcessor: () => eC,
  Sam2Processor: () => pg,
  Sam2VideoProcessor: () => tC,
  SamProcessor: () => _g,
  SmolVLMProcessor: () => bp,
  SpeechT5Processor: () => rC,
  UltravoxProcessor: () => nC,
  VLChatProcessor: () => GA,
  VoxtralProcessor: () => iC,
  VoxtralRealtimeProcessor: () => uC,
  Wav2Vec2Processor: () => dC,
  Wav2Vec2ProcessorWithLM: () => hC,
  WhisperProcessor: () => fC
});
var dt = class extends mt {
  /**
   * Create a feature extractor from a parsed `preprocessor_config.json`.
   *
   * @param {Object} config The configuration for the feature extractor.
   */
  constructor(e) {
    super(), this.config = e;
  }
  /**
   * Instantiate one of the feature extractor classes of the library from a pretrained model.
   *
   * The feature extractor class to instantiate is selected based on the `feature_extractor_type` property of
   * the config object (either passed as an argument or loaded from `pretrained_model_name_or_path` if possible)
   *
   * @param {string} pretrained_model_name_or_path The name or path of the pretrained model. Can be either:
   * - A string, the *model ID* of a pretrained feature extractor hosted inside a model repo on huggingface.co.
   *   Valid model IDs can be located at the root level, like `bert-base-uncased`, or namespaced under a
   *   user or organization name, like `dbmdz/bert-base-german-cased`.
   * - A path to a *directory* containing feature_extractor files, e.g., `./my_model_directory/`.
   * @param {import('./utils/hub.js').PretrainedOptions} options Additional options for loading the feature_extractor.
   *
   * @returns {Promise<FeatureExtractor>} A new feature extractor instance.
   */
  static async from_pretrained(e, t = {}) {
    let r = await sr(e, Lm, !0, t);
    return new this(r);
  }
};
function ot(e, t) {
  if (!(e instanceof Float32Array || e instanceof Float64Array))
    throw new Error(
      `${t} expects input to be a Float32Array or a Float64Array, but got ${e?.constructor?.name ?? typeof e} instead. If using the feature extractor directly, remember to use \`load_audio(url, sampling_rate)\` to obtain the raw audio data of the file/url.`
    );
}
var fl = {};
fs(fl, {
  ASTFeatureExtractor: () => h2,
  ChatterboxFeatureExtractor: () => f2,
  ClapFeatureExtractor: () => _2,
  CohereAsrFeatureExtractor: () => m2,
  DacFeatureExtractor: () => Gm,
  EncodecFeatureExtractor: () => Rm,
  FeatureExtractor: () => dt,
  Gemma3nAudioFeatureExtractor: () => Vm,
  Gemma4AudioFeatureExtractor: () => Um,
  GraniteSpeechFeatureExtractor: () => g2,
  MoonshineFeatureExtractor: () => w2,
  ParakeetFeatureExtractor: () => $m,
  PyAnnoteFeatureExtractor: () => jm,
  SeamlessM4TFeatureExtractor: () => v2,
  SnacFeatureExtractor: () => y2,
  SpeechT5FeatureExtractor: () => b2,
  VoxtralRealtimeFeatureExtractor: () => k2,
  Wav2Vec2FeatureExtractor: () => M2,
  WeSpeakerFeatureExtractor: () => x2,
  WhisperFeatureExtractor: () => T2
});
var YE = () => {
}, KE = { fromWeb: YE }, JE = () => {
}, ZE = JE;
async function Dm(e, t) {
  if (me.IS_BROWSER_ENV) {
    if (me.IS_WEBWORKER_ENV)
      throw new Error("Unable to save a file from a Web Worker.");
    let r = URL.createObjectURL(t), n = document.createElement("a");
    n.href = r, n.download = e, n.click(), n.remove(), URL.revokeObjectURL(r);
  } else if (me.IS_FS_AVAILABLE) {
    let r = t.stream(), n = KE.fromWeb(r), s = xt.createWriteStream(e);
    await ZE(n, s);
  } else
    throw new Error("Unable to save because filesystem is disabled in this environment.");
}
async function e2(e, t) {
  if (typeof AudioContext > "u")
    throw Error(
      "Unable to load audio from path/URL since `AudioContext` is not available in your environment. Instead, audio data should be passed directly to the pipeline/processor. For more information and some example code, see https://huggingface.co/docs/transformers.js/guides/node-audio-processing."
    );
  let r = await (await cs(e)).arrayBuffer(), n = new AudioContext({ sampleRate: t });
  typeof t > "u" && le.warn(`No sampling rate provided, using default of ${n.sampleRate}Hz.`);
  let s = await n.decodeAudioData(r), a;
  if (s.numberOfChannels === 2) {
    let o = Math.sqrt(2), i = s.getChannelData(0), l = s.getChannelData(1);
    a = new Float32Array(i.length);
    for (let c = 0; c < s.length; ++c)
      a[c] = o * (i[c] + l[c]) / 2;
  } else
    a = s.getChannelData(0);
  return a;
}
async function t2(e, t) {
  return await e2(e, t);
}
function zm(e, t) {
  if (e < 1)
    return new Float64Array();
  if (e === 1)
    return new Float64Array([1]);
  let r = 1 - t, n = 2 * Math.PI / (e - 1), s = new Float64Array(e);
  for (let a = 0; a < e; ++a)
    s[a] = t - r * Math.cos(a * n);
  return s;
}
function pp(e) {
  return zm(e, 0.5);
}
function r2(e) {
  return zm(e, 0.54);
}
var n2 = {
  htk: (e) => 2595 * Math.log10(1 + e / 700),
  kaldi: (e) => 1127 * Math.log(1 + e / 700),
  slaney: (e, t = 1e3, r = 15, n = 27 / Math.log(6.4)) => e >= t ? r + Math.log(e / t) * n : 3 * e / 200
};
function Ti(e, t = "htk") {
  let r = n2[t];
  if (!r)
    throw new Error('mel_scale should be one of "htk", "slaney" or "kaldi".');
  return typeof e == "number" ? r(e) : e.map((n) => r(n));
}
var s2 = {
  htk: (e) => 700 * (10 ** (e / 2595) - 1),
  kaldi: (e) => 700 * (Math.exp(e / 1127) - 1),
  slaney: (e, t = 1e3, r = 15, n = Math.log(6.4) / 27) => e >= r ? t * Math.exp(n * (e - r)) : 200 * e / 3
};
function a2(e, t = "htk") {
  let r = s2[t];
  if (!r)
    throw new Error('mel_scale should be one of "htk", "slaney" or "kaldi".');
  return typeof e == "number" ? r(e) : e.map((n) => r(n));
}
function o2(e, t) {
  let r = Float64Array.from(
    { length: t.length - 1 },
    (o, i) => t[i + 1] - t[i]
  ), n = Array.from(
    {
      length: e.length
    },
    () => new Array(t.length)
  );
  for (let o = 0; o < e.length; ++o) {
    let i = n[o];
    for (let l = 0; l < t.length; ++l)
      i[l] = t[l] - e[o];
  }
  let s = t.length - 2, a = Array.from({ length: s }, () => new Array(e.length));
  for (let o = 0; o < e.length; ++o) {
    let i = n[o];
    for (let l = 0; l < s; ++l) {
      let c = -i[l] / r[l], d = i[l + 2] / r[l + 1];
      a[l][o] = Math.max(0, Math.min(c, d));
    }
  }
  return a;
}
function mp(e, t, r) {
  let n = (t - e) / (r - 1);
  return Float64Array.from({ length: r }, (s, a) => e + n * a);
}
function rr(e, t, r, n, s, a = null, o = "htk", i = !1) {
  if (a !== null && a !== "slaney")
    throw new Error('norm must be one of null or "slaney"');
  if (e < 2)
    throw new Error(`Require num_frequency_bins: ${e} >= 2`);
  if (r > n)
    throw new Error(`Require min_frequency: ${r} <= max_frequency: ${n}`);
  let l = Ti(r, o), c = Ti(n, o), d = mp(l, c, t + 2), h = a2(d, o), _;
  if (i) {
    let w = s / ((e - 1) * 2);
    _ = Ti(
      Float64Array.from({ length: e }, (v, y) => y * w),
      o
    ), h = d;
  } else
    _ = mp(0, Math.floor(s / 2), e);
  let p = o2(_, h);
  if (a !== null && a === "slaney")
    for (let w = 0; w < t; ++w) {
      let v = p[w], y = 2 / (h[w + 2] - h[w]);
      for (let b = 0; b < e; ++b)
        v[b] *= y;
    }
  return p;
}
function i2(e, t, r) {
  let n = new e.constructor(e.length + t + r), s = e.length - 1;
  for (let a = 0; a < e.length; ++a)
    n[t + a] = e[a];
  for (let a = 1; a <= t; ++a)
    n[t - a] = e[ua(a, s)];
  for (let a = 1; a <= r; ++a)
    n[s + t + a] = e[ua(s - a, s)];
  return n;
}
function Bm(e, t, r, n, s) {
  if (r <= 0)
    throw new Error("reference must be greater than zero");
  if (n <= 0)
    throw new Error("min_value must be greater than zero");
  r = Math.max(n, r);
  let a = Math.log10(r);
  for (let o = 0; o < e.length; ++o)
    e[o] = t * Math.log10(Math.max(n, e[o]) - a);
  if (s !== null) {
    if (s <= 0)
      throw new Error("db_range must be greater than zero");
    let o = qe(e)[0] - s;
    for (let i = 0; i < e.length; ++i)
      e[i] = Math.max(e[i], o);
  }
  return e;
}
function l2(e, t = 1, r = 1e-5, n = null) {
  return Bm(e, 20, t, r, n);
}
function c2(e, t = 1, r = 1e-10, n = null) {
  return Bm(e, 10, t, r, n);
}
async function ar(e, t, r, n, {
  fft_length: s = null,
  power: a = 1,
  center: o = !0,
  pad_mode: i = "reflect",
  onesided: l = !0,
  preemphasis: c = null,
  preemphasis_htk_flavor: d = !0,
  mel_filters: h = null,
  mel_floor: _ = 1e-10,
  log_mel: p = null,
  max_log_mel: w = null,
  reference: v = 1,
  min_value: y = 1e-10,
  db_range: b = null,
  remove_dc_offset: k = null,
  // Custom parameters for efficiency reasons
  min_num_frames: A = null,
  max_num_frames: E = null,
  do_pad: C = !0,
  transpose: N = !1,
  mel_offset: M = 0,
  mel_floor_mode: $ = "clamp"
} = {}) {
  let R = t.length;
  if (s === null && (s = r), r > s)
    throw Error(`frame_length (${r}) may not be larger than fft_length (${s})`);
  if (R !== r)
    throw new Error(`Length of the window (${R}) must equal frame_length (${r})`);
  if (n <= 0)
    throw new Error("hop_length must be greater than zero");
  if (a === null && h !== null)
    throw new Error(
      "You have provided `mel_filters` but `power` is `None`. Mel spectrogram computation is not yet supported for complex-valued spectrogram. Specify `power` to fix this issue."
    );
  if (!d)
    throw new Error("`preemphasis_htk_flavor=false` is not currently supported.");
  if (o) {
    let O = Math.floor(r / 2);
    switch (i) {
      case "reflect": {
        e = i2(e, O, O);
        break;
      }
      case "constant": {
        let G = new e.constructor(e.length + 2 * O);
        G.set(e, O), e = G;
        break;
      }
      case "semicausal": {
        let G = new e.constructor(e.length + O);
        G.set(e, O), e = G;
        break;
      }
      default:
        throw new Error(`pad_mode="${i}" not implemented yet.`);
    }
  }
  let W = Math.floor(1 + Math.floor((e.length - r) / n));
  A !== null && W < A && (W = A);
  let Q = l ? Math.floor(s / 2) + 1 : s, H = W, q = W;
  E !== null && (E > W ? C && (q = E) : q = H = E);
  let B = new ST(s), P = new Float64Array(s), X = new Float64Array(B.outputBufferSize), ce = new Float32Array(Q * q);
  for (let O = 0; O < H; ++O) {
    let G = O * n, ue = Math.min(e.length - G, r);
    ue !== r && P.fill(0, 0, r);
    for (let ee = 0; ee < ue; ++ee)
      P[ee] = e[G + ee];
    if (k) {
      let ee = 0;
      for (let Pe = 0; Pe < ue; ++Pe)
        ee += P[Pe];
      let We = ee / ue;
      for (let Pe = 0; Pe < ue; ++Pe)
        P[Pe] -= We;
    }
    if (c !== null) {
      for (let ee = ue - 1; ee >= 1; --ee)
        P[ee] -= c * P[ee - 1];
      P[0] *= 1 - c;
    }
    for (let ee = 0; ee < t.length; ++ee)
      P[ee] *= t[ee];
    B.realTransform(X, P);
    for (let ee = 0; ee < Q; ++ee) {
      let We = ee << 1;
      ce[ee * q + O] = X[We] ** 2 + X[We + 1] ** 2;
    }
  }
  if (a !== null && a !== 2) {
    let O = a / 2;
    for (let G = 0; G < ce.length; ++G)
      ce[G] **= O;
  }
  let J = h.length, ne = await qT(
    // TODO: Make `mel_filters` a Tensor during initialization
    new V("float32", h.flat(), [J, Q]),
    new V("float32", ce, [Q, q])
  );
  N && (ne = ne.transpose(1, 0));
  let L = (
    /** @type {Float32Array} */
    ne.data
  );
  if ($ === "add")
    for (let O = 0; O < L.length; ++O)
      L[O] = M + L[O] + _;
  else
    for (let O = 0; O < L.length; ++O)
      L[O] = M + Math.max(_, L[O]);
  if (a !== null && p !== null) {
    let O = Math.min(L.length, H * J);
    switch (p) {
      case "log":
        for (let G = 0; G < O; ++G)
          L[G] = Math.log(L[G]);
        break;
      case "log10":
        for (let G = 0; G < O; ++G)
          L[G] = Math.log10(L[G]);
        break;
      case "log10_max_norm": {
        for (let ee = 0; ee < O; ++ee)
          L[ee] = Math.log10(L[ee]);
        let ue = (w ?? qe(L)[0]) - 8;
        for (let ee = 0; ee < O; ++ee)
          L[ee] = (Math.max(L[ee], ue) + 4) / 4;
        break;
      }
      case "dB":
        if (a === 1)
          l2(L, v, y, b);
        else if (a === 2)
          c2(L, v, y, b);
        else
          throw new Error(`Cannot use log_mel option '${p}' with power ${a}`);
        break;
      default:
        throw new Error(
          `log_mel must be one of null, 'log', 'log10', 'log10_max_norm', or 'dB'. Got '${p}'`
        );
    }
  }
  return ne;
}
function mr(e, t, { periodic: r = !0, frame_length: n = null, center: s = !0 } = {}) {
  let a = r ? e + 1 : e, o;
  switch (t) {
    case "boxcar":
      o = new Float64Array(a).fill(1);
      break;
    case "hann":
    case "hann_window":
      o = pp(a);
      break;
    case "hamming":
      o = r2(a);
      break;
    case "povey":
      o = pp(a).map((c) => Math.pow(c, 0.85));
      break;
    default:
      throw new Error(`Unknown window type ${t}.`);
  }
  if (r && (o = o.subarray(0, e)), n === null || e === n)
    return o;
  if (e > n)
    throw new Error(
      `Length of the window (${e}) may not be larger than frame_length (${n})`
    );
  let i = new Float64Array(n), l = s ? Math.floor((n - e) / 2) : 0;
  return i.set(o, l), i;
}
function u2(e, t) {
  let r = e.reduce((a, o) => a + o.length, 0), n = new ArrayBuffer(44), s = new DataView(n);
  return Zs(s, 0, "RIFF"), s.setUint32(4, 36 + r * 4, !0), Zs(s, 8, "WAVE"), Zs(s, 12, "fmt "), s.setUint32(16, 16, !0), s.setUint16(20, 3, !0), s.setUint16(22, 1, !0), s.setUint32(24, t, !0), s.setUint32(28, t * 4, !0), s.setUint16(32, 4, !0), s.setUint16(34, 32, !0), Zs(s, 36, "data"), s.setUint32(40, r * 4, !0), new Blob(
    [
      n,
      ...e.map(
        (a) => a.buffer instanceof ArrayBuffer ? new Uint8Array(a.buffer, a.byteOffset, a.byteLength) : a.slice()
      )
    ],
    { type: "audio/wav" }
  );
}
function Zs(e, t, r) {
  for (let n = 0; n < r.length; ++n)
    e.setUint8(t + n, r.charCodeAt(n));
}
var d2 = class {
  /**
   * Create a new `RawAudio` object.
   * @param {Float32Array|Float32Array[]} audio Audio data, either as a single `Float32Array` chunk or multiple `Float32Array` chunks.
   * @param {number} sampling_rate Sampling rate of the audio data
   */
  constructor(e, t) {
    this.audio = e, this.sampling_rate = t;
  }
  /**
   * Get the audio data, accumulating all chunks if necessary.
   * @returns {Float32Array} The audio data.
   */
  get data() {
    if (Array.isArray(this.audio)) {
      if (this.audio.length === 0)
        return new Float32Array(0);
      if (this.audio.length === 1)
        return this.audio[0];
      let e = this.audio.reduce((n, s) => n + s.length, 0), t = new Float32Array(e), r = 0;
      for (let n of this.audio)
        t.set(n, r), r += n.length;
      return t;
    } else
      return this.audio;
  }
  /**
   * Convert the audio to a blob.
   * @returns {Blob}
   */
  toBlob() {
    let e = this.audio;
    return e instanceof Float32Array && (e = [e]), u2(e, this.sampling_rate);
  }
  /**
   * Save the audio to a wav file.
   * @param {string} path
   * @returns {Promise<void>}
   */
  async save(e) {
    return Dm(e, this.toBlob());
  }
}, h2 = class extends dt {
  constructor(e) {
    super(e);
    let t = this.config.sampling_rate, r = rr(
      257,
      // num_frequency_bins
      this.config.num_mel_bins,
      // num_mel_filters
      20,
      // min_frequency
      Math.floor(t / 2),
      // max_frequency
      t,
      // sampling_rate
      null,
      // norm
      "kaldi",
      // mel_scale
      !0
      // triangularize_in_mel_space
    );
    this.mel_filters = r, this.window = mr(400, "hann", {
      periodic: !1
    }), this.mean = this.config.mean, this.std = this.config.std;
  }
  /**
   * Computes the log-Mel spectrogram of the provided audio waveform.
   * @param {Float32Array|Float64Array} waveform The audio waveform to process.
   * @param {number} max_length The maximum number of frames to return.
   * @returns {Promise<Tensor>} An object containing the log-Mel spectrogram data as a Float32Array and its dimensions as an array of numbers.
   */
  async _extract_fbank_features(e, t) {
    return ar(
      e,
      this.window,
      // window
      400,
      // frame_length
      160,
      // hop_length
      {
        fft_length: 512,
        power: 2,
        center: !1,
        preemphasis: 0.97,
        mel_filters: this.mel_filters,
        log_mel: "log",
        mel_floor: 1192092955078125e-22,
        remove_dc_offset: !0,
        // Custom
        max_num_frames: t,
        transpose: !0
      }
    );
  }
  /**
   * Asynchronously extracts features from a given audio using the provided configuration.
   * @param {Float32Array|Float64Array} audio The audio data as a Float32Array/Float64Array.
   * @returns {Promise<{ input_values: Tensor }>} A Promise resolving to an object containing the extracted input features as a Tensor.
   */
  async _call(e) {
    ot(e, "ASTFeatureExtractor");
    let t = await this._extract_fbank_features(e, this.config.max_length);
    if (this.config.do_normalize) {
      let r = this.std * 2, n = t.data;
      for (let s = 0; s < n.length; ++s)
        n[s] = (n[s] - this.mean) / r;
    }
    return {
      input_values: t.unsqueeze_(0)
    };
  }
}, Rm = class extends dt {
  /**
   * Asynchronously extracts input values from a given audio using the provided configuration.
   * @param {Float32Array|Float64Array} audio The audio data as a Float32Array/Float64Array.
   * @returns {Promise<{ input_values: Tensor; }>} The extracted input values.
   */
  async _call(e) {
    ot(e, "EncodecFeatureExtractor"), e instanceof Float64Array && (e = new Float32Array(e));
    let t = this.config.feature_size;
    if (e.length % t !== 0)
      throw new Error(
        `The length of the audio data must be a multiple of the number of channels (${t}).`
      );
    let r = [
      1,
      t,
      e.length / t
    ];
    return {
      input_values: new V("float32", e, r)
    };
  }
}, f2 = class extends dt {
  /**
   * Asynchronously extracts input values from a given audio using the provided configuration.
   * @param {Float32Array|Float64Array} audio The audio data as a Float32Array/Float64Array.
   * @returns {Promise<{ input_values: Tensor; }>} The extracted input values.
   */
  async _call(e) {
    ot(e, "ChatterboxFeatureExtractor"), e instanceof Float64Array && (e = new Float32Array(e));
    let t = [
      1,
      e.length
      /* num_samples */
    ];
    return {
      input_values: new V("float32", e, t)
    };
  }
}, _2 = class extends dt {
  constructor(e) {
    super(e), this.mel_filters = rr(
      this.config.nb_frequency_bins,
      // num_frequency_bins
      this.config.feature_size,
      // num_mel_filters
      this.config.frequency_min,
      // min_frequency
      this.config.frequency_max,
      // max_frequency
      this.config.sampling_rate,
      // sampling_rate
      null,
      // norm
      "htk"
      // mel_scale
    ), this.mel_filters_slaney = rr(
      this.config.nb_frequency_bins,
      // num_frequency_bins
      this.config.feature_size,
      // num_mel_filters
      this.config.frequency_min,
      // min_frequency
      this.config.frequency_max,
      // max_frequency
      this.config.sampling_rate,
      // sampling_rate
      "slaney",
      // norm
      "slaney"
      // mel_scale
    ), this.window = mr(this.config.fft_window_size, "hann");
  }
  /**
   * Extracts the mel spectrogram and prepares it for the mode based on the `truncation` and `padding` arguments.
   *
   * Four different path are possible:
   *   - `truncation="fusion"` and the length of the waveform is greater than the max length: the mel spectrogram
   *     will be computed on the entire audio. 3 random crops and a dowsampled version of the full mel spectrogram
   *     are then stacked together. They will later be used for `feature_fusion`.
   *   - `truncation="rand_trunc"` and the length of the waveform is smaller than the max length: the audio is
   *     padded based on `padding`.
   *   - `truncation="fusion"` and the length of the waveform is smaller than the max length: the audio is padded
   *     based on `padding`, and is repeated `4` times.
   *   - `truncation="rand_trunc"` and the length of the waveform is greater than the max length: the mel
   *     spectrogram will be computed on a random crop of the waveform.
   *
   * @param {Float32Array|Float64Array} waveform The input waveform.
   * @param {number} max_length The maximum length of the waveform.
   * @param {string} truncation The truncation strategy to use.
   * @param {string} padding The padding strategy to use.
   * @returns {Promise<Tensor>} An object containing the mel spectrogram data as a Float32Array, its dimensions as an array of numbers, and a boolean indicating whether the waveform was longer than the max length.
   * @private
   */
  async _get_input_mel(e, t, r, n) {
    let s, a = !1, o = e.length - t;
    if (o > 0)
      if (r === "rand_trunc") {
        a = !0;
        let i = Math.floor(rl.random() * (o + 1));
        e = e.subarray(i, i + t), s = await this._extract_fbank_features(
          e,
          this.mel_filters_slaney,
          this.config.nb_max_samples
        );
      } else
        throw new Error(`Truncation strategy "${r}" not implemented`);
    else {
      if (o < 0) {
        let i = new Float64Array(t);
        if (i.set(e), n === "repeat")
          for (let l = e.length; l < t; l += e.length)
            i.set(e.subarray(0, Math.min(e.length, t - l)), l);
        else if (n === "repeatpad")
          for (let l = e.length; l < -o; l += e.length)
            i.set(e, l);
        e = i;
      }
      if (r === "fusion")
        throw new Error(`Truncation strategy "${r}" not implemented`);
      s = await this._extract_fbank_features(
        e,
        this.mel_filters_slaney,
        this.config.nb_max_samples
      );
    }
    return s.unsqueeze_(0);
  }
  /**
   * Compute the log-mel spectrogram of the provided `waveform` using the Hann window.
   * In CLAP, two different filter banks are used depending on the truncation pattern:
   *  - `self.mel_filters`: they correspond to the default parameters of `torchaudio` which can be obtained from
   *    calling `torchaudio.transforms.MelSpectrogram().mel_scale.fb`. These filters are used when `truncation`
   *    is set to `"fusion"`.
   *  - `self.mel_filteres_slaney` : they correspond to the default parameters of `librosa` which used
   *    `librosa.filters.mel` when computing the mel spectrogram. These filters were only used in the original
   *    implementation when the truncation mode is not `"fusion"`.
   *
   * @param {Float32Array|Float64Array} waveform The audio waveform to process.
   * @param {number[][]} mel_filters The mel filters to use.
   * @param {number} [max_length=null] The maximum number of frames to return.
   * @returns {Promise<Tensor>} An object containing the log-Mel spectrogram data as a Float32Array and its dimensions as an array of numbers.
   */
  async _extract_fbank_features(e, t, r = null) {
    return ar(
      e,
      this.window,
      // window
      this.config.fft_window_size,
      // frame_length
      this.config.hop_length,
      // hop_length
      {
        power: 2,
        mel_filters: t,
        log_mel: "dB",
        // Custom
        max_num_frames: r,
        do_pad: !1,
        transpose: !0
      }
    );
  }
  /**
   * Asynchronously extracts features from a given audio using the provided configuration.
   * @param {Float32Array|Float64Array} audio The audio data as a Float32Array/Float64Array.
   * @returns {Promise<{ input_features: Tensor }>} A Promise resolving to an object containing the extracted input features as a Tensor.
   */
  async _call(e, { max_length: t = null } = {}) {
    return ot(e, "ClapFeatureExtractor"), {
      input_features: (await this._get_input_mel(
        e,
        t ?? this.config.nb_max_samples,
        this.config.truncation,
        this.config.padding
      )).unsqueeze_(0)
    };
  }
}, p2 = 1e-5, $m = class extends dt {
  constructor(e) {
    super(e), this.config.mel_filters ??= rr(
      Math.floor(1 + this.config.n_fft / 2),
      // num_frequency_bins
      this.config.feature_size,
      // num_mel_filters
      0,
      // min_frequency
      this.config.sampling_rate / 2,
      // max_frequency
      this.config.sampling_rate,
      // sampling_rate
      "slaney",
      // norm
      "slaney"
      // mel_scale
    );
    let t = mr(this.config.win_length, "hann", {
      periodic: !1
    });
    this.window = new Float64Array(this.config.n_fft);
    let r = Math.floor((this.config.n_fft - this.config.win_length) / 2);
    this.window.set(t, r);
  }
  /**
   * Computes the log-Mel spectrogram of the provided audio waveform.
   * @param {Float32Array|Float64Array} waveform The audio waveform to process.
   * @returns {Promise<Tensor>} An object containing the log-Mel spectrogram data as a Float32Array and its dimensions as an array of numbers.
   */
  async _extract_fbank_features(e) {
    let t = this.config.preemphasis;
    e = new Float64Array(e);
    for (let n = e.length - 1; n >= 1; --n)
      e[n] -= t * e[n - 1];
    return await ar(
      e,
      this.window,
      // window
      this.window.length,
      // frame_length
      this.config.hop_length,
      // hop_length
      {
        fft_length: this.config.n_fft,
        power: 2,
        mel_filters: this.config.mel_filters,
        log_mel: "log",
        mel_floor: -1 / 0,
        pad_mode: "constant",
        center: !0,
        // Custom
        transpose: !0,
        mel_offset: 2 ** -24
      }
    );
  }
  /**
   * Asynchronously extracts features from a given audio using the provided configuration.
   * @param {Float32Array|Float64Array} audio The audio data as a Float32Array/Float64Array.
   * @returns {Promise<{ input_features: Tensor; attention_mask: Tensor; }>} A Promise resolving to an object containing the extracted input features as a Tensor.
   */
  async _call(e) {
    ot(e, "ParakeetFeatureExtractor");
    let t = await this._extract_fbank_features(e), r = Math.floor(
      (e.length + Math.floor(this.config.n_fft / 2) * 2 - this.config.n_fft) / this.config.hop_length
    ), n = (
      /** @type {Float32Array} */
      t.data
    );
    n.fill(0, r * t.dims[1]);
    let [s, a] = t.dims, o = new Float64Array(a), i = new Float64Array(a);
    for (let d = 0; d < r; ++d) {
      let h = d * a;
      for (let _ = 0; _ < a; ++_) {
        let p = n[h + _];
        o[_] += p, i[_] += p * p;
      }
    }
    let l = r > 1 ? r - 1 : 1;
    for (let d = 0; d < a; ++d) {
      let h = o[d] / r, _ = (i[d] - r * h * h) / l, w = 1 / (Math.sqrt(_) + p2);
      for (let v = 0; v < r; ++v) {
        let y = v * a + d;
        n[y] = (n[y] - h) * w;
      }
    }
    let c = new BigInt64Array(s);
    return c.fill(1n, 0, r), {
      input_features: t.unsqueeze_(0),
      attention_mask: new V("int64", c, [1, s])
    };
  }
}, m2 = class extends $m {
  /**
   * Apply deterministic dithering seeded by the waveform length.
   * @param {Float64Array} waveform
   * @returns {Float64Array} The dithered waveform (mutated in-place).
   */
  _apply_dither(e) {
    let t = this.config.dither ?? 0;
    if (t <= 0) return e;
    let r = new Aa(e.length);
    for (let n = 0; n < e.length; ++n)
      e[n] += t * r.gauss();
    return e;
  }
  /**
   * Split audio into chunks at energy-based boundaries for long audio.
   * @param {Float32Array|Float64Array} audio The raw audio waveform.
   * @returns {(Float32Array|Float64Array)[]} Array of audio chunks.
   */
  split_audio(e) {
    let t = this.config.max_audio_clip_s ?? 35, r = this.config.overlap_chunk_second ?? 5, n = this.config.min_energy_window_samples ?? 1600, s = this.config.sampling_rate, a = Math.max(1, Math.round(t * s)), o = Math.max(1, Math.round(r * s));
    if (e.length <= a)
      return [e];
    let i = [], l = 0, c = e.length;
    for (; l < c; ) {
      if (l + a >= c) {
        i.push(e.slice(l, c));
        break;
      }
      let d = Math.max(l, l + a - o), h = Math.min(l + a, c), _;
      h <= d ? _ = l + a : _ = this._find_split_point_energy(e, d, h, n), _ = Math.max(l + 1, Math.min(_, c)), i.push(e.slice(l, _)), l = _;
    }
    return i;
  }
  /**
   * Find the quietest point (minimum energy) within a segment of audio.
   * @param {Float32Array|Float64Array} waveform
   * @param {number} start_idx
   * @param {number} end_idx
   * @param {number} window_size
   * @returns {number} Index of the quietest point.
   */
  _find_split_point_energy(e, t, r, n) {
    let s = r - t;
    if (s <= n)
      return Math.floor((t + r) / 2);
    let a = 1 / 0, o = t, i = s - n;
    for (let l = 0; l <= i; l += n) {
      let c = 0;
      for (let d = 0; d < n; ++d) {
        let h = e[t + l + d];
        c += h * h;
      }
      c = Math.sqrt(c / n), c < a && (a = c, o = t + l);
    }
    return o;
  }
  /**
   * Extracts features from a given audio waveform.
   * @param {Float32Array|Float64Array} audio The audio data.
   * @returns {Promise<{ input_features: import('../../utils/tensor.js').Tensor; attention_mask: import('../../utils/tensor.js').Tensor; }>}
   */
  async _call(e) {
    ot(e, "CohereAsrFeatureExtractor");
    let t = new Float64Array(e);
    return this._apply_dither(t), super._call(t);
  }
}, Gm = class extends Rm {
}, Vm = class extends dt {
  constructor(e) {
    super(e);
    let { fft_length: t, feature_size: r, min_frequency: n, max_frequency: s, sampling_rate: a, frame_length: o } = this.config, i = rr(
      Math.floor(1 + t / 2),
      // num_frequency_bins
      r,
      // num_mel_filters
      n,
      // min_frequency
      s,
      // max_frequency
      a,
      // sampling_rate
      null,
      // norm
      "htk",
      // mel_scale
      !1
      // triangularize_in_mel_space
    );
    this.mel_filters = i, this.window = mr(o, "hann");
  }
  /**
   * Computes the log-Mel spectrogram of the provided audio waveform.
   * @param {Float32Array|Float64Array} waveform The audio waveform to process.
   * @param {number} max_length The maximum number of frames to return.
   * @returns {Promise<Tensor>} An object containing the log-Mel spectrogram data as a Float32Array and its dimensions as an array of numbers.
   */
  async _extract_fbank_features(e, t) {
    return ar(
      e,
      this.window,
      // window
      this.config.frame_length,
      // frame_length
      this.config.hop_length,
      // hop_length
      {
        fft_length: this.config.fft_length,
        center: !1,
        onesided: !0,
        preemphasis: this.config.preemphasis,
        preemphasis_htk_flavor: this.config.preemphasis_htk_flavor,
        mel_filters: this.mel_filters,
        log_mel: "log",
        mel_floor: this.config.mel_floor,
        remove_dc_offset: !1,
        // Custom
        transpose: !0
      }
    );
  }
  /**
   * Asynchronously extracts features from a given audio using the provided configuration.
   * @param {Float32Array|Float64Array} audio The audio data as a Float32Array/Float64Array.
   * @param {Object} options Optional parameters for feature extraction.
   * @param {number} [options.max_length=480_000] If provided, defines the maximum length of the audio to allow.
   * Audio longer than this will be truncated if `truncation=True`.
   * @param {boolean} [options.truncation=true] Whether or not to truncate audio above `max_length`.
   * @param {boolean} [options.padding=true] Whether to pad the sequence to a multiple of `pad_to_multiple_of`.
   * @param {number} [options.pad_to_multiple_of=128] The number to pad the sequence to a multiple of.
   * @returns {Promise<{ input_features: Tensor, input_features_mask: Tensor }>} A Promise resolving to an object containing the extracted input features and attention masks as Tensors.
   */
  async _call(e, { max_length: t = 48e4, truncation: r = !0, padding: n = !0, pad_to_multiple_of: s = 128 } = {}) {
    if (ot(e, "Gemma3nAudioFeatureExtractor"), r && e.length > t && (e = e.slice(0, t)), n && e.length % s !== 0) {
      let i = s - e.length % s, l = new Float64Array(e.length + i);
      l.set(e), this.config.padding_value !== 0 && l.fill(this.config.padding_value, e.length), e = l;
    }
    let a = await this._extract_fbank_features(e, this.config.max_length), o = ut([1, a.dims[0]], !0);
    return {
      input_features: a.unsqueeze_(0),
      input_features_mask: o
    };
  }
}, Um = class extends Vm {
  /**
   * @override
   * Gemma4 uses semicausal padding, unfold(frame_length+1) framing, and
   * additive mel_floor — all controlled via flags on the shared spectrogram().
   */
  async _extract_fbank_features(e, t) {
    let { frame_length: r, hop_length: n, fft_length: s } = this.config, a = Math.floor(r / 2), o = Math.floor((e.length + a - (r + 1)) / n) + 1;
    return ar(e, this.window, r, n, {
      fft_length: s,
      center: !0,
      pad_mode: "semicausal",
      onesided: !0,
      preemphasis: this.config.preemphasis,
      preemphasis_htk_flavor: this.config.preemphasis_htk_flavor,
      mel_filters: this.mel_filters,
      log_mel: "log",
      mel_floor: this.config.mel_floor,
      mel_floor_mode: "add",
      remove_dc_offset: !1,
      transpose: !0,
      max_num_frames: o
    });
  }
  /**
   * @override
   * Wraps the base class result with a frame-aware attention mask
   * and zeros out features for invalid (padded) frames.
   */
  async _call(e, t = {}) {
    ot(e, "Gemma4AudioFeatureExtractor");
    let r = e.length, n = await super._call(e, t), { input_features: s } = n, [, a, o] = s.dims, { frame_length: i, hop_length: l } = this.config, c = Math.floor(i / 2), d = i + 1, h = new Uint8Array(r + c + (t.pad_to_multiple_of ?? 128));
    h.fill(1, c, c + r);
    let _ = new Uint8Array(a);
    for (let w = 0; w < a; ++w)
      _[w] = h[w * l + d - 1] ? 1 : 0;
    let p = (
      /** @type {Float32Array} */
      s.data
    );
    for (let w = 0; w < a; ++w)
      _[w] || p.fill(0, w * o, (w + 1) * o);
    return n.input_features_mask = new V("bool", _, [1, a]), n;
  }
}, g2 = class extends dt {
  constructor(e) {
    super(e);
    let { n_fft: t, win_length: r, n_mels: n, sample_rate: s } = e.melspec_kwargs;
    this.mel_filters = rr(
      Math.floor(1 + t / 2),
      // num_frequency_bins = 257
      n,
      // 80
      0,
      // min_frequency
      s / 2,
      // max_frequency = 8000
      s,
      // 16000
      null,
      // norm (torchaudio default: no norm)
      "htk"
      // mel_scale (torchaudio default)
    );
    let a = mr(r, "hann");
    this.window = new Float64Array(t);
    let o = Math.floor((t - r) / 2);
    this.window.set(a, o);
  }
  /**
   * Extract mel spectrogram features from audio, matching the Python GraniteSpeechFeatureExtractor.
   * @param {Float32Array|Float64Array} audio The audio waveform.
   * @returns {Promise<{input_features: Tensor}>}
   */
  async _call(e) {
    ot(e, "GraniteSpeechFeatureExtractor");
    let { n_fft: t, hop_length: r, n_mels: n } = this.config.melspec_kwargs, s = Math.floor(e.length / r) + 1, a = s - s % 2;
    return { input_features: (await ar(e, this.window, t, r, {
      power: 2,
      mel_filters: this.mel_filters,
      log_mel: "log10_max_norm",
      transpose: !0,
      // [time, n_mels]
      max_num_frames: a,
      do_pad: !1
    })).view(-1, 2 * n).unsqueeze_(0) };
  }
}, w2 = class extends dt {
  /**
   * Asynchronously extracts input values from a given audio using the provided configuration.
   * @param {Float32Array|Float64Array} audio The audio data as a Float32Array/Float64Array.
   * @returns {Promise<{ input_values: Tensor; }>} The extracted input values.
   */
  async _call(e) {
    ot(e, "MoonshineFeatureExtractor"), e instanceof Float64Array && (e = new Float32Array(e));
    let t = [
      1,
      e.length
      /* num_samples */
    ];
    return {
      input_values: new V("float32", e, t)
    };
  }
}, jm = class extends dt {
  /**
   * Asynchronously extracts features from a given audio using the provided configuration.
   * @param {Float32Array|Float64Array} audio The audio data as a Float32Array/Float64Array.
   * @returns {Promise<{ input_values: Tensor; }>} The extracted input features.
   */
  async _call(e) {
    ot(e, "PyAnnoteFeatureExtractor"), e instanceof Float64Array && (e = new Float32Array(e));
    let t = [
      1,
      1,
      e.length
      /* num_samples */
    ];
    return {
      input_values: new V("float32", e, t)
    };
  }
  /**
   * NOTE: Can return fractional values. `Math.ceil` will ensure correct value.
   * @param {number} samples The number of frames in the audio.
   * @returns {number} The number of frames in the audio.
   */
  samples_to_frames(e) {
    return (e - this.config.offset) / this.config.step;
  }
  /**
   * Post-processes the speaker diarization logits output by the model.
   * @param {import('../../utils/tensor.js').Tensor} logits The speaker diarization logits output by the model.
   * @param {number} num_samples Number of samples in the input audio.
   * @returns {Array<Array<{ id: number, start: number, end: number, confidence: number }>>} The post-processed speaker diarization results.
   */
  post_process_speaker_diarization(e, t) {
    let r = t / this.samples_to_frames(t) / this.config.sampling_rate, n = [];
    for (let s of e.tolist()) {
      let a = [], o = -1;
      for (let i = 0; i < s.length; ++i) {
        let l = at(s[i]), [c, d] = qe(l), [h, _] = [i, i + 1];
        d !== o ? (o = d, a.push({ id: d, start: h, end: _, score: c })) : (a.at(-1).end = _, a.at(-1).score += c);
      }
      n.push(
        a.map(
          // Convert frame-space to time-space
          // and compute the confidence
          ({ id: i, start: l, end: c, score: d }) => ({
            id: i,
            start: l * r,
            end: c * r,
            confidence: d / (c - l)
          })
        )
      );
    }
    return n;
  }
}, v2 = class extends dt {
  constructor(e) {
    super(e);
    let t = this.config.sampling_rate, r = rr(
      257,
      // num_frequency_bins
      this.config.num_mel_bins,
      // num_mel_filters
      20,
      // min_frequency
      Math.floor(t / 2),
      // max_frequency
      t,
      // sampling_rate
      null,
      // norm
      "kaldi",
      // mel_scale
      !0
      // triangularize_in_mel_space
    );
    this.mel_filters = r, this.window = mr(400, "povey", {
      periodic: !1
    });
  }
  /**
   * Computes the log-Mel spectrogram of the provided audio waveform.
   * @param {Float32Array|Float64Array} waveform The audio waveform to process.
   * @param {number} max_length The maximum number of frames to return.
   * @returns {Promise<Tensor>} An object containing the log-Mel spectrogram data as a Float32Array and its dimensions as an array of numbers.
   */
  async _extract_fbank_features(e, t) {
    return e = e.map((r) => r * 32768), ar(
      e,
      this.window,
      // window
      400,
      // frame_length
      160,
      // hop_length
      {
        fft_length: 512,
        power: 2,
        center: !1,
        preemphasis: 0.97,
        mel_filters: this.mel_filters,
        log_mel: "log",
        mel_floor: 1192092955078125e-22,
        remove_dc_offset: !0,
        // Custom
        max_num_frames: t,
        transpose: !0
      }
    );
  }
  /**
   * Asynchronously extracts features from a given audio using the provided configuration.
   * @param {Float32Array|Float64Array} audio The audio data as a Float32Array/Float64Array.
   * @param {Object} options Optional parameters for feature extraction.
   * @param {boolean} [options.padding=true] Whether to pad the sequence to a multiple of `pad_to_multiple_of`.
   * @param {number} [options.pad_to_multiple_of=2] The number to pad the sequence to a multiple of.
   * @param {boolean} [options.do_normalize_per_mel_bins=true] Whether or not to zero-mean unit-variance normalize the input per mel-channel.
   * @param {boolean} [options.return_attention_mask=true] Whether to return the attention mask.
   * @returns {Promise<{ input_features: Tensor, attention_mask?: Tensor }>} A Promise resolving to an object containing the extracted input features and attention masks as Tensors.
   */
  async _call(e, { padding: t = !0, pad_to_multiple_of: r = 2, do_normalize_per_mel_bins: n = !0, return_attention_mask: s = !0 } = {}) {
    ot(e, "SeamlessM4TFeatureExtractor");
    let a = await this._extract_fbank_features(e, this.config.max_length);
    if (n) {
      let [p, w] = a.dims, v = a.data;
      for (let y = 0; y < w; ++y) {
        let b = 0;
        for (let C = 0; C < p; ++C)
          b += v[C * w + y];
        let k = b / p, A = 0;
        for (let C = 0; C < p; ++C)
          A += (v[C * w + y] - k) ** 2;
        A /= p - 1;
        let E = Math.sqrt(A + 1e-7);
        for (let C = 0; C < p; ++C) {
          let N = C * w + y;
          v[N] = (v[N] - k) / E;
        }
      }
    }
    let o;
    if (t) {
      let [p, w] = a.dims, v = (
        /** @type {Float32Array} */
        a.data
      ), y = p % r;
      if (y > 0) {
        let b = new Float32Array(w * (p + y));
        b.set(v), b.fill(this.config.padding_value, v.length);
        let k = p + y;
        a = new V(a.type, b, [k, w]), s && (o = new V("int64", new BigInt64Array(k), [
          1,
          k
        ]), o.data.fill(1n, 0, p));
      }
    }
    let [i, l] = a.dims, c = this.config.stride;
    if (i % c !== 0)
      throw new Error(`The number of frames (${i}) must be a multiple of the stride (${c}).`);
    let h = a.view(1, Math.floor(i / c), l * c), _ = { input_features: h };
    if (s) {
      let p = h.dims[1], w = new BigInt64Array(p);
      if (o) {
        let v = o.data;
        for (let y = 1, b = 0; y < i; y += c, ++b)
          w[b] = v[y];
      } else
        w.fill(1n);
      _.attention_mask = new V("int64", w, [1, p]);
    }
    return _;
  }
}, y2 = class extends Gm {
}, b2 = class extends dt {
}, M2 = class extends dt {
  /**
   * @param {Float32Array} input_values
   * @returns {Float32Array}
   */
  _zero_mean_unit_var_norm(e) {
    let r = e.reduce((s, a) => s + a, 0) / e.length, n = e.reduce((s, a) => s + (a - r) ** 2, 0) / e.length;
    return e.map((s) => (s - r) / Math.sqrt(n + 1e-7));
  }
  /**
   * Asynchronously extracts features from a given audio using the provided configuration.
   * @param {Float32Array|Float64Array} audio The audio data as a Float32Array/Float64Array.
   * @returns {Promise<{ input_values: Tensor; attention_mask: Tensor }>} A Promise resolving to an object containing the extracted input features and attention mask as Tensors.
   */
  async _call(e) {
    ot(e, "Wav2Vec2FeatureExtractor"), e instanceof Float64Array && (e = new Float32Array(e));
    let t = e;
    this.config.do_normalize && (t = this._zero_mean_unit_var_norm(t));
    let r = [1, t.length];
    return {
      input_values: new V("float32", t, r),
      attention_mask: new V("int64", new BigInt64Array(t.length).fill(1n), r)
    };
  }
}, x2 = class extends dt {
  constructor(e) {
    super(e);
    let t = this.config.sampling_rate, r = rr(
      257,
      // num_frequency_bins
      this.config.num_mel_bins,
      // num_mel_filters
      20,
      // min_frequency
      Math.floor(t / 2),
      // max_frequency
      t,
      // sampling_rate
      null,
      // norm
      "kaldi",
      // mel_scale
      !0
      // triangularize_in_mel_space
    );
    this.mel_filters = r, this.window = mr(400, "hamming", {
      periodic: !1
    }), this.min_num_frames = this.config.min_num_frames;
  }
  /**
   * Computes the log-Mel spectrogram of the provided audio waveform.
   * @param {Float32Array|Float64Array} waveform The audio waveform to process.
   * @returns {Promise<Tensor>} An object containing the log-Mel spectrogram data as a Float32Array and its dimensions as an array of numbers.
   */
  async _extract_fbank_features(e) {
    return e = e.map((t) => t * 32768), ar(
      e,
      this.window,
      // window
      400,
      // frame_length
      160,
      // hop_length
      {
        fft_length: 512,
        power: 2,
        center: !1,
        preemphasis: 0.97,
        mel_filters: this.mel_filters,
        log_mel: "log",
        mel_floor: 1192092955078125e-22,
        remove_dc_offset: !0,
        // Custom
        transpose: !0,
        min_num_frames: this.min_num_frames
      }
    );
  }
  /**
   * Asynchronously extracts features from a given audio using the provided configuration.
   * @param {Float32Array|Float64Array} audio The audio data as a Float32Array/Float64Array.
   * @returns {Promise<{ input_features: Tensor }>} A Promise resolving to an object containing the extracted input features as a Tensor.
   */
  async _call(e) {
    ot(e, "WeSpeakerFeatureExtractor");
    let t = (await this._extract_fbank_features(e)).unsqueeze_(0);
    if (this.config.fbank_centering_span === null) {
      let r = (
        /** @type {Float32Array} */
        t.mean(1).data
      ), n = (
        /** @type {Float32Array} */
        t.data
      ), [s, a, o] = t.dims;
      for (let i = 0; i < s; ++i) {
        let l = i * a * o, c = i * o;
        for (let d = 0; d < a; ++d) {
          let h = l + d * o;
          for (let _ = 0; _ < o; ++_)
            n[h + _] -= r[c + _];
        }
      }
    }
    return {
      input_features: t
    };
  }
}, k2 = class extends dt {
  constructor(e) {
    super(e), this.config.mel_filters ??= rr(
      Math.floor(1 + this.config.n_fft / 2),
      // num_frequency_bins
      this.config.feature_size,
      // num_mel_filters
      0,
      // min_frequency
      8e3,
      // max_frequency
      this.config.sampling_rate,
      // sampling_rate
      "slaney",
      // norm
      "slaney"
      // mel_scale
    ), this.window = mr(this.config.n_fft, "hann");
  }
  /**
   * Computes the log-Mel spectrogram of the provided audio waveform.
   * @param {Float32Array|Float64Array} waveform The audio waveform to process.
   * @param {Object} [options]
   * @param {boolean} [options.center=true] Whether to center-pad the waveform for STFT.
   * @returns {Promise<import('../../utils/tensor.js').Tensor>} The log-Mel spectrogram tensor of shape [num_mel_bins, num_frames].
   */
  async _extract_fbank_features(e, { center: t = !0 } = {}) {
    let { n_fft: r, hop_length: n, mel_filters: s, global_log_mel_max: a } = this.config, o = Math.floor(t ? e.length / n : (e.length - r) / n);
    return await ar(
      e,
      this.window,
      r,
      // frame_length
      n,
      {
        power: 2,
        mel_filters: s,
        log_mel: "log10_max_norm",
        max_log_mel: a,
        center: t,
        max_num_frames: o,
        do_pad: !1
      }
    );
  }
  /**
   * Extract mel spectrogram features from audio.
   * @param {Float32Array|Float64Array} audio The audio data.
   * @param {Object} [options]
   * @param {boolean} [options.center=true] Whether to center-pad the waveform.
   * @returns {Promise<{ input_features: import('../../utils/tensor.js').Tensor }>}
   */
  async _call(e, { center: t = !0 } = {}) {
    return ot(e, "VoxtralRealtimeFeatureExtractor"), {
      input_features: (await this._extract_fbank_features(e, { center: t })).unsqueeze_(0)
    };
  }
}, T2 = class extends dt {
  constructor(e) {
    super(e), this.config.mel_filters ??= rr(
      Math.floor(1 + this.config.n_fft / 2),
      // num_frequency_bins
      this.config.feature_size,
      // num_mel_filters
      0,
      // min_frequency
      8e3,
      // max_frequency
      this.config.sampling_rate,
      // sampling_rate
      "slaney",
      // norm
      "slaney"
      // mel_scale
    ), this.window = mr(this.config.n_fft, "hann");
  }
  /**
   * Computes the log-Mel spectrogram of the provided audio waveform.
   * @param {Float32Array|Float64Array} waveform The audio waveform to process.
   * @returns {Promise<Tensor>} An object containing the log-Mel spectrogram data as a Float32Array and its dimensions as an array of numbers.
   */
  async _extract_fbank_features(e) {
    return await ar(
      e,
      this.window,
      // window
      this.config.n_fft,
      // frame_length
      this.config.hop_length,
      // hop_length
      {
        power: 2,
        mel_filters: this.config.mel_filters,
        log_mel: "log10_max_norm",
        // Custom
        max_num_frames: Math.min(
          Math.floor(e.length / this.config.hop_length),
          this.config.nb_max_frames
          // 3000
        )
      }
    );
  }
  /**
   * Asynchronously extracts features from a given audio using the provided configuration.
   * @param {Float32Array|Float64Array} audio The audio data as a Float32Array/Float64Array.
   * @returns {Promise<{ input_features: Tensor }>} A Promise resolving to an object containing the extracted input features as a Tensor.
   */
  async _call(e, { max_length: t = null } = {}) {
    ot(e, "WhisperFeatureExtractor");
    let r, n = t ?? this.config.n_samples;
    return e.length > n ? (e.length > this.config.n_samples && le.warn(
      "Attempting to extract features for audio longer than 30 seconds. If using a pipeline to extract transcript from a long audio clip, remember to specify `chunk_length_s` and/or `stride_length_s`."
    ), r = e.slice(0, n)) : (r = new Float32Array(n), r.set(e)), {
      input_features: (await this._extract_fbank_features(r)).unsqueeze_(0)
    };
  }
}, Ft = class {
  /** @type {typeof FeatureExtractor.from_pretrained} */
  static async from_pretrained(e, t = {}) {
    let r = await sr(
      e,
      Lm,
      !0,
      t
    ), n = r.feature_extractor_type, s = fl[n];
    if (!s)
      throw new Error(`Unknown feature_extractor_type: '${n}'. Please report this at ${Ca}.`);
    return new s(r);
  }
}, E2 = class extends Ae {
  static tokenizer_class = Ee;
  static feature_extractor_class = Ft;
  async _call(e, t = null) {
    let r = this.tokenizer(e), n = t ? await this.feature_extractor(t) : {};
    return { ...r, ...n };
  }
}, A2 = /* @__PURE__ */ new Set(["ja", "zh"]), C2 = class extends Ae {
  static tokenizer_class = Ee;
  static feature_extractor_class = Ft;
  static uses_processor_config = !0;
  /**
   * Build the 10-token decoder prompt for the given language.
   * @param {string} [language='en'] Language code.
   * @returns {number[]} Token IDs for the decoder prompt.
   */
  get_decoder_prompt_ids(e = "en") {
    let t = [
      "\u2581",
      "<|startofcontext|>",
      "<|startoftranscript|>",
      "<|emo:undefined|>",
      `<|${e}|>`,
      `<|${e}|>`,
      "<|pnc|>",
      "<|noitn|>",
      "<|notimestamp|>",
      "<|nodiarize|>"
    ];
    return this.tokenizer.convert_tokens_to_ids(t);
  }
  /**
   * Join chunk texts back together, using the appropriate separator for the language.
   * @param {string[]} texts Decoded texts, one per chunk.
   * @param {string} [language='en'] Language code.
   * @returns {string} The joined text.
   */
  static join_chunks(e, t = "en") {
    let r = e.filter((a) => a && a.trim());
    if (r.length === 0) return "";
    let n = A2.has(t) ? "" : " ";
    return [r[0].trimEnd(), ...r.slice(1).map((a) => a.trim())].join(n);
  }
  /**
   * Calls the feature_extractor function with the given audio input.
   * @param {any} audio The audio input to extract features from.
   * @returns {Promise<any>}
   */
  async _call(e) {
    return await this.feature_extractor(e);
  }
}, Gi = {}, en, Wm, Cr;
if (me.IS_WEB_ENV)
  en = (e, t) => {
    if (!self.OffscreenCanvas)
      throw new Error("OffscreenCanvas not supported by this environment.");
    return new self.OffscreenCanvas(e, t);
  }, Cr = self.createImageBitmap, Wm = self.ImageData;
else if (Gi)
  Cr = async (e) => {
    let r = (await e.metadata()).channels, { data: n, info: s } = await e.rotate().raw().toBuffer({ resolveWithObject: !0 }), a = new kt(new Uint8ClampedArray(n), s.width, s.height, s.channels);
    return r !== void 0 && r !== s.channels && a.convert(r), a;
  };
else
  throw new Error("Unable to load image processing library.");
var S2 = {
  0: "nearest",
  1: "lanczos",
  2: "bilinear",
  3: "bicubic",
  4: "box",
  5: "hamming"
}, P2 = /* @__PURE__ */ new Map([
  ["png", "image/png"],
  ["jpg", "image/jpeg"],
  ["jpeg", "image/jpeg"],
  ["gif", "image/gif"]
]), kt = class Kt {
  /**
   * Create a new `RawImage` object.
   * @param {Uint8ClampedArray|Uint8Array} data The pixel data.
   * @param {number} width The width of the image.
   * @param {number} height The height of the image.
   * @param {1|2|3|4} channels The number of channels.
   */
  constructor(t, r, n, s) {
    this.data = t, this.width = r, this.height = n, this.channels = s;
  }
  /**
   * Returns the size of the image (width, height).
   * @returns {[number, number]} The size of the image (width, height).
   */
  get size() {
    return [this.width, this.height];
  }
  /**
   * Helper method for reading an image from a variety of input types.
   * @param {RawImage|string|URL|Blob|HTMLCanvasElement|OffscreenCanvas} input
   * @returns {Promise<RawImage>} The image object.
   *
   * **Example:** Read image from a URL.
   * ```javascript
   * let image = await RawImage.read('https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/football-match.jpg');
   * // RawImage {
   * //   "data": Uint8ClampedArray [ 25, 25, 25, 19, 19, 19, ... ],
   * //   "width": 800,
   * //   "height": 533,
   * //   "channels": 3
   * // }
   * ```
   */
  static async read(t) {
    if (t instanceof Kt)
      return t;
    if (typeof t == "string" || t instanceof URL)
      return await this.fromURL(t);
    if (t instanceof Blob)
      return await this.fromBlob(t);
    if (typeof HTMLCanvasElement < "u" && t instanceof HTMLCanvasElement || typeof OffscreenCanvas < "u" && t instanceof OffscreenCanvas)
      return this.fromCanvas(t);
    throw new Error(`Unsupported input type: ${typeof t}`);
  }
  /**
   * Read an image from a canvas.
   * @param {HTMLCanvasElement|OffscreenCanvas} canvas The canvas to read the image from.
   * @returns {RawImage} The image object.
   */
  static fromCanvas(t) {
    if (!me.IS_WEB_ENV)
      throw new Error("fromCanvas() is only supported in browser environments.");
    let n = /** @type {CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D} */ t.getContext("2d").getImageData(0, 0, t.width, t.height).data;
    return new Kt(n, t.width, t.height, 4);
  }
  /**
   * Read an image from a URL or file path.
   * @param {string|URL} url The URL or file path to read the image from.
   * @returns {Promise<RawImage>} The image object.
   */
  static async fromURL(t) {
    let r = await cs(t);
    if (r.status !== 200)
      throw new Error(`Unable to read image from "${t}" (${r.status} ${r.statusText})`);
    let n = await r.blob();
    return this.fromBlob(n);
  }
  /**
   * Helper method to create a new Image from a blob.
   * @param {Blob} blob The blob to read the image from.
   * @returns {Promise<RawImage>} The image object.
   */
  static async fromBlob(t) {
    if (me.IS_WEB_ENV) {
      let r = await Cr(t), n = en(r.width, r.height).getContext("2d");
      return n.drawImage(r, 0, 0), new this(n.getImageData(0, 0, r.width, r.height).data, r.width, r.height, 4);
    } else {
      let r = Gi(await t.arrayBuffer());
      return await Cr(r);
    }
  }
  /**
   * Helper method to create a new Image from a tensor
   * @param {Tensor} tensor The 3D tensor containing the image data. Must be of type `uint8`.
   * @param {'CHW'|'HWC'} [channel_format='CHW'] The dimension ordering of the tensor.
   * @returns {RawImage} The image created from the tensor.
   * @throws {Error} If the tensor does not have 3 dimensions, or the channel format,
   * tensor type, or number of channels is unsupported.
   */
  static fromTensor(t, r = "CHW") {
    if (t.dims.length !== 3)
      throw new Error(`Tensor should have 3 dimensions, but has ${t.dims.length} dimensions.`);
    if (r === "CHW")
      t = t.permute(1, 2, 0);
    else if (r !== "HWC")
      throw new Error(`Unsupported channel format: ${r}`);
    if (!(t.data instanceof Uint8ClampedArray || t.data instanceof Uint8Array))
      throw new Error(`Unsupported tensor type: ${t.type}`);
    switch (t.dims[2]) {
      case 1:
      case 2:
      case 3:
      case 4:
        return new Kt(t.data, t.dims[1], t.dims[0], t.dims[2]);
      default:
        throw new Error(`Unsupported number of channels: ${t.dims[2]}`);
    }
  }
  /**
   * Convert the image to grayscale format.
   * @returns {RawImage} `this` to support chaining.
   */
  grayscale() {
    if (this.channels === 1)
      return this;
    let t = new Uint8ClampedArray(this.width * this.height * 1);
    switch (this.channels) {
      case 3:
      // rgb to grayscale
      case 4:
        for (let r = 0, n = 0; r < this.data.length; r += this.channels) {
          let s = this.data[r], a = this.data[r + 1], o = this.data[r + 2];
          t[n++] = Math.round(0.2989 * s + 0.587 * a + 0.114 * o);
        }
        break;
      default:
        throw new Error(`Conversion failed due to unsupported number of channels: ${this.channels}`);
    }
    return this._update(t, this.width, this.height, 1);
  }
  /**
   * Convert the image to RGB format.
   * @returns {RawImage} `this` to support chaining.
   */
  rgb() {
    if (this.channels === 3)
      return this;
    let t = new Uint8ClampedArray(this.width * this.height * 3);
    switch (this.channels) {
      case 1:
        for (let r = 0, n = 0; r < this.data.length; ++r)
          t[n++] = this.data[r], t[n++] = this.data[r], t[n++] = this.data[r];
        break;
      case 4:
        for (let r = 0, n = 0; r < this.data.length; r += 4)
          t[n++] = this.data[r], t[n++] = this.data[r + 1], t[n++] = this.data[r + 2];
        break;
      default:
        throw new Error(`Conversion failed due to unsupported number of channels: ${this.channels}`);
    }
    return this._update(t, this.width, this.height, 3);
  }
  /**
   * Convert the image to RGBA format.
   * @returns {RawImage} `this` to support chaining.
   */
  rgba() {
    if (this.channels === 4)
      return this;
    let t = new Uint8ClampedArray(this.width * this.height * 4);
    switch (this.channels) {
      case 1:
        for (let r = 0, n = 0; r < this.data.length; ++r)
          t[n++] = this.data[r], t[n++] = this.data[r], t[n++] = this.data[r], t[n++] = 255;
        break;
      case 3:
        for (let r = 0, n = 0; r < this.data.length; r += 3)
          t[n++] = this.data[r], t[n++] = this.data[r + 1], t[n++] = this.data[r + 2], t[n++] = 255;
        break;
      default:
        throw new Error(`Conversion failed due to unsupported number of channels: ${this.channels}`);
    }
    return this._update(t, this.width, this.height, 4);
  }
  /**
   * Apply an alpha mask to the image. Operates in place.
   * @param {RawImage} mask The mask to apply. It should have a single channel.
   * @returns {RawImage} The masked image.
   * @throws {Error} If the mask is not the same size as the image.
   * @throws {Error} If the image does not have 4 channels.
   * @throws {Error} If the mask is not a single channel.
   */
  putAlpha(t) {
    if (t.width !== this.width || t.height !== this.height)
      throw new Error(
        `Expected mask size to be ${this.width}x${this.height}, but got ${t.width}x${t.height}`
      );
    if (t.channels !== 1)
      throw new Error(`Expected mask to have 1 channel, but got ${t.channels}`);
    let r = this.data, n = t.data, s = this.width * this.height;
    if (this.channels === 3) {
      let a = new Uint8ClampedArray(s * 4);
      for (let o = 0, i = 0, l = 0; o < s; ++o)
        a[l++] = r[i++], a[l++] = r[i++], a[l++] = r[i++], a[l++] = n[o];
      return this._update(a, this.width, this.height, 4);
    } else if (this.channels === 4) {
      for (let a = 0; a < s; ++a)
        r[4 * a + 3] = n[a];
      return this;
    }
    throw new Error(`Expected image to have 3 or 4 channels, but got ${this.channels}`);
  }
  /**
   * Resize the image to the given dimensions. This method uses the canvas API to perform the resizing.
   * @param {number} width The width of the new image. `null` or `-1` will preserve the aspect ratio.
   * @param {number} height The height of the new image. `null` or `-1` will preserve the aspect ratio.
   * @param {Object} options Additional options for resizing.
   * @param {0|1|2|3|4|5|string} [options.resample] The resampling method to use.
   * @returns {Promise<RawImage>} `this` to support chaining.
   */
  async resize(t, r, { resample: n = 2 } = {}) {
    if (this.width === t && this.height === r)
      return this;
    let s = S2[n] ?? n, a = F_(t), o = F_(r);
    if (a && o)
      return this;
    if (a ? t = r / this.height * this.width : o && (r = t / this.width * this.height), me.IS_WEB_ENV) {
      let i = this.channels, l = this.toCanvas(), c = en(t, r).getContext("2d");
      return c.drawImage(l, 0, 0, t, r), new Kt(c.getImageData(0, 0, t, r).data, t, r, 4).convert(i);
    } else {
      let i = this.toSharp();
      switch (s) {
        case "box":
        case "hamming":
          (s === "box" || s === "hamming") && (le.warn(
            `Resampling method ${s} is not yet supported. Using bilinear instead.`
          ), s = "bilinear");
        case "nearest":
        case "bilinear":
        case "bicubic":
          i = i.affine([t / this.width, 0, 0, r / this.height], {
            interpolator: s
          });
          break;
        case "lanczos":
          i = i.resize({
            width: t,
            height: r,
            fit: "fill",
            kernel: "lanczos3"
            // PIL Lanczos uses a kernel size of 3
          });
          break;
        default:
          throw new Error(`Resampling method ${s} is not supported.`);
      }
      return await Cr(i);
    }
  }
  async pad([t, r, n, s]) {
    if (t = Math.max(t, 0), r = Math.max(r, 0), n = Math.max(n, 0), s = Math.max(s, 0), t === 0 && r === 0 && n === 0 && s === 0)
      return this;
    if (me.IS_WEB_ENV) {
      let a = this.channels, o = this.toCanvas(), i = this.width + t + r, l = this.height + n + s, c = en(i, l).getContext("2d");
      return c.drawImage(o, 0, 0, this.width, this.height, t, n, this.width, this.height), new Kt(c.getImageData(0, 0, i, l).data, i, l, 4).convert(a);
    } else {
      let a = this.toSharp().extend({ left: t, right: r, top: n, bottom: s });
      return await Cr(a);
    }
  }
  async crop([t, r, n, s]) {
    if (t = Math.max(t, 0), r = Math.max(r, 0), n = Math.min(n, this.width - 1), s = Math.min(s, this.height - 1), t === 0 && r === 0 && n === this.width - 1 && s === this.height - 1)
      return this;
    let a = n - t + 1, o = s - r + 1;
    if (me.IS_WEB_ENV) {
      let i = this.channels, l = this.toCanvas(), c = en(a, o).getContext("2d");
      return c.drawImage(l, t, r, a, o, 0, 0, a, o), new Kt(
        c.getImageData(0, 0, a, o).data,
        a,
        o,
        4
      ).convert(i);
    } else {
      let i = this.toSharp().extract({
        left: t,
        top: r,
        width: a,
        height: o
      });
      return await Cr(i);
    }
  }
  async center_crop(t, r) {
    if (this.width === t && this.height === r)
      return this;
    let n = (this.width - t) / 2, s = (this.height - r) / 2;
    if (me.IS_WEB_ENV) {
      let a = this.channels, o = this.toCanvas(), i = en(t, r).getContext("2d"), l = 0, c = 0, d = 0, h = 0;
      return n >= 0 ? l = n : d = -n, s >= 0 ? c = s : h = -s, i.drawImage(o, l, c, t, r, d, h, t, r), new Kt(
        i.getImageData(0, 0, t, r).data,
        t,
        r,
        4
      ).convert(a);
    } else {
      let a = this.toSharp();
      if (n >= 0 && s >= 0)
        a = a.extract({
          left: Math.floor(n),
          top: Math.floor(s),
          width: t,
          height: r
        });
      else if (n <= 0 && s <= 0) {
        let o = Math.floor(-s), i = Math.floor(-n);
        a = a.extend({
          top: o,
          left: i,
          // Ensures the resulting image has the desired dimensions
          right: t - this.width - i,
          bottom: r - this.height - o
        });
      } else {
        let o = [0, 0], i = 0;
        s < 0 ? (o[0] = Math.floor(-s), o[1] = r - this.height - o[0]) : i = Math.floor(s);
        let l = [0, 0], c = 0;
        n < 0 ? (l[0] = Math.floor(-n), l[1] = t - this.width - l[0]) : c = Math.floor(n), a = a.extend({
          top: o[0],
          bottom: o[1],
          left: l[0],
          right: l[1]
        }).extract({
          left: c,
          top: i,
          width: t,
          height: r
        });
      }
      return await Cr(a);
    }
  }
  async toBlob(t = "image/png", r = 1) {
    if (!me.IS_WEB_ENV)
      throw new Error("toBlob() is only supported in browser environments.");
    return await this.toCanvas().convertToBlob({ type: t, quality: r });
  }
  toTensor(t = "CHW") {
    let r = new V("uint8", new Uint8Array(this.data), [this.height, this.width, this.channels]);
    if (t !== "HWC")
      if (t === "CHW")
        r = r.permute(2, 0, 1);
      else
        throw new Error(`Unsupported channel format: ${t}`);
    return r;
  }
  toCanvas() {
    if (!me.IS_WEB_ENV)
      throw new Error("toCanvas() is only supported in browser environments.");
    let t = this.clone().rgba(), r = en(t.width, t.height), n = new Wm(t.data, t.width, t.height);
    return r.getContext("2d").putImageData(n, 0, 0), r;
  }
  /**
   * Split this image into individual bands. This method returns an array of individual image bands from an image.
   * For example, splitting an "RGB" image creates three new images each containing a copy of one of the original bands (red, green, blue).
   *
   * Inspired by PIL's `Image.split()` [function](https://pillow.readthedocs.io/en/latest/reference/Image.html#PIL.Image.Image.split).
   * @returns {RawImage[]} An array containing bands.
   */
  split() {
    let { data: t, width: r, height: n, channels: s } = this, a = (
      /** @type {any} */
      t.constructor
    ), o = t.length / s, i = Array.from({ length: s }, () => new a(o));
    for (let l = 0; l < o; ++l) {
      let c = s * l;
      for (let d = 0; d < s; ++d)
        i[d][l] = t[c + d];
    }
    return i.map((l) => new Kt(l, r, n, 1));
  }
  /**
   * Helper method to update the image data.
   * @param {Uint8ClampedArray} data The new image data.
   * @param {number} width The new width of the image.
   * @param {number} height The new height of the image.
   * @param {1|2|3|4|null} [channels] The new number of channels of the image.
   * @private
   */
  _update(t, r, n, s = null) {
    return this.data = t, this.width = r, this.height = n, s !== null && (this.channels = s), this;
  }
  /**
   * Clone the image
   * @returns {RawImage} The cloned image
   */
  clone() {
    return new Kt(this.data.slice(), this.width, this.height, this.channels);
  }
  /**
   * Helper method for converting image to have a certain number of channels
   * @param {number} numChannels The number of channels. Must be 1, 3, or 4.
   * @returns {RawImage} `this` to support chaining.
   */
  convert(t) {
    if (this.channels === t) return this;
    switch (t) {
      case 1:
        this.grayscale();
        break;
      case 3:
        this.rgb();
        break;
      case 4:
        this.rgba();
        break;
      default:
        throw new Error(`Conversion failed due to unsupported number of channels: ${this.channels}`);
    }
    return this;
  }
  /**
   * Save the image to the given path.
   * @param {string} path The path to save the image to.
   * @returns {Promise<void>}
   */
  async save(t) {
    if (me.IS_WEB_ENV) {
      if (me.IS_WEBWORKER_ENV)
        throw new Error("Unable to save an image from a Web Worker.");
      let r = t.split(".").pop().toLowerCase(), n = P2.get(r) ?? "image/png", s = await this.toBlob(n);
      return Dm(t, s);
    } else if (me.IS_FS_AVAILABLE)
      await this.toSharp().toFile(t);
    else
      throw new Error("Unable to save the image because filesystem is disabled in this environment.");
  }
  /**
   * Convert the image to a Sharp instance.
   * @returns {import('sharp').Sharp} The Sharp instance.
   */
  toSharp() {
    if (me.IS_WEB_ENV)
      throw new Error("toSharp() is only supported in server-side environments.");
    return Gi(this.data, {
      raw: {
        width: this.width,
        height: this.height,
        channels: this.channels
      }
    });
  }
}, eB = kt.read.bind(kt);
function F2(e, t, r, n, s) {
  let a = n * r ** 2, o = Math.sqrt(a / (e * t)), i = s * r, l = Math.floor(o * e / i) * i, c = Math.floor(o * t / i) * i;
  if (l === 0 && c === 0)
    throw new Error(
      `Attempting to resize to a 0 x 0 image. Resized height should be divisible by \`pooling_kernel_size * patch_size\`=${i}.`
    );
  let d = Math.floor(n / s ** 2) * i;
  return l === 0 ? (l = i, c = Math.min(Math.floor(t / e) * i, d)) : c === 0 && (c = i, l = Math.min(Math.floor(e / t) * i, d)), [l, c];
}
function I2(e, t, r, n, s, a, o) {
  let i = Math.floor(t / s), l = Math.floor(r / s), c = i * l, d = s * s * n, h = new Float32Array(a * d), _ = 0;
  for (let v = 0; v < i; ++v)
    for (let y = 0; y < l; ++y)
      for (let b = 0; b < s; ++b) {
        let k = (v * s + b) * r * n + y * s * n;
        for (let A = 0; A < s; ++A) {
          let E = k + A * n;
          for (let C = 0; C < n; ++C)
            h[_++] = e[E + C];
        }
      }
  let p = new BigInt64Array(a * 2).fill(-1n), w = 0;
  for (let v = 0; v < i; ++v)
    for (let y = 0; y < l; ++y)
      p[w++] = BigInt(y), p[w++] = BigInt(v);
  return {
    patches: new V("float32", h, [a, d]),
    positions: new V("int64", p, [a, 2]),
    num_soft_tokens: Math.floor(c / o ** 2)
  };
}
var _l = class extends mt {
  /** @param {Record<string, any>} config */
  constructor(e) {
    super(), this.config = e, this.patch_size = e.patch_size ?? 16, this.max_soft_tokens = e.max_soft_tokens ?? 280, this.pooling_kernel_size = e.pooling_kernel_size ?? 3, this.resample = e.resample ?? 3, this.rescale_factor = e.rescale_factor ?? 1 / 255, this.do_rescale = e.do_rescale ?? !0, this.do_resize = e.do_resize ?? !0, this.do_convert_rgb = e.do_convert_rgb ?? !0;
  }
  /**
   * @param {RawImage|RawImage[]} images
   * @returns {Promise<{ pixel_values: Tensor, image_position_ids: Tensor, num_soft_tokens_per_image: number[] }>}
   */
  async _call(e) {
    Array.isArray(e) || (e = [e]);
    let { patch_size: t, pooling_kernel_size: r } = this, n = this.max_soft_tokens * r ** 2, s = [], a = [], o = [];
    for (let i of e) {
      if (this.do_convert_rgb && (i = i.rgb()), this.do_resize) {
        let [_, p] = F2(
          i.height,
          i.width,
          t,
          n,
          r
        );
        (_ !== i.height || p !== i.width) && (i = await i.resize(p, _, { resample: this.resample }));
      }
      let l = Float32Array.from(i.data);
      if (this.do_rescale)
        for (let _ = 0; _ < l.length; ++_)
          l[_] *= this.rescale_factor;
      let { patches: c, positions: d, num_soft_tokens: h } = I2(
        l,
        i.height,
        i.width,
        i.channels,
        t,
        n,
        r
      );
      s.push(c), a.push(d), o.push(h);
    }
    return {
      pixel_values: fr(s, 0),
      image_position_ids: fr(a, 0),
      num_soft_tokens_per_image: o
    };
  }
}, qm = class extends Ae {
  static uses_processor_config = !0;
  static uses_chat_template_file = !0;
  constructor(e, t, r) {
    super(e, t, r), this.audio_ms_per_token = this.config.audio_ms_per_token ?? 40, this.audio_seq_length = this.config.audio_seq_length ?? 750, this.image_seq_length = this.config.image_seq_length ?? 280;
    let { audio_token: n, boa_token: s, eoa_token: a, image_token: o, boi_token: i, eoi_token: l } = this.tokenizer.config;
    this.audio_token = n, this.boa_token = s, this.eoa_token = a, this.image_token = o, this.boi_token = i, this.eoi_token = l;
  }
  static async from_pretrained(e, t = {}) {
    let [r, n, s] = await Promise.all([
      sr(e, Om, !0, t),
      Ee.from_pretrained(e, t),
      al(e, Nm, !1, t)
    ]), a = { tokenizer: n };
    return r.image_processor && (a.image_processor = new _l(r.image_processor)), r.feature_extractor && (a.feature_extractor = new Um(r.feature_extractor)), new this(r, a, s);
  }
  /**
   * Compute the number of audio soft tokens for a single waveform.
   * Replicates the audio encoder's sequence-length arithmetic:
   * mel framing → two SSCP conv layers (kernel=3, stride=2) → cap.
   * @param {number} num_samples
   * @param {number} sampling_rate
   * @returns {number}
   */
  _compute_audio_num_tokens(e, t) {
    let r = Math.round(t * 20 / 1e3), n = Math.round(t * 10 / 1e3), s = Math.floor(r / 2), a = Math.floor((e + s - r - 1) / n) + 1;
    if (a <= 0) return 0;
    for (let o = 0; o < 2; ++o) a = Math.floor((a - 1) / 2) + 1;
    return Math.min(a, this.audio_seq_length);
  }
  async _call(e, t = null, r = null, n = {}) {
    typeof e == "string" && (e = [e]);
    let s;
    if (t) {
      s = await this.image_processor(t, n);
      let o = s.num_soft_tokens_per_image, i = 0;
      e = e.map(
        (l) => l.replaceAll(
          this.image_token,
          () => `

${this.boi_token}${this.image_token.repeat(o[i++])}${this.eoi_token}

`
        )
      );
    }
    let a;
    if (r) {
      let o = Array.isArray(r) ? r : [r];
      a = await this.feature_extractor(o[0], n);
      let i = this.feature_extractor.config.sampling_rate ?? 16e3, l = 0;
      e = e.map(
        (c) => c.replaceAll(
          this.audio_token,
          () => `

${this.boa_token}${this.audio_token.repeat(this._compute_audio_num_tokens(o[l++].length, i))}${this.eoa_token}

`
        )
      );
    }
    return {
      ...this.tokenizer(e, n),
      ...s,
      ...a
    };
  }
}, Hm = class extends mt {
  /** @param {Record<string, any>} config */
  constructor(e) {
    super(), this.config = e, this.frame_processor = new _l(e), this.max_frames = e.max_frames ?? 32, this.overflow_strategy = e.overflow_strategy ?? "uniform";
  }
  /**
   * @template T
   * @param {T[]} frames
   * @returns {T[]} At most `max_frames` of the frames.
   */
  sample_frames(e) {
    let t = e.length, { max_frames: r } = this;
    if (t <= r) return e;
    if (this.overflow_strategy === "truncate") return e.slice(0, r);
    let n = r > 1 ? (t - 1) / (r - 1) : 0;
    return Array.from(
      { length: r },
      (s, a) => e[a > 0 && a === r - 1 ? t - 1 : Math.floor(a * n)]
    );
  }
  /**
   * @param {import('../../utils/video.js').RawVideo|import('../../utils/video.js').RawVideo[]} videos
   */
  async _call(e) {
    Array.isArray(e) || (e = [e]);
    let t = e.map((o) => this.sample_frames(o.frames.map((i) => i.image))), { pixel_values: r, image_position_ids: n, num_soft_tokens_per_image: s } = await this.frame_processor(
      t.flat()
    ), a = 0;
    return {
      // The frames of all videos, concatenated
      pixel_values_videos: r,
      video_position_ids: n,
      num_frames_per_video: t.map((o) => o.length),
      // The frames of a video have the same size, hence the same number of soft tokens
      num_soft_tokens_per_video: t.map(
        (o) => s[(a += o.length) - 1]
      )
    };
  }
};
function Ei(e, t) {
  return Array.isArray(e) ? e.every((r) => Array.isArray(r)) ? e : t ? [e] : e.map((r) => [r]) : [[e]];
}
function L2(e, t, r) {
  let n = 0;
  if (e = e.map((s) => s.replaceAll(t, () => r[n++] ?? "")), n !== r.length)
    throw new Error(`Found ${n} ${t} tokens in the text, but ${r.length} inputs were passed.`);
  return e;
}
var O2 = class extends qm {
  constructor(e, t, r) {
    super(e, t, r), this.video_token = this.tokenizer.config.video_token, this.video_processor = e.video_processor && new Hm(e.video_processor);
  }
  /**
   * Prepares any mix of text, images, audio and videos for `EmbeddingGemma2Model`.
   *
   * Each `<|image|>`, `<|audio|>` or `<|video|>` placeholder of the text is expanded to the soft tokens of the next
   * item of that modality, in order across the batch. Without text, each sample holds the placeholders of its media
   * (images, then videos, then audio). As in Python, a flat list of images is then a single sample, and a flat list
   * of audio clips or videos is one sample per item: pass one list per sample to group them differently.
   *
   * @param {string|string[]|null} text The text, with a placeholder per media item.
   * @param {import('../../utils/image.js').RawImage|import('../../utils/image.js').RawImage[]|import('../../utils/image.js').RawImage[][]} [images]
   * @param {Float32Array|Float32Array[]|Float32Array[][]} [audio] Mono audio at the feature extractor's sampling rate (16 kHz).
   * @param {import('../../utils/video.js').RawVideo|import('../../utils/video.js').RawVideo[]|import('../../utils/video.js').RawVideo[][]} [videos]
   * @param {Object} [options] Additional options for the tokenizer.
   */
  async _call(e, t = null, r = null, n = null, s = {}) {
    let a = [
      [this.image_token, t && Ei(t, !0)],
      [this.video_token, n && Ei(n, !1)],
      [this.audio_token, r && Ei(r, !1)]
    ];
    if (e == null) {
      let E = a.filter(([, N]) => N), C = E[0]?.[1].length;
      if (E.some(([, N]) => N.length !== C))
        throw new Error("Received a different number of samples per modality.");
      e = Array.from(
        { length: C },
        (N, M) => E.flatMap(([$, R]) => Array(R[M].length).fill($)).join(" ")
      );
    } else typeof e == "string" && (e = [e]);
    let [o, i, l] = a.map(([, E]) => E?.flat()), c = o && await this.image_processor(o), d = i && await this.video_processor(i), h = l && await this._process_audio(l), { image_token: _, video_token: p, audio_token: w, boi_token: v, eoi_token: y, boa_token: b, eoa_token: k } = this, A = {
      [_]: c?.num_soft_tokens_per_image.map(
        (E) => v + _.repeat(E) + y
      ),
      // One image-like block per frame
      [p]: d?.num_soft_tokens_per_video.map(
        (E, C) => (v + p.repeat(E) + y).repeat(d.num_frames_per_video[C])
      ),
      [w]: h?.num_soft_tokens_per_audio.map(
        (E) => b + w.repeat(E) + k
      )
    };
    for (let [E, C] of Object.entries(A))
      e = L2(e, E, C ?? []);
    return {
      ...this.tokenizer(e, { padding: !0, ...s }),
      ...c,
      ...d,
      ...h
    };
  }
  /**
   * Extracts the features of each clip and pads them to the longest one.
   * @param {Float32Array[]} clips
   */
  async _process_audio(e) {
    let t = [];
    for (let o of e)
      t.push(await this.feature_extractor(o));
    let r = Math.max(...t.map((o) => o.input_features.dims[1])), n = t[0].input_features.dims[2], s = new Float32Array(e.length * r * n), a = new Uint8Array(e.length * r);
    return t.forEach((o, i) => {
      s.set(o.input_features.data, i * r * n), a.set(o.input_features_mask.data, i * r);
    }), {
      input_features: new V("float32", s, [e.length, r, n]),
      input_features_mask: new V("bool", a, [e.length, r]),
      // The audio encoder keeps every 4th frame (two stride-2 convolutions)
      num_soft_tokens_per_audio: t.map(({ input_features_mask: { data: o } }) => {
        let i = 0;
        for (let l = 0; l < o.length; l += 4) i += Number(o[l]);
        return i;
      })
    };
  }
};
function gp(e, t, r = 0, n = null) {
  let s = e / t, a = FT(s) * t;
  return n !== null && a > n && (a = Math.floor(s) * t), a < r && (a = Math.ceil(s) * t), a;
}
function wp([e, t], r) {
  return [Math.max(Math.floor(e / r), 1) * r, Math.max(Math.floor(t / r), 1) * r];
}
function Qm([e, t, r, n]) {
  return [e - r / 2, t - n / 2, e + r / 2, t + n / 2];
}
function Sa(e, t = 0.5, r = null, n = !1) {
  let s = e.logits, a = e.pred_boxes, [o, i, l] = s.dims;
  if (r !== null && r.length !== o)
    throw Error("Make sure that you pass in as many target sizes as the batch dimension of the logits");
  let c = [];
  for (let d = 0; d < o; ++d) {
    let h = r !== null ? r[d] : null, _ = {
      boxes: [],
      classes: [],
      scores: []
    }, p = s[d], w = a[d];
    for (let v = 0; v < i; ++v) {
      let y = p[v], b = [], k;
      if (n) {
        k = y.sigmoid().data;
        for (let A = 0; A < k.length; ++A)
          k[A] > t && b.push(A);
      } else {
        let A = qe(y.data)[1];
        if (A === l - 1 || (k = at(y.data), k[A] < t))
          continue;
        b.push(A);
      }
      for (let A of b) {
        let E = w[v].data;
        E = Qm(E), h !== null && (E = E.map((C, N) => C * h[(N + 1) % 2])), _.boxes.push(E), _.classes.push(A), _.scores.push(k[A]);
      }
    }
    c.push(_);
  }
  return c;
}
function Xm(e, t = null) {
  let r = e.logits, n = r.dims[0];
  if (t !== null && t.length !== n)
    throw Error("Make sure that you pass in as many target sizes as the batch dimension of the logits");
  let s = [];
  for (let a = 0; a < n; ++a) {
    let o = t !== null ? t[a] : null, i = r[a];
    o !== null && (i = Tm(i, o, "bilinear", !1));
    let [l, c] = o ?? i.dims.slice(-2), d = new V("int32", new Int32Array(l * c), [l, c]), h = i[0].data, _ = d.data;
    for (let v = 1; v < i.dims[0]; ++v) {
      let y = i[v].data;
      for (let b = 0; b < y.length; ++b)
        y[b] > h[b] && (h[b] = y[b], _[b] = v);
    }
    let p = new Array(i.dims[0]);
    for (let v = 0; v < _.length; ++v) {
      let y = _[v];
      p[y] = y;
    }
    let w = p.filter((v) => v !== void 0);
    s.push({ segmentation: d, labels: w });
  }
  return s;
}
function N2(e, t, r, n) {
  let s = [], a = [], o = [];
  for (let i = 0; i < e.dims[0]; ++i) {
    let l = e[i], c = t[i], d = qe(l.data)[1];
    if (d === n)
      continue;
    let _ = at(l.data)[d];
    _ > r && (s.push(c), a.push(_), o.push(d));
  }
  return [s, a, o];
}
function D2(e, t, r, n = 0.5, s = 0.8) {
  let a = [], o = 0, i = 0, l = t[r].data;
  for (let d = 0; d < e.length; ++d)
    e[d] === r && (a.push(d), ++o), l[d] >= n && ++i;
  let c = o > 0 && i > 0;
  return c && (c = o / i > s), [c, a];
}
function z2(e, t, r, n, s, a = null, o = null) {
  let [i, l] = o ?? e[0].dims, c = new V("int32", new Int32Array(i * l), [i, l]), d = [];
  if (o !== null)
    for (let v = 0; v < e.length; ++v)
      e[v] = Tm(e[v], o, "bilinear", !1);
  let h = new Int32Array(e[0].data.length), _ = new Float32Array(e[0].data.length);
  for (let v = 0; v < e.length; ++v) {
    let y = t[v], b = e[v].data;
    for (let k = 0; k < b.length; ++k)
      b[k] *= y, b[k] > _[k] && (h[k] = v, _[k] = b[k]);
  }
  let p = 0, w = c.data;
  for (let v = 0; v < r.length; ++v) {
    let y = r[v], [b, k] = D2(
      h,
      e,
      v,
      n,
      s
    );
    if (b) {
      ++p;
      for (let A of k)
        w[A] = p;
      d.push({
        id: p,
        label_id: y,
        // was_fused: should_fuse, TODO
        score: t[v]
      });
    }
  }
  return [c, d];
}
function pl(e, t, r = 28, n = 3136, s = 784 * 1280, a = 1) {
  if (e < r || t < r) {
    let l = Math.max(r / e, r / t);
    e = Math.round(e * l), t = Math.round(t * l);
  }
  if (Math.max(e, t) / Math.min(e, t) > 200)
    throw new Error(
      `absolute aspect ratio must be smaller than 200, got ${Math.max(e, t) / Math.min(e, t)}`
    );
  let o = Math.round(e / r) * r, i = Math.round(t / r) * r;
  if (a * o * i > s) {
    let l = Math.sqrt(a * e * t / s);
    o = Math.max(r, Math.floor(e / l / r) * r), i = Math.max(r, Math.floor(t / l / r) * r);
  } else if (a * o * i < n) {
    let l = Math.sqrt(n / (a * e * t));
    o = Math.ceil(e * l / r) * r, i = Math.ceil(t * l / r) * r;
  }
  return [i, o];
}
function Ym(e, t = 0.5, r = 0.5, n = 0.8, s = null, a = null) {
  s === null && (le.warn("`label_ids_to_fuse` unset. No instance will be fused."), s = /* @__PURE__ */ new Set());
  let o = e.class_queries_logits ?? e.logits, l = (e.masks_queries_logits ?? e.pred_masks).sigmoid(), [c, d, h] = o.dims;
  if (h -= 1, a !== null && a.length !== c)
    throw Error("Make sure that you pass in as many target sizes as the batch dimension of the logits");
  let _ = [];
  for (let p = 0; p < c; ++p) {
    let w = a !== null ? a[p] : null, v = o[p], y = l[p], [b, k, A] = N2(
      v,
      y,
      t,
      h
    );
    if (A.length === 0) {
      let [N, M] = w ?? y.dims.slice(-2), $ = new V("int32", new Int32Array(N * M).fill(-1), [N, M]);
      _.push({
        segmentation: $,
        segments_info: []
      });
      continue;
    }
    let [E, C] = z2(
      b,
      k,
      A,
      r,
      n,
      s,
      w
    );
    _.push({
      segmentation: E,
      segments_info: C
    });
  }
  return _;
}
function Km(e, t = 0.5, r = null) {
  throw new Error("`post_process_instance_segmentation` is not yet implemented.");
}
var de = class extends mt {
  /**
   * Create an image processor from a parsed `preprocessor_config.json`.
   * @param {ImageProcessorConfig} config The configuration object.
   */
  constructor(e) {
    super(), this.image_mean = e.image_mean ?? e.mean, this.image_std = e.image_std ?? e.std, this.resample = e.resample ?? 2, this.do_rescale = e.do_rescale ?? !0, this.rescale_factor = e.rescale_factor ?? 1 / 255, this.do_normalize = e.do_normalize, this.do_thumbnail = e.do_thumbnail, this.size = e.size ?? e.image_size, this.do_resize = e.do_resize ?? this.size !== void 0, this.size_divisibility = e.size_divisibility ?? e.size_divisor, this.do_center_crop = e.do_center_crop, this.crop_size = e.crop_size, this.do_convert_rgb = e.do_convert_rgb ?? !0, this.do_crop_margin = e.do_crop_margin, this.pad_size = e.pad_size, this.do_pad = e.do_pad, this.min_pixels = e.min_pixels, this.max_pixels = e.max_pixels, this.do_pad && !this.pad_size && !this.size_divisibility && this.size && this.size.width !== void 0 && this.size.height !== void 0 && (this.pad_size = this.size), this.do_flip_channel_order = e.do_flip_channel_order ?? !1, this.config = e;
  }
  /**
   * Resize the image to make a thumbnail. The image is resized so that no dimension is larger than any
   * corresponding dimension of the specified size.
   * @param {RawImage} image The image to be resized.
   * @param {{height:number, width:number}} size The size `{"height": h, "width": w}` to resize the image to.
   * @param {string | 0 | 1 | 2 | 3 | 4 | 5} [resample=2] The resampling filter to use.
   * @returns {Promise<RawImage>} The resized image.
   */
  async thumbnail(e, t, r = 2) {
    let n = e.height, s = e.width, a = t.height, o = t.width, i = Math.min(n, a), l = Math.min(s, o);
    return i === n && l === s ? e : (n > s ? l = Math.floor(s * i / n) : s > n && (i = Math.floor(n * l / s)), await e.resize(l, i, { resample: r }));
  }
  /**
   * Crops the margin of the image. Gray pixels are considered margin (i.e., pixels with a value below the threshold).
   * @param {RawImage} image The image to be cropped.
   * @param {number} gray_threshold Value below which pixels are considered to be gray.
   * @returns {Promise<RawImage>} The cropped image.
   */
  async crop_margin(e, t = 200) {
    let r = e.clone().grayscale(), n = zi(r.data)[0], a = qe(r.data)[0] - n;
    if (a === 0)
      return e;
    let o = t / 255, i = r.width, l = r.height, c = 0, d = 0, h = r.data;
    for (let _ = 0; _ < r.height; ++_) {
      let p = _ * r.width;
      for (let w = 0; w < r.width; ++w)
        (h[p + w] - n) / a < o && (i = Math.min(i, w), l = Math.min(l, _), c = Math.max(c, w), d = Math.max(d, _));
    }
    return e = await e.crop([i, l, c, d]), e;
  }
  /**
   * Pad the image by a certain amount.
   * @param {Float32Array} pixelData The pixel data to pad.
   * @param {number[]} imgDims The dimensions of the image (height, width, channels).
   * @param {{width:number; height:number}|number|'square'} padSize The dimensions of the padded image.
   * @param {Object} options The options for padding.
   * @param {'constant'|'symmetric'} [options.mode='constant'] The type of padding to add.
   * @param {boolean} [options.center=false] Whether to center the image.
   * @param {number|number[]} [options.constant_values=0] The constant value to use for padding.
   * @returns {[Float32Array, number[]]} The padded pixel data and image dimensions.
   */
  pad_image(e, t, r, { mode: n = "constant", center: s = !1, constant_values: a = 0 } = {}) {
    let [o, i, l] = t, c, d;
    if (typeof r == "number" ? (c = r, d = r) : r === "square" ? c = d = Math.max(o, i) : (c = r.width, d = r.height), c !== i || d !== o) {
      let h = new Float32Array(c * d * l);
      if (Array.isArray(a))
        for (let w = 0; w < h.length; ++w)
          h[w] = a[w % l];
      else a !== 0 && h.fill(a);
      let [_, p] = s ? [Math.floor((c - i) / 2), Math.floor((d - o) / 2)] : [0, 0];
      for (let w = 0; w < o; ++w) {
        let v = (w + p) * c, y = w * i;
        for (let b = 0; b < i; ++b) {
          let k = (v + b + _) * l, A = (y + b) * l;
          for (let E = 0; E < l; ++E)
            h[k + E] = e[A + E];
        }
      }
      if (n === "symmetric") {
        if (s)
          throw new Error("`center` padding is not supported when `mode` is set to `symmetric`.");
        let w = o - 1, v = i - 1;
        for (let y = 0; y < d; ++y) {
          let b = y * c, k = ua(y, w) * i;
          for (let A = 0; A < c; ++A) {
            if (y < o && A < i) continue;
            let E = (b + A) * l, C = (k + ua(A, v)) * l;
            for (let N = 0; N < l; ++N)
              h[E + N] = e[C + N];
          }
        }
      }
      e = h, t = [d, c, l];
    }
    return [e, t];
  }
  /**
   * Rescale the image pixel values by `this.rescale_factor`.
   * @param {Float32Array} pixelData The pixel data to rescale.
   * @returns {void}
   */
  rescale(e) {
    for (let t = 0; t < e.length; ++t)
      e[t] = this.rescale_factor * e[t];
  }
  /**
   * Find the target (width, height) dimension of the output image after
   * resizing given the input image and the desired size.
   * @param {RawImage} image The image to resize.
   * @param {any} size The size to use for resizing the image.
   * @returns {[number, number]} The target (width, height) dimension of the output image after resizing.
   */
  get_resize_output_image_size(e, t) {
    let [r, n] = e.size, s, a;
    if (this.do_thumbnail) {
      let { height: o, width: i } = t;
      s = Math.min(o, i);
    } else Number.isInteger(t) ? (s = t, a = this.config.max_size ?? s) : t !== void 0 && (s = t.shortest_edge, a = t.longest_edge);
    if (s !== void 0 || a !== void 0) {
      let o = s === void 0 ? 1 : Math.max(s / r, s / n), i = r * o, l = n * o, c = a === void 0 ? 1 : Math.min(a / i, a / l), d = Math.floor(Number((i * c).toFixed(2))), h = Math.floor(Number((l * c).toFixed(2)));
      return this.size_divisibility !== void 0 && ([d, h] = wp(
        [d, h],
        this.size_divisibility
      )), [d, h];
    } else if (t !== void 0 && t.width !== void 0 && t.height !== void 0) {
      let o = t.width, i = t.height;
      if (this.config.keep_aspect_ratio && this.config.ensure_multiple_of) {
        let l = i / n, c = o / r;
        Math.abs(1 - c) < Math.abs(1 - l) ? l = c : c = l, i = gp(l * n, this.config.ensure_multiple_of), o = gp(c * r, this.config.ensure_multiple_of);
      }
      return [o, i];
    } else {
      if (this.size_divisibility !== void 0)
        return wp([r, n], this.size_divisibility);
      throw new Error(
        `Could not resize image due to unsupported \`this.size\` option in config: ${JSON.stringify(t)}`
      );
    }
  }
  /**
   * Resizes the image.
   * @param {RawImage} image The image to resize.
   * @returns {Promise<RawImage>} The resized image.
   */
  async resize(e) {
    let [t, r] = this.get_resize_output_image_size(e, this.size);
    return await e.resize(t, r, {
      // @ts-expect-error TS2322
      resample: this.resample
    });
  }
  /**
   * @typedef {Object} PreprocessedImage
   * @property {HeightWidth} original_size The original size of the image.
   * @property {HeightWidth} reshaped_input_size The reshaped input size of the image.
   * @property {Tensor} pixel_values The pixel values of the preprocessed image.
   */
  /**
   * Preprocesses the given image.
   *
   * @param {RawImage} image The image to preprocess.
   * @param {Object} overrides The overrides for the preprocessing options.
   * @returns {Promise<PreprocessedImage>} The preprocessed image.
   */
  async preprocess(e, {
    do_normalize: t = null,
    do_pad: r = null,
    do_convert_rgb: n = null,
    do_convert_grayscale: s = null,
    do_flip_channel_order: a = null
  } = {}) {
    this.do_crop_margin && (e = await this.crop_margin(e));
    let [o, i] = e.size;
    if (n ?? this.do_convert_rgb ? e = e.rgb() : s && (e = e.grayscale()), this.do_resize && (e = await this.resize(e)), this.do_thumbnail && (e = await this.thumbnail(e, this.size, this.resample)), this.do_center_crop) {
      let _, p;
      Number.isInteger(this.crop_size) ? (_ = this.crop_size, p = this.crop_size) : (_ = this.crop_size.width, p = this.crop_size.height), e = await e.center_crop(_, p);
    }
    let l = [e.height, e.width], c = Float32Array.from(e.data), d = [e.height, e.width, e.channels];
    if (this.do_rescale && this.rescale(c), t ?? this.do_normalize) {
      let _ = this.image_mean;
      Array.isArray(this.image_mean) || (_ = new Array(e.channels).fill(_));
      let p = this.image_std;
      if (Array.isArray(this.image_std) || (p = new Array(e.channels).fill(p)), _.length !== e.channels || p.length !== e.channels)
        throw new Error(
          `When set to arrays, the length of \`image_mean\` (${_.length}) and \`image_std\` (${p.length}) must match the number of channels in the image (${e.channels}).`
        );
      for (let w = 0; w < c.length; w += e.channels)
        for (let v = 0; v < e.channels; ++v)
          c[w + v] = (c[w + v] - _[v]) / p[v];
    }
    if (r ?? this.do_pad) {
      if (this.pad_size)
        [c, d] = this.pad_image(c, [e.height, e.width, e.channels], this.pad_size);
      else if (this.size_divisibility) {
        let _ = Math.ceil(d[1] / this.size_divisibility) * this.size_divisibility, p = Math.ceil(d[0] / this.size_divisibility) * this.size_divisibility;
        [c, d] = this.pad_image(c, d, { width: _, height: p });
      }
    }
    if (a ?? this.do_flip_channel_order) {
      if (d[2] !== 3)
        throw new Error("Flipping channel order is only supported for RGB images.");
      for (let _ = 0; _ < c.length; _ += 3) {
        let p = c[_];
        c[_] = c[_ + 2], c[_ + 2] = p;
      }
    }
    let h = new V("float32", c, d).permute(2, 0, 1);
    return {
      original_size: [i, o],
      reshaped_input_size: l,
      pixel_values: h
    };
  }
  /**
   * Preprocess one or more images and batch the result into `pixel_values`.
   * @param {RawImage|RawImage[]} images The image or images to preprocess.
   * @param {...any} args Additional arguments.
   * @returns {Promise<ImageProcessorResult>} An object containing the concatenated pixel values (and other metadata) of the preprocessed images.
   */
  async _call(e, ...t) {
    Array.isArray(e) || (e = [e]);
    let r = await Promise.all(e.map((s) => this.preprocess(s)));
    return {
      pixel_values: fr(
        r.map((s) => s.pixel_values),
        0
      ),
      // Original sizes of images
      original_sizes: r.map((s) => s.original_size),
      // Reshaped sizes of images, before padding or cropping
      reshaped_input_sizes: r.map((s) => s.reshaped_input_size)
    };
  }
  /**
   * Instantiate one of the processor classes of the library from a pretrained model.
   *
   * The processor class to instantiate is selected based on the `image_processor_type` (or `feature_extractor_type`; legacy)
   * property of the config object (either passed as an argument or loaded from `pretrained_model_name_or_path` if possible)
   *
   * @param {string} pretrained_model_name_or_path The name or path of the pretrained model. Can be either:
   * - A string, the *model id* of a pretrained processor hosted inside a model repo on huggingface.co.
   *   Valid model ids can be located at the root-level, like `bert-base-uncased`, or namespaced under a
   *   user or organization name, like `dbmdz/bert-base-german-cased`.
   * - A path to a *directory* containing processor files, e.g., `./my_model_directory/`.
   * @param {import('./utils/hub.js').PretrainedOptions} options Additional options for loading the processor.
   *
   * @returns {Promise<ImageProcessor>} A new image processor instance.
   */
  static async from_pretrained(e, t = {}) {
    let r = await sr(
      e,
      ds,
      !0,
      t
    );
    return new this(r);
  }
}, ya = {};
fs(ya, {
  BeitFeatureExtractor: () => B2,
  BitImageProcessor: () => R2,
  CHMv2ImageProcessor: () => G2,
  CLIPFeatureExtractor: () => V2,
  CLIPImageProcessor: () => Jm,
  ChineseCLIPFeatureExtractor: () => $2,
  ConvNextFeatureExtractor: () => U2,
  ConvNextImageProcessor: () => Zm,
  DINOv3ViTImageProcessor: () => q2,
  DPTFeatureExtractor: () => Q2,
  DPTImageProcessor: () => rg,
  DeiTFeatureExtractor: () => j2,
  DeiTImageProcessor: () => eg,
  DetrFeatureExtractor: () => W2,
  DetrImageProcessor: () => tg,
  DonutFeatureExtractor: () => H2,
  DonutImageProcessor: () => ml,
  EfficientNetImageProcessor: () => X2,
  GLPNFeatureExtractor: () => J2,
  Gemma3ImageProcessor: () => Y2,
  Gemma4ImageProcessor: () => _l,
  Glm46VImageProcessor: () => K2,
  GroundingDinoImageProcessor: () => Z2,
  Idefics3ImageProcessor: () => vp,
  ImageFeatureExtractor: () => de,
  ImageProcessor: () => de,
  JinaCLIPImageProcessor: () => tA,
  Lfm2VlImageProcessor: () => oA,
  LlavaOnevisionImageProcessor: () => iA,
  Mask2FormerImageProcessor: () => cA,
  MaskFormerFeatureExtractor: () => lA,
  MaskFormerImageProcessor: () => gl,
  MobileNetV1FeatureExtractor: () => uA,
  MobileNetV1ImageProcessor: () => sg,
  MobileNetV2FeatureExtractor: () => dA,
  MobileNetV2ImageProcessor: () => ag,
  MobileNetV3FeatureExtractor: () => hA,
  MobileNetV3ImageProcessor: () => og,
  MobileNetV4FeatureExtractor: () => fA,
  MobileNetV4ImageProcessor: () => ig,
  MobileViTFeatureExtractor: () => _A,
  MobileViTImageProcessor: () => lg,
  NougatImageProcessor: () => pA,
  OwlViTFeatureExtractor: () => mA,
  OwlViTImageProcessor: () => wl,
  Owlv2ImageProcessor: () => gA,
  Phi3VImageProcessor: () => vA,
  PixtralImageProcessor: () => yA,
  PvtImageProcessor: () => bA,
  Qwen2VLImageProcessor: () => ng,
  RTDetrImageProcessor: () => MA,
  Sam2ImageProcessor: () => Si,
  Sam3ImageProcessor: () => Si,
  SamImageProcessor: () => Si,
  SapiensFeatureExtractor: () => xA,
  SapiensImageProcessor: () => cg,
  SegformerFeatureExtractor: () => kA,
  SegformerImageProcessor: () => ug,
  SiglipImageProcessor: () => TA,
  SmolVLMImageProcessor: () => vp,
  Swin2SRImageProcessor: () => EA,
  VLMImageProcessor: () => eA,
  ViTFeatureExtractor: () => AA,
  ViTImageProcessor: () => dg,
  VitMatteImageProcessor: () => CA,
  VitPoseImageProcessor: () => SA,
  YolosFeatureExtractor: () => PA,
  YolosImageProcessor: () => hg
});
var B2 = class extends de {
}, R2 = class extends de {
}, $2 = class extends de {
}, G2 = class extends de {
}, Jm = class extends de {
}, V2 = class extends Jm {
}, Zm = class extends de {
  constructor(e) {
    super(e), this.crop_pct = this.config.crop_pct ?? 224 / 256;
  }
  async resize(e) {
    let t = this.size?.shortest_edge;
    if (t === void 0)
      throw new Error("Size dictionary must contain 'shortest_edge' key.");
    if (t < 384) {
      let r = Math.floor(t / this.crop_pct), [n, s] = this.get_resize_output_image_size(e, {
        shortest_edge: r
      });
      e = await e.resize(n, s, {
        resample: this.resample
      }), e = await e.center_crop(t, t);
    } else
      e = await e.resize(t, t, {
        resample: this.resample
      });
    return e;
  }
}, U2 = class extends Zm {
}, eg = class extends de {
}, j2 = class extends eg {
}, tg = class extends de {
  /**
   * Calls the feature extraction process on an array of images, preprocesses
   * each image, and concatenates the resulting features into a single Tensor.
   * @param {import('../../utils/image.js').RawImage[]} images The image(s) to extract features from.
   * @returns {Promise<DetrFeatureExtractorResult>} An object containing the concatenated pixel values of the preprocessed images.
   */
  async _call(e) {
    let t = await super._call(e), r = [t.pixel_values.dims[0], 64, 64], n = ut(r, 1n);
    return { ...t, pixel_mask: n };
  }
  /** @type {typeof post_process_object_detection} */
  post_process_object_detection(...e) {
    return Sa(...e);
  }
  /** @type {typeof post_process_panoptic_segmentation} */
  post_process_panoptic_segmentation(...e) {
    return Ym(...e);
  }
  /** @type {typeof post_process_instance_segmentation} */
  post_process_instance_segmentation(...e) {
    return Km(...e);
  }
}, W2 = class extends tg {
}, q2 = class extends de {
}, ml = class extends de {
  pad_image(e, t, r, n = {}) {
    let [s, a, o] = t, i = this.image_mean;
    Array.isArray(this.image_mean) || (i = new Array(o).fill(i));
    let l = this.image_std;
    Array.isArray(l) || (l = new Array(o).fill(i));
    let c = i.map((d, h) => -d / l[h]);
    return super.pad_image(e, t, r, {
      center: !0,
      // Since normalization is done after padding, we need to use certain constant values to ensure the same behaviour is observed.
      // For more information, see https://github.com/huggingface/transformers/blob/main/src/transformers/models/donut/image_processing_donut.py#L433-L451
      constant_values: c,
      ...n
    });
  }
}, H2 = class extends ml {
}, rg = class extends de {
}, Q2 = class extends rg {
}, X2 = class extends de {
  constructor(e) {
    super(e), this.include_top = this.config.include_top ?? !0, this.include_top && (this.image_std = this.image_std.map((t) => t * t));
  }
}, Y2 = class extends de {
}, ng = class extends de {
  constructor(e) {
    super(e), this.min_pixels = e.min_pixels ?? e.size?.shortest_edge, this.max_pixels = e.max_pixels ?? e.size?.longest_edge, this.patch_size = e.patch_size, this.merge_size = e.merge_size;
  }
  /** @type {ImageProcessor['get_resize_output_image_size']} */
  get_resize_output_image_size(e, t) {
    let r = this.patch_size * this.merge_size;
    return pl(e.height, e.width, r, this.min_pixels, this.max_pixels);
  }
  async _call(e, ...t) {
    let { pixel_values: r, original_sizes: n, reshaped_input_sizes: s } = await super._call(e, ...t), a = r, { temporal_patch_size: o, merge_size: i, patch_size: l } = this.config;
    a.dims[0] === 1 && (a = De(
      Array.from({ length: o }, () => a),
      0
    ));
    let c = a.dims[0] / o, d = a.dims[1], h = Math.floor(a.dims[2] / l), _ = Math.floor(a.dims[3] / l), p = a.view(
      c,
      o,
      d,
      Math.floor(h / i),
      i,
      l,
      Math.floor(_ / i),
      i,
      l
    ).permute(0, 3, 6, 4, 7, 2, 1, 5, 8).view(c * h * _, d * o * l * l), w = new V("int64", [c, h, _], [1, 3]);
    return {
      pixel_values: p,
      image_grid_thw: w,
      original_sizes: n,
      reshaped_input_sizes: s
    };
  }
}, K2 = class extends ng {
  /** @type {Qwen2VLImageProcessor['get_resize_output_image_size']} */
  get_resize_output_image_size(e, t) {
    let r = this.patch_size * this.merge_size, n = this.config.temporal_patch_size ?? 2;
    return pl(e.height, e.width, r, this.min_pixels, this.max_pixels, n);
  }
}, J2 = class extends de {
}, Z2 = class extends de {
  /**
   * Calls the feature extraction process on an array of images, preprocesses
   * each image, and concatenates the resulting features into a single Tensor.
   * @param {import('../../utils/image.js').RawImage[]} images The image(s) to extract features from.
   * @returns {Promise<GroundingDinoFeatureExtractorResult>} An object containing the concatenated pixel values of the preprocessed images.
   */
  async _call(e) {
    let t = await super._call(e), r = t.pixel_values.dims, n = gt([r[0], r[2], r[3]]);
    return { ...t, pixel_mask: n };
  }
}, vp = class extends de {
  constructor(e) {
    super(e), this.do_image_splitting = e.do_image_splitting ?? !0, this.max_image_size = e.max_image_size;
  }
  /**
   * @typedef {import('../../utils/image.js').RawImage} RawImage
   * @typedef {import('../../utils/tensor.js').Tensor} Tensor
   */
  /**
   * Calculate size to resize images to, to be multiples of `vision_encoder_max_size` while preserving the aspect ratio.
   * @param {Tensor} pixel_values Tensor of the image to resize.
   * @param {number} vision_encoder_max_size Maximum size of the output image. If the image is larger than this size,
   * it will be split into patches of this size, and the original image will be concatenated with the patches, resized to max_size.
   */
  get_resize_for_vision_encoder(e, t) {
    let [r, n] = e.dims.slice(-2), s = n / r;
    return n >= r ? (n = Math.ceil(n / t) * t, r = Math.floor(n / s), r = Math.ceil(r / t) * t) : (r = Math.ceil(r / t) * t, n = Math.floor(r * s), n = Math.ceil(n / t) * t), { height: r, width: n };
  }
  /** @param {RawImage|RawImage[]|RawImage[][]} images */
  async _call(e, { do_image_splitting: t = null, return_row_col_info: r = !1 } = {}) {
    let n;
    if (!Array.isArray(e))
      n = [[e]];
    else {
      if (e.length === 0 || !e[0])
        throw new Error("No images provided.");
      Array.isArray(e[0]) ? n = /** @type {RawImage[][]} */
      e : n = [
        /** @type {RawImage[]} */
        e
      ];
    }
    let s = [], a = [], o = [], i = [], l = [];
    for (let y of n) {
      let b = await Promise.all(y.map((E) => this.preprocess(E)));
      i.push(...b.map((E) => E.original_size)), l.push(...b.map((E) => E.reshaped_input_size)), b.forEach((E) => E.pixel_values.unsqueeze_(0));
      let { longest_edge: k } = this.max_image_size, A;
      if (t ?? this.do_image_splitting) {
        let E = new Array(b.length), C = new Array(b.length);
        A = await Promise.all(
          b.map(async (N, M) => {
            let $ = this.get_resize_for_vision_encoder(N.pixel_values, k), R = await Rt(N.pixel_values, {
              size: [$.height, $.width]
            }), { frames: W, num_splits_h: Q, num_splits_w: H } = await this.split_image(
              R,
              this.max_image_size
            );
            return E[M] = Q, C[M] = H, De(W, 0);
          })
        ), a.push(E), o.push(C);
      } else {
        let E = [k, k];
        A = await Promise.all(b.map((C) => Rt(C.pixel_values, { size: E }))), a.push(new Array(b.length).fill(0)), o.push(new Array(b.length).fill(0));
      }
      s.push(De(A, 0));
    }
    let c = s.length, [d, h, _, p] = s[0].dims, w, v;
    if (c === 1)
      w = s[0].unsqueeze_(0), v = ut([c, d, _, p], !0);
    else {
      let y = Math.max(...s.map((A) => A.dims.at(0)));
      v = ut([c, y, _, p], !0);
      let b = v.data, k = y * _ * p;
      for (let A = 0; A < c; ++A) {
        let E = s[A].dims[0];
        if (E < y) {
          s[A] = De(
            [s[A], ut([y - E, h, _, p], 0)],
            0
          );
          let C = A * k + E * _ * p, N = (A + 1) * k;
          b.fill(!1, C, N);
        }
      }
      w = fr(s, 0);
    }
    return {
      pixel_values: w,
      pixel_attention_mask: v,
      original_sizes: i,
      reshaped_input_sizes: l,
      ...r ? { rows: a, cols: o } : {}
    };
  }
  async split_image(e, { longest_edge: t }) {
    let r = t, n = t, s = [], [a, o] = e.dims.slice(-2), i = 0, l = 0;
    if (a > r || o > n) {
      i = Math.ceil(a / r), l = Math.ceil(o / n);
      let c = Math.ceil(a / i), d = Math.ceil(o / l);
      for (let p = 0; p < i; ++p)
        for (let w = 0; w < l; ++w) {
          let v, y, b, k;
          p === i - 1 ? (y = a - c, k = a) : (y = p * c, k = (p + 1) * c), w === l - 1 ? (v = o - d, b = o) : (v = w * d, b = (w + 1) * d);
          let C = await Em(e, [y, v], [k, b], [2, 3]);
          s.push(C);
        }
      let h = r, _ = n;
      (a !== h || o !== _) && (e = await Rt(e, {
        size: [h, _]
      }));
    }
    return s.push(e), { frames: s, num_splits_h: i, num_splits_w: l };
  }
}, eA = class extends de {
  constructor(e) {
    super({
      do_pad: !0,
      pad_size: {
        width: e.image_size,
        height: e.image_size
      },
      ...e
    }), this.constant_values = this.config.background_color.map((t) => t * this.rescale_factor);
  }
  pad_image(e, t, r, n) {
    return super.pad_image(e, t, r, {
      constant_values: this.constant_values,
      center: !0,
      ...n
    });
  }
}, tA = class extends de {
  constructor(e) {
    let { resize_mode: t, fill_color: r, interpolation: n, size: s, ...a } = e, o = t === "squash" ? { width: s, height: s } : t === "shortest" ? { shortest_edge: s } : { longest_edge: s }, i = n === "bicubic" ? 3 : 2;
    super({
      ...a,
      size: o,
      resample: i,
      do_center_crop: !0,
      crop_size: s,
      do_normalize: !0
    });
  }
};
function yp(e, t) {
  return Math.round(e / t) * t;
}
function rA(e, t, r, n, s) {
  let a = 1 / 0, o = [1, 1], i = r * n;
  for (let l of t) {
    let c = Math.abs(e - l[0] / l[1]);
    c < a ? (a = c, o = l) : c === a && i > 0.5 * s * s * l[0] * l[1] && (o = l);
  }
  return o;
}
function nA(e, t) {
  let r = [], n = /* @__PURE__ */ new Set();
  for (let s = e; s <= t; ++s)
    for (let a = 1; a <= s; ++a)
      for (let o = 1; o <= s; ++o) {
        let i = a * o;
        if (i >= e && i <= t) {
          let l = a << 16 | o;
          n.has(l) || (n.add(l), r.push([a, o]));
        }
      }
  return r.sort((s, a) => s[0] * s[1] - a[0] * a[1]);
}
function sA(e, t) {
  let [r, n, s, a] = e.dims, o = Math.floor(s / t), i = Math.floor(a / t), l = t * t * n, c = (
    /** @type {Float32Array} */
    e.data
  ), d = new Float32Array(r * o * i * l), h = s * a;
  for (let _ = 0; _ < r; ++_) {
    let p = _ * n * h, w = _ * o * i * l;
    for (let v = 0; v < o; ++v)
      for (let y = 0; y < i; ++y) {
        let b = w + (v * i + y) * l;
        for (let k = 0; k < t; ++k) {
          let A = (v * t + k) * a + y * t;
          for (let E = 0; E < t; ++E) {
            let C = A + E;
            for (let N = 0; N < n; ++N)
              d[b++] = c[p + N * h + C];
          }
        }
      }
  }
  return new V("float32", d, [r, o * i, l]);
}
function aA(e, t) {
  let [, r, n] = e.dims, s = new BigInt64Array(t);
  s.fill(1n, 0, r);
  let a = e;
  if (r < t) {
    let o = new Float32Array(t * n);
    o.set(
      /** @type {Float32Array} */
      e.data
    ), a = new V("float32", o, [1, t, n]);
  }
  return { padded: a, mask: new V("int64", s, [t]) };
}
var oA = class extends de {
  constructor(e) {
    super(e), this.downsample_factor = e.downsample_factor ?? 2, this.do_image_splitting = e.do_image_splitting ?? !0, this.min_tiles = e.min_tiles ?? 2, this.max_tiles = e.max_tiles ?? 10, this.use_thumbnail = e.use_thumbnail ?? !0, this.min_image_tokens = e.min_image_tokens ?? 64, this.max_image_tokens = e.max_image_tokens ?? 256, this.encoder_patch_size = e.encoder_patch_size ?? e.patch_size ?? 16, this.tile_size = e.tile_size ?? 512, this.max_pixels_tolerance = e.max_pixels_tolerance ?? 2, this.return_row_col_info = e.return_row_col_info ?? !1;
    let t = this.max_image_tokens * this.downsample_factor ** 2, r = this.do_image_splitting ? (this.tile_size / this.encoder_patch_size) ** 2 : 0;
    this.max_num_patches = Math.max(t, r);
  }
  /**
   * Check if the image is too large to be processed as a single tile.
   * @param {number} height
   * @param {number} width
   * @returns {boolean}
   */
  _is_image_too_large(e, t) {
    let r = this.encoder_patch_size * this.downsample_factor, n = Math.max(this.encoder_patch_size, yp(e, r)), s = Math.max(this.encoder_patch_size, yp(t, r));
    return n * s > this.max_image_tokens * (this.encoder_patch_size * this.downsample_factor) ** 2 * this.max_pixels_tolerance;
  }
  /**
   * Get the grid layout for tiling a large image.
   * @param {number} height
   * @param {number} width
   * @returns {{ grid_width: number, grid_height: number, target_width: number, target_height: number }}
   */
  _get_grid_layout(e, t) {
    let r = nA(this.min_tiles, this.max_tiles), [n, s] = rA(
      t / e,
      r,
      t,
      e,
      this.tile_size
    );
    return {
      grid_width: n,
      grid_height: s,
      target_width: this.tile_size * n,
      target_height: this.tile_size * s
    };
  }
  /** @param {RawImage|RawImage[]|RawImage[][]} images */
  // @ts-expect-error
  async _call(e, { return_row_col_info: t = null } = {}) {
    let r;
    Array.isArray(e) ? Array.isArray(e[0]) ? r = /** @type {RawImage[][]} */
    e : r = [
      /** @type {RawImage[]} */
      e
    ] : r = [[e]];
    let n = [], s = [], a = [], o = [], i = [], l = [];
    for (let d of r) {
      let h = await Promise.all(d.map((_) => this.preprocess(_, { do_pad: !1 })));
      for (let { pixel_values: _ } of h) {
        let [, p, w] = _.dims, v = _.unsqueeze_(0), y = this.encoder_patch_size * this.downsample_factor, b = y ** 2, [k, A] = pl(
          Math.max(y, p),
          Math.max(y, w),
          y,
          this.min_image_tokens * b,
          this.max_image_tokens * b
        ).map((R) => Math.max(y, R)), E, C = 1, N = 1, M = this._is_image_too_large(p, w), $ = this.do_image_splitting && !(this.min_tiles === 1 && this.max_tiles === 1);
        if (M && $) {
          let { grid_width: R, grid_height: W, target_width: Q, target_height: H } = this._get_grid_layout(
            p,
            w
          );
          C = W, N = R;
          let q = await Rt(v, {
            size: [H, Q]
          });
          E = [];
          for (let B = 0; B < W; ++B)
            for (let P = 0; P < R; ++P) {
              let X = B * this.tile_size, ce = P * this.tile_size;
              E.push(q.slice(null, null, [X, X + this.tile_size], [ce, ce + this.tile_size]));
            }
          this.use_thumbnail && R * W !== 1 && E.push(await Rt(v, { size: [A, k] }));
        } else
          E = [await Rt(v, { size: [A, k] })];
        for (let R of E) {
          let [, , W, Q] = R.dims, H = sA(R, this.encoder_patch_size), { padded: q, mask: B } = aA(H, this.max_num_patches);
          n.push(q), s.push(B), a.push([
            Math.floor(W / this.encoder_patch_size),
            Math.floor(Q / this.encoder_patch_size)
          ]);
        }
        o.push(C), i.push(N), l.push([A, k]);
      }
    }
    let c = {
      pixel_values: De(n, 0),
      pixel_attention_mask: fr(s, 0),
      spatial_shapes: new V("int64", BigInt64Array.from(a.flat(), BigInt), [
        a.length,
        2
      ])
    };
    return (t ?? this.return_row_col_info) && (c.image_rows = o, c.image_cols = i, c.image_sizes = l), c;
  }
}, iA = class extends de {
}, gl = class extends de {
  /** @type {typeof post_process_panoptic_segmentation} */
  post_process_panoptic_segmentation(...e) {
    return Ym(...e);
  }
  /** @type {typeof post_process_instance_segmentation} */
  post_process_instance_segmentation(...e) {
    return Km(...e);
  }
}, lA = class extends gl {
}, cA = class extends gl {
}, sg = class extends de {
}, uA = class extends sg {
}, ag = class extends de {
}, dA = class extends ag {
}, og = class extends de {
}, hA = class extends og {
}, ig = class extends de {
}, fA = class extends ig {
}, lg = class extends de {
}, _A = class extends lg {
}, pA = class extends ml {
}, wl = class extends de {
  /** @type {typeof post_process_object_detection} */
  post_process_object_detection(...e) {
    return Sa(...e);
  }
}, mA = class extends wl {
}, gA = class extends wl {
}, Mt = 336, wA = [2, 3], { ceil: Ai, floor: gn, sqrt: Ci } = Math, vA = class extends de {
  constructor(e) {
    super({
      ...e,
      do_normalize: !0,
      do_pad: !0,
      pad_size: "custom",
      do_convert_rgb: !0,
      do_resize: !0
      // Smart resizing "hd_transform"
    }), this._num_crops = e.num_crops;
  }
  calc_num_image_tokens_from_image_size(e, t) {
    let { num_img_tokens: r } = this.config;
    return gn(
      (gn(t / Mt) * gn(e / Mt) + 1) * r + 1 + (gn(t / Mt) + 1) * Ci(r)
    );
  }
  /** @type {ImageProcessor['get_resize_output_image_size']} */
  get_resize_output_image_size(e, t) {
    let r = this._num_crops, [n, s] = e.size, a = n / s, o = 1;
    for (; o * Math.ceil(o / a) <= r; )
      o += 1;
    o -= 1;
    let i = Math.floor(o * 336), l = Math.floor(i / a);
    return [i, l];
  }
  /** @type {ImageProcessor['pad_image']} */
  pad_image(e, t, r, n = {}) {
    let [s, a] = t, o = Mt * Ai(s / Mt), i = Mt * Ai(a / Mt), l = [1, 1, 1].map((c, d) => (c - this.image_mean[d]) / this.image_std[d]);
    return super.pad_image(
      e,
      t,
      { width: i, height: o },
      {
        center: !0,
        constant_values: l,
        ...n
      }
    );
  }
  async _call(e, { num_crops: t = null } = {}) {
    if (this._num_crops = t ??= this.config.num_crops, t < 4 || Ci(t) % 1 !== 0)
      throw new Error("num_crops must be a square number >= 4");
    Array.isArray(e) || (e = [e]);
    let r = e.length, n = await Promise.all(e.map((h) => this.preprocess(h))), s = n.map((h) => h.original_size), a = n.map((h) => h.reshaped_input_size), o = [];
    for (let { pixel_values: h } of n) {
      h.unsqueeze_(0);
      let [_, p] = h.dims.slice(-2), w = await Rt(h, {
        size: [Mt, Mt],
        mode: "bicubic"
      });
      if (t > 0) {
        let v = [], y = Ci(t), b = gn(p / y), k = gn(_ / y);
        for (let E = 0; E < y; ++E)
          for (let C = 0; C < y; ++C) {
            let N, M, $, R;
            E === y - 1 ? (M = _ - k, R = _) : (M = E * k, R = (E + 1) * k), C === y - 1 ? (N = p - b, $ = p) : (N = C * b, $ = (C + 1) * b);
            let H = await Em(h, [M, N], [R, $], wA);
            v.push(H);
          }
        let A = await Rt(De(v, 0), {
          size: [Mt, Mt],
          mode: "bicubic"
        });
        o.push(De([w, A], 0));
      } else
        o.push(w);
    }
    let i = fr(o, 0), l = a.map((h) => h.map((_) => Mt * Ai(_ / Mt))), c = new V("int64", l.flat(), [r, 2]), d = l.map(
      ([h, _]) => this.calc_num_image_tokens_from_image_size(_, h)
    );
    return { pixel_values: i, original_sizes: s, reshaped_input_sizes: a, image_sizes: c, num_img_tokens: d };
  }
}, yA = class extends de {
  /** @type {ImageProcessor['get_resize_output_image_size']} */
  get_resize_output_image_size(e, t) {
    let { longest_edge: r } = t;
    if (r === void 0)
      throw new Error("size must contain 'longest_edge'");
    let [n, s] = e.size, a = Math.max(n, s) / r, o = n, i = s;
    a > 1 && (o = Math.floor(n / a), i = Math.floor(s / a));
    let { patch_size: l, spatial_merge_size: c } = this.config;
    if (!c)
      throw new Error("config must contain 'spatial_merge_size'");
    let d = l * c, h = Math.floor((o - 1) / d) + 1, _ = Math.floor((i - 1) / d) + 1;
    return [h * d, _ * d];
  }
}, bA = class extends de {
}, MA = class extends de {
  /** @type {typeof post_process_object_detection} */
  post_process_object_detection(...e) {
    return Sa(...e);
  }
}, Si = class extends de {
  /**
   *
   * @param {any} input_points
   * @param {import("../../image_processors_utils.js").HeightWidth[]} original_sizes
   * @param {import("../../image_processors_utils.js").HeightWidth[]} reshaped_input_sizes
   * @returns {Tensor}
   */
  reshape_input_points(e, t, r, n = !1) {
    e = structuredClone(e);
    let s = I_(e);
    if (s.length === 3)
      n || (s = [1, ...s]), e = [e];
    else if (s.length !== 4)
      throw Error(
        "The input_points must be a 4D tensor of shape `batch_size`, `point_batch_size`, `nb_points_per_image`, `2`."
      );
    for (let a = 0; a < e.length; ++a) {
      let [o, i] = t[a], [l, c] = r[a], d = [c / i, l / o];
      for (let h = 0; h < e[a].length; ++h)
        for (let _ = 0; _ < e[a][h].length; ++_)
          for (let p = 0; p < e[a][h][_].length; ++p)
            e[a][h][_][p] *= d[p % 2];
    }
    return new V("float32", Float32Array.from(e.flat(1 / 0)), s);
  }
  /**
   *
   * @param {any} input_labels
   * @param {Tensor} input_points
   * @returns {Tensor}
   */
  add_input_labels(e, t) {
    let r = I_(e);
    if (r.length === 2)
      r = [1, ...r], e = [e];
    else if (r.length !== 3)
      throw Error(
        "The input_points must be a 4D tensor of shape `batch_size`, `point_batch_size`, `nb_points_per_image`, `2`."
      );
    if (r.some((n, s) => n !== t.dims[s]))
      throw Error(`The first ${r.length} dimensions of 'input_points' and 'input_labels' must be the same.`);
    return new V("int64", e.flat(1 / 0).map(BigInt), r);
  }
  /**
   * @param {any[]} images The URL(s) of the image(s) to extract features from.
   * @param {Object} [options] Additional options for the processor.
   * @param {any} [options.input_points=null] A 3D or 4D array, representing the input points provided by the user.
   * - 3D: `[point_batch_size, nb_points_per_image, 2]`. In this case, `batch_size` is assumed to be 1.
   * - 4D: `[batch_size, point_batch_size, nb_points_per_image, 2]`.
   * @param {any} [options.input_labels=null] A 2D or 3D array, representing the input labels for the points, used by the prompt encoder to encode the prompt.
   * - 2D: `[point_batch_size, nb_points_per_image]`. In this case, `batch_size` is assumed to be 1.
   * - 3D: `[batch_size, point_batch_size, nb_points_per_image]`.
   * @param {number[][][]} [options.input_boxes=null] A 3D array of shape `(batch_size, num_boxes, 4)`, representing the input boxes provided by the user.
   * This is used by the prompt encoder to encode the prompt. Generally yields to much better generated masks.
   * The processor will generate a tensor, with each dimension corresponding respectively to the image batch size,
   * the number of boxes per image and the coordinates of the top left and botton right point of the box.
   * In the order (`x1`, `y1`, `x2`, `y2`):
   * - `x1`: the x coordinate of the top left point of the input box
   * - `y1`: the y coordinate of the top left point of the input box
   * - `x2`: the x coordinate of the bottom right point of the input box
   * - `y2`: the y coordinate of the bottom right point of the input box
   * @returns {Promise<SamImageProcessorResult>}
   */
  async _call(e, { input_points: t = null, input_labels: r = null, input_boxes: n = null } = {}) {
    let s = await super._call(e);
    if (t && (s.input_points = this.reshape_input_points(
      t,
      s.original_sizes,
      s.reshaped_input_sizes
    )), r) {
      if (!s.input_points)
        throw Error("`input_points` must be provided if `input_labels` are provided.");
      s.input_labels = this.add_input_labels(r, s.input_points);
    }
    return n && (s.input_boxes = this.reshape_input_points(
      n,
      s.original_sizes,
      s.reshaped_input_sizes,
      !0
    )), s;
  }
  /**
   * Remove padding and upscale masks to the original image size.
   * @param {Tensor} masks Batched masks from the mask_decoder in (batch_size, num_channels, height, width) format.
   * @param {[number, number][]} original_sizes The original sizes of each image before it was resized to the model's expected input shape, in (height, width) format.
   * @param {[number, number][]} reshaped_input_sizes The size of each image as it is fed to the model, in (height, width) format. Used to remove padding.
   * @param {Object} options Optional parameters for post-processing.
   * @param {number} [options.mask_threshold] The threshold to use for binarizing the masks.
   * @param {boolean} [options.binarize] Whether to binarize the masks.
   * @param {Object} [options.pad_size] The target size the images were padded to before being passed to the model. If `null`, the target size is assumed to be the processor's `pad_size`.
   * @param {number} [options.pad_size.height] The height the images were padded to.
   * @param {number} [options.pad_size.width] The width the images were padded to.
   * @returns {Promise<Tensor[]>} Batched masks in batch_size, num_channels, height, width) format, where (height, width) is given by original_size.
   */
  async post_process_masks(e, t, r, { mask_threshold: n = 0, binarize: s = !0, pad_size: a = null } = {}) {
    let o = [];
    a = a ?? this.pad_size ?? this.size;
    let i = [a.height, a.width];
    for (let l = 0; l < t.length; ++l) {
      let c = t[l], d = r[l], h = await Rt(e[l], { mode: "bilinear", size: i });
      if (h = h.slice(
        null,
        null,
        [0, d[0]],
        [0, d[1]]
      ), h = await Rt(h, { mode: "bilinear", size: c }), s) {
        let _ = h.data, p = new Uint8Array(_.length);
        for (let w = 0; w < _.length; ++w)
          _[w] > n && (p[w] = 1);
        h = new V("bool", p, h.dims);
      }
      o.push(h);
    }
    return o;
  }
  /**
   * Generates a list of crop boxes of different sizes. Each layer has (2**i)**2 boxes for the ith layer.
   * @param {import("../../utils/image.js").RawImage} image Input original image
   * @param {number} target_size Target size of the resized image
   * @param {Object} options Options for generating crop boxes
   * @param {number} [options.crop_n_layers] If >0, mask prediction will be run again on crops of the image.
   * Sets the number of layers to run, where each layer has 2**i_layer number of image crops.
   * @param {number} [options.overlap_ratio] Sets the degree to which crops overlap. In the first crop layer,
   * crops will overlap by this fraction of the image length. Later layers with more crops scale down this overlap.
   * @param {number} [options.points_per_crop] Number of points to sample from each crop.
   * @param {number} [options.crop_n_points_downscale_factor] The number of points-per-side sampled in layer n is
   * scaled down by crop_n_points_downscale_factor**n.
   * @returns {Object} An object containing the crop boxes, number of points per crop, cropped images, and input labels.
   */
  generate_crop_boxes(e, t, {
    crop_n_layers: r = 0,
    overlap_ratio: n = 512 / 1500,
    points_per_crop: s = 32,
    crop_n_points_downscale_factor: a = 1
  } = {}) {
  }
}, cg = class extends de {
  /** @type {typeof post_process_semantic_segmentation} */
  post_process_semantic_segmentation(...e) {
    return Xm(...e);
  }
}, xA = class extends cg {
}, ug = class extends de {
  /** @type {typeof post_process_semantic_segmentation} */
  post_process_semantic_segmentation(...e) {
    return Xm(...e);
  }
}, kA = class extends ug {
}, TA = class extends de {
}, EA = class extends de {
  pad_image(e, t, r, n = {}) {
    let [s, a, o] = t;
    return super.pad_image(
      e,
      t,
      {
        // NOTE: For Swin2SR models, the original python implementation adds padding even when the image's width/height is already
        // a multiple of `pad_size`. However, this is most likely a bug (PR: https://github.com/mv-lab/swin2sr/pull/19).
        // For this reason, we only add padding when the image's width/height is not a multiple of `pad_size`.
        width: a + (r - a % r) % r,
        height: s + (r - s % r) % r
      },
      {
        mode: "symmetric",
        center: !1,
        constant_values: -1,
        ...n
      }
    );
  }
}, dg = class extends de {
}, AA = class extends dg {
}, CA = class extends de {
  /**
   * Calls the feature extraction process on an array of images, preprocesses
   * each image, and concatenates the resulting features into a single Tensor.
   * @param {import("../../utils/image.js").RawImage[]} images The image(s) to extract features from.
   * @param {import("../../utils/image.js").RawImage[]} trimaps The trimaps(s) to extract features from.
   * @returns {Promise<import("../../image_processors_utils.js").ImageProcessorResult>} An object containing the concatenated pixel values of the preprocessed images.
   */
  async _call(e, t) {
    Array.isArray(e) || (e = [e]), Array.isArray(t) || (t = [t]);
    let r = await Promise.all(e.map((a) => this.preprocess(a))), n = await Promise.all(
      t.map(
        (a) => this.preprocess(a, {
          do_normalize: !1,
          do_convert_rgb: !1,
          do_convert_grayscale: !0
        })
      )
    );
    return {
      pixel_values: fr(
        r.map(
          // Concatenate images and trimaps
          (a, o) => De([a.pixel_values, n[o].pixel_values], 0)
        ),
        0
      ),
      // Original sizes of images
      original_sizes: r.map((a) => a.original_size),
      // Reshaped sizes of images, before padding or cropping
      reshaped_input_sizes: r.map((a) => a.reshaped_input_size)
    };
  }
}, SA = class extends de {
  /**
   * Transform the heatmaps into keypoint predictions and transform them back to the image.
   * NOTE: This is a naive implementation and does not include advanced post-processing techniques,
   * so the results may not be as accurate as the original implementation.
   * @param {import('../../utils/tensor.js').Tensor} outputs The model outputs.
   * @param {[number, number, number, number][][]} boxes List or array of bounding boxes for each image.
   * Each box should be a list of 4 floats representing the bounding box coordinates in COCO format (top_left_x, top_left_y, width, height).
   * @returns {{
   *   bbox: [number, number, number, number],
   *   scores: number[],
   *   labels: number[],
   *   keypoints: [number, number][]
   * }[][]} List of keypoints predictions for each image.
   */
  post_process_pose_estimation(e, t, {
    threshold: r = null
    // TODO:
    // kernel_size = 11,
    // target_sizes = null,
  } = {}) {
    let n = e.tolist(), [s, a, o, i] = e.dims, l = [];
    for (let c = 0; c < s; ++c) {
      let d = n[c], h = t[c], _ = [];
      for (let p = 0; p < h.length; ++p) {
        let w = h[p], v = [], y = [], b = [], k = w.at(-2) / i, A = w.at(-1) / o;
        for (let E = 0; E < d.length; ++E) {
          let [C, N] = [0, 0], M = 0, $ = -1 / 0, R = d[E];
          for (let Q = 0; Q < R.length; ++Q) {
            let H = R[Q];
            for (let q = 0; q < H.length; ++q) {
              let B = H[q];
              M += B, $ = Math.max($, B), C += (q + 0.5) * B, N += Q * B;
            }
          }
          if (r != null && $ < r) continue;
          let W = [k * C / M, A * N / M];
          v.push(W), b.push(E), y.push($);
        }
        _.push({
          bbox: w,
          scores: y,
          labels: b,
          keypoints: v
        });
      }
      l.push(_);
    }
    return l;
  }
}, hg = class extends de {
  /** @type {typeof post_process_object_detection} */
  post_process_object_detection(...e) {
    return Sa(...e);
  }
}, PA = class extends hg {
}, ht = class {
  /** @type {typeof ImageProcessor.from_pretrained} */
  static async from_pretrained(e, t = {}) {
    let r = await sr(
      e,
      ds,
      !0,
      t
    ), n = r.image_processor_type ?? r.feature_extractor_type, s = ya[n?.replace(/Fast$/, "")];
    return s || (n !== void 0 && le.warn(
      `Image processor type '${n}' not found, assuming base ImageProcessor. Please report this at ${Ca}.`
    ), s = de), new s(r);
  }
}, FA = class extends Ae {
  static tokenizer_class = Ee;
  static image_processor_class = ht;
  constructor(e, t, r) {
    super(e, t, r);
    let {
      // @ts-expect-error TS2339
      tasks_answer_post_processing_type: n,
      // @ts-expect-error TS2339
      task_prompts_without_inputs: s,
      // @ts-expect-error TS2339
      task_prompts_with_input: a
    } = this.image_processor.config;
    this.tasks_answer_post_processing_type = new Map(Object.entries(n ?? {})), this.task_prompts_without_inputs = new Map(Object.entries(s ?? {})), this.task_prompts_with_input = new Map(Object.entries(a ?? {})), this.regexes = {
      quad_boxes: /(.+?)<loc_(\d+)><loc_(\d+)><loc_(\d+)><loc_(\d+)><loc_(\d+)><loc_(\d+)><loc_(\d+)><loc_(\d+)>/gm,
      bboxes: /([^<]+)?<loc_(\d+)><loc_(\d+)><loc_(\d+)><loc_(\d+)>/gm
    }, this.size_per_bin = 1e3;
  }
  /**
   * Helper function to construct prompts from input texts
   * @param {string|string[]} text
   * @returns {string[]}
   */
  construct_prompts(e) {
    typeof e == "string" && (e = [e]);
    let t = [];
    for (let r of e)
      if (this.task_prompts_without_inputs.has(r))
        t.push(this.task_prompts_without_inputs.get(r));
      else {
        for (let [n, s] of this.task_prompts_with_input)
          if (r.includes(n)) {
            t.push(s.replaceAll("{input}", r).replaceAll(n, ""));
            break;
          }
        t.length !== e.length && t.push(r);
      }
    return t;
  }
  /**
   * Post-process the output of the model to each of the task outputs.
   * @param {string} text The text to post-process.
   * @param {string} task The task to post-process the text for.
   * @param {[number, number]} image_size The size of the image. height x width.
   */
  post_process_generation(e, t, r) {
    let n = this.tasks_answer_post_processing_type.get(t) ?? "pure_text";
    e = e.replaceAll("<s>", "").replaceAll("</s>", "");
    let s;
    switch (n) {
      case "pure_text":
        s = e;
        break;
      case "description_with_bboxes":
      case "bboxes":
      case "phrase_grounding":
      case "ocr":
        let a = n === "ocr" ? "quad_boxes" : "bboxes", o = e.matchAll(this.regexes[a]), i = [], l = [];
        for (let [c, d, ...h] of o)
          i.push(d ? d.trim() : i.at(-1) ?? ""), l.push(
            h.map(
              (_, p) => (
                // NOTE: Add 0.5 to use the center position of the bin as the coordinate.
                (Number(_) + 0.5) / this.size_per_bin * r[p % 2]
              )
            )
          );
        s = { labels: i, [a]: l };
        break;
      default:
        throw new Error(`Task "${t}" (of type "${n}") not yet implemented.`);
    }
    return { [t]: s };
  }
  // NOTE: images and text are switched from the python version
  // `images` is required, `text` is optional
  async _call(e, t = null, r = {}) {
    if (!e && !t)
      throw new Error("Either text or images must be provided");
    let n = await this.image_processor(e, r), s = t ? this.tokenizer(this.construct_prompts(t), r) : {};
    return {
      ...n,
      ...s
    };
  }
}, IA = class extends Ae {
  static tokenizer_class = Ee;
  static image_processor_class = ht;
  static uses_processor_config = !0;
  static uses_chat_template_file = !0;
  constructor(e, t, r) {
    super(e, t, r), this.image_seq_length = this.config.image_seq_length;
    let { boi_token: n, image_token: s, eoi_token: a } = this.tokenizer.config;
    this.boi_token = n, this.image_token = s, this.eoi_token = a;
    let o = s.repeat(this.image_seq_length);
    this.full_image_sequence = `

${n}${o}${a}

`;
  }
  /**
   * @param {string|string[]} text
   * @param {import('../../utils/image.js').RawImage|import('../../utils/image.js').RawImage[]} [images]
   * @param {Object} [options]
   */
  async _call(e, t = null, r = {}) {
    typeof e == "string" && (e = [e]);
    let n;
    return t && (n = await this.image_processor(t, r), e = e.map((a) => a.replaceAll(this.boi_token, this.full_image_sequence))), {
      ...this.tokenizer(e, r),
      ...n
    };
  }
}, LA = class extends Ae {
  static image_processor_class = ht;
  static feature_extractor_class = Ft;
  static tokenizer_class = Ee;
  static uses_processor_config = !0;
  static uses_chat_template_file = !0;
  constructor(e, t, r) {
    super(e, t, r), this.audio_seq_length = this.config.audio_seq_length, this.image_seq_length = this.config.image_seq_length;
    let {
      // Audio tokens
      audio_token_id: n,
      boa_token: s,
      audio_token: a,
      eoa_token: o,
      // Image tokens
      image_token_id: i,
      boi_token: l,
      image_token: c,
      eoi_token: d
    } = this.tokenizer.config;
    this.audio_token_id = n, this.boa_token = s, this.audio_token = a;
    let h = a.repeat(this.audio_seq_length);
    this.full_audio_sequence = `

${s}${h}${o}

`, this.image_token_id = i, this.boi_token = l, this.image_token = c;
    let _ = c.repeat(this.image_seq_length);
    this.full_image_sequence = `

${l}${_}${d}

`;
  }
  /**
   *
   * @param {string|string[]} text
   * @param {RawImage|RawImage[]|RawImage[][]} images
   * @param {RawAudio|RawAudio[]|RawAudio[][]} audio
   * @returns {Promise<any>}
   */
  async _call(e, t = null, r = null, n = {}) {
    typeof e == "string" && (e = [e]);
    let s;
    r && (s = await this.feature_extractor(r, n), e = e.map((i) => i.replaceAll(this.audio_token, this.full_audio_sequence)));
    let a;
    return t && (a = await this.image_processor(t, n), e = e.map((i) => i.replaceAll(this.image_token, this.full_image_sequence))), {
      ...this.tokenizer(e, n),
      ...a,
      ...s
    };
  }
}, vl = class extends Ae {
  static image_processor_class = ht;
  static tokenizer_class = Ee;
  static image_token = "<|image_pad|>";
  /**
   *
   * @param {string|string[]} text
   * @param {RawImage|RawImage[]} images
   * @param  {...any} args
   * @returns {Promise<any>}
   */
  async _call(e, t = null, ...r) {
    Array.isArray(e) || (e = [e]);
    let n, s;
    if (t && (n = await this.image_processor(t), s = n.image_grid_thw), s) {
      let o = this.image_processor.config.merge_size ** 2, i = 0, l = (
        /** @type {typeof Qwen2VLProcessor} */
        this.constructor.image_token
      ), c = s.tolist();
      e = e.map((d) => {
        for (; d.includes(l); ) {
          let h = Number(c[i++].reduce((_, p) => _ * p, 1n));
          d = d.replace(l, "<|placeholder|>".repeat(Math.floor(h / o)));
        }
        return d.replaceAll("<|placeholder|>", l);
      });
    }
    return {
      ...this.tokenizer(e),
      ...n
    };
  }
}, OA = class extends vl {
  static image_token = "<|image|>";
}, NA = class extends Ae {
  static tokenizer_class = Ee;
  static feature_extractor_class = Ft;
  static uses_processor_config = !0;
  /**
   * Compute the number of audio tokens for a given raw audio length.
   * @param {number} audioLength Raw audio sample count.
   * @returns {number} Number of projector output tokens.
   */
  _get_num_audio_features(e) {
    let { hop_length: t } = this.feature_extractor.config.melspec_kwargs, { projector_window_size: r, projector_downsample_rate: n } = this.feature_extractor.config, s = Math.floor(r / n), a = Math.floor(e / t) + 1, o = Math.floor(a / 2);
    return Math.ceil(o / r) * s;
  }
  /**
   * @param {string} text The text input to process.
   * @param {Float32Array} audio The audio input to process.
   */
  async _call(e, t = null, r = {}) {
    if (Array.isArray(e))
      throw new Error("Batched inputs are not supported yet.");
    let n = {};
    if (t) {
      let { input_features: a } = await this.feature_extractor(t);
      n.input_features = a;
      let o = this._get_num_audio_features(t.length), i = new Uint8Array(o).fill(1);
      n.input_features_mask = new V("bool", i, [1, o]);
      let l = this.config.audio_token ?? "<|audio|>";
      if (!e.includes(l))
        throw new Error(`The input text does not contain the audio token ${l}.`);
      e = e.replaceAll(l, l.repeat(o));
    }
    return {
      ...this.tokenizer(e, {
        add_special_tokens: !1,
        ...r
      }),
      ...n
    };
  }
};
function DA(e, t) {
  let n = e.dims.at(-1) - 1, s = e.tolist();
  s.fill(!1, 0, 1), s.fill(!1, n);
  let a = t.tolist();
  return s.map((o, i) => o ? i : null).filter((o) => o !== null).map((o) => a[o]);
}
var zA = class extends Ae {
  static tokenizer_class = Ee;
  static image_processor_class = ht;
  /**
   * @typedef {import('../../utils/image.js').RawImage} RawImage
   */
  /**
   *
   * @param {RawImage|RawImage[]|RawImage[][]} images
   * @param {string|string[]} text
   * @returns {Promise<any>}
   */
  async _call(e, t, r = {}) {
    let n = e ? await this.image_processor(e, r) : {};
    return {
      ...t ? this.tokenizer(t, r) : {},
      ...n
    };
  }
  post_process_grounded_object_detection(e, t, { box_threshold: r = 0.25, text_threshold: n = 0.25, target_sizes: s = null } = {}) {
    let { logits: a, pred_boxes: o } = e, i = a.dims[0];
    if (s !== null && s.length !== i)
      throw Error("Make sure that you pass in as many target sizes as the batch dimension of the logits");
    let l = a.dims.at(1), c = a.sigmoid(), d = c.max(-1).tolist(), h = o.tolist().map((p) => p.map((w) => Qm(w))), _ = [];
    for (let p = 0; p < i; ++p) {
      let w = s !== null ? s[p] : null;
      w !== null && (h[p] = h[p].map((A) => A.map((E, C) => E * w[(C + 1) % 2])));
      let v = d[p], y = [], b = [], k = [];
      for (let A = 0; A < l; ++A) {
        let E = v[A];
        if (E <= r)
          continue;
        let C = h[p][A], N = c[p][A];
        y.push(E), k.push(C);
        let M = DA(N.gt(n), t[p]);
        b.push(M);
      }
      _.push({ scores: y, boxes: k, labels: this.batch_decode(b) });
    }
    return _;
  }
};
function BA(e, t, r, n, s, a) {
  let o = "";
  for (let i = 0; i < t; ++i) {
    for (let l = 0; l < r; ++l)
      o += n + `<row_${i + 1}_col_${l + 1}>` + s.repeat(e);
    o += `
`;
  }
  return o += `
${n}${a}` + s.repeat(e) + `${n}`, o;
}
function RA(e, t, r, n) {
  return `${t}${n}` + r.repeat(e) + `${t}`;
}
function $A(e, t, r, n, s, a) {
  return e === 0 && t === 0 ? RA(r, n, s, a) : BA(
    r,
    e,
    t,
    n,
    s,
    a
  );
}
var bp = class extends Ae {
  static image_processor_class = ht;
  static tokenizer_class = Ee;
  static uses_processor_config = !0;
  fake_image_token = "<fake_token_around_image>";
  image_token = "<image>";
  global_img_token = "<global-img>";
  /**
   *
   * @param {string|string[]} text
   * @param {RawImage|RawImage[]|RawImage[][]} images
   * @returns {Promise<any>}
   */
  async _call(e, t = null, r = {}) {
    r.return_row_col_info ??= !0;
    let n;
    t && (n = await this.image_processor(t, r)), Array.isArray(e) || (e = [e]);
    let s = n.rows ?? [new Array(e.length).fill(0)], a = n.cols ?? [new Array(e.length).fill(0)], o = this.config.image_seq_len, i = [], l = [];
    for (let d = 0; d < e.length; ++d) {
      let h = e[d], _ = s[d], p = a[d];
      i.push(zM(h, this.image_token));
      let w = _.map(
        (b, k) => $A(
          b,
          p[k],
          o,
          this.fake_image_token,
          this.image_token,
          this.global_img_token
        )
      ), v = h.split(this.image_token);
      if (v.length === 0)
        throw new Error("The image token should be present in the text.");
      let y = v[0];
      for (let b = 0; b < w.length; ++b)
        y += w[b] + v[b + 1];
      l.push(y);
    }
    return {
      ...this.tokenizer(l),
      ...n
    };
  }
}, GA = class extends Ae {
  static image_processor_class = ht;
  static tokenizer_class = Ee;
  static uses_processor_config = !0;
  constructor(e, t, r) {
    super(e, t, r), this.image_tag = this.config.image_tag, this.image_start_tag = this.config.image_start_tag, this.image_end_tag = this.config.image_end_tag, this.num_image_tokens = this.config.num_image_tokens;
  }
  /**
   * @typedef {Object} MultimodalMessageProperties Additional properties for multimodal messages.
   * @property {(RawImage | string | URL)[]} [images] The images in the message.
   * @typedef {(import('../../tokenization_utils.js').Message & MultimodalMessageProperties)[]} MultimodalConversation The conversation possibly containing multimodal inputs.
   */
  /**
   * @typedef {Object} VLCChatProcessorResult The processed input.
   * @property {Tensor} input_ids The input IDs.
   * @property {Tensor} attention_mask The attention mask.
   * @property {Tensor} images_seq_mask The image sequence mask.
   * @property {Tensor} images_emb_mask The image embedding mask.
   */
  /**
   * @param {MultimodalConversation} conversation The chat messages to process.
   * @param {Object} options Additional options for processing.
   * @param {RawImage|RawImage[]} [options.images] The images to process, if not set in the conversation.
   * @param {string} [options.chat_template="default"] The chat template to use.
   * @returns {Promise<VLCChatProcessorResult | VLCChatProcessorResult & import('../../image_processors_utils.js').ImageProcessorResult>} The processed input.
   */
  async _call(e, { images: t = null, chat_template: r = "default" } = {}) {
    t ? Array.isArray(t) || (t = [t]) : t = await Promise.all(
      e.filter((v) => v.images).flatMap((v) => v.images).map((v) => kt.read(v))
    );
    let n = this.tokenizer, s = n.apply_chat_template(e, {
      tokenize: !1,
      add_generation_prompt: !0,
      chat_template: r
    }), a = (v) => n.encode(v, { add_special_tokens: !1 }), o = (
      /** @type {string} */
      s.split(this.image_tag)
    ), i = o.length - 1;
    if (t.length !== i)
      throw new Error(
        `Number of images provided (${t.length}) does not match number of "${this.image_tag}" image tags (${i})`
      );
    let [l, c, d] = n.convert_tokens_to_ids([
      this.image_tag,
      this.image_start_tag,
      this.image_end_tag
    ]), h = a(o[0]), _ = new Array(h.length).fill(!1);
    for (let v = 1; v < o.length; ++v) {
      let y = new Array(this.num_image_tokens).fill(l), b = a(o[v]);
      h = er(
        h,
        [c],
        y,
        [d],
        b
      );
      let k = new Array(this.num_image_tokens).fill(!0);
      _ = er(
        _,
        [!1],
        k,
        [!1],
        new Array(b.length).fill(!1)
      );
    }
    let p = [1, h.length], w = {
      input_ids: new V("int64", h, p),
      attention_mask: new V("int64", new Array(h.length).fill(1), p),
      images_seq_mask: new V("bool", _, p),
      images_emb_mask: new V("bool", new Array(i * this.num_image_tokens).fill(!0), [
        1,
        i,
        this.num_image_tokens
      ])
    };
    if (t && t.length > 0) {
      let v = await this.image_processor(t);
      return v.pixel_values.unsqueeze_(0), { ...w, ...v };
    }
    return w;
  }
}, VA = class extends Ae {
  static tokenizer_class = Ee;
  static image_processor_class = ht;
  async _call(e = null, t = null, r = {}) {
    if (!e && !t)
      throw new Error("Either text or images must be provided");
    let n = e ? this.tokenizer(e, r) : {}, s = t ? await this.image_processor(t, r) : {};
    return {
      ...n,
      ...s
    };
  }
}, UA = class extends Ae {
  static tokenizer_class = Ee;
  static image_processor_class = ht;
  /**
   * @param {RawImage|RawImage[]} images
   * @param {string|string[]|null} [text]
   * @param {Record<string, any>} [kwargs]
   */
  async _call(e, t = null, r = {}) {
    let { image_rows: n, image_cols: s, image_sizes: a, ...o } = await this.image_processor(e, {
      ...r,
      return_row_col_info: !0
    });
    if (t) {
      let i = this.config.image_token ?? "<image>", {
        tile_size: l = 512,
        downsample_factor: c = 2,
        encoder_patch_size: d = 16,
        use_thumbnail: h = !0
      } = (
        /** @type {Record<string, any>} */
        this.image_processor.config
      ), _ = (k) => Math.ceil(Math.floor(k / d) / c), p = _(l) ** 2, w = this.config.image_start_token ?? "<|image_start|>", v = this.config.image_end_token ?? "<|image_end|>", y = this.config.image_thumbnail ?? "<|img_thumbnail|>";
      Array.isArray(t) || (t = [t]);
      let b = 0;
      t = t.map((k) => {
        let A = k.split(i);
        return A[0] + A.slice(1).map((E) => {
          let C = b++, [N, M] = a[C], $ = n[C], R = s[C], W = _(N) * _(M), Q = w;
          if ($ > 1 || R > 1) {
            let H = i.repeat(p);
            for (let q = 0; q < $; ++q)
              for (let B = 0; B < R; ++B)
                Q += `<|img_row_${q + 1}_col_${B + 1}|>` + H;
            h && (Q += y + i.repeat(W));
          } else
            Q += i.repeat(W);
          return Q + v + E;
        }).join("");
      });
    }
    return {
      ...o,
      ...t ? this.tokenizer(t, r) : {}
    };
  }
}, jA = class extends Ae {
  static tokenizer_class = Ee;
  static image_processor_class = ht;
  static uses_processor_config = !0;
  /**
   * @typedef {import('../../utils/image.js').RawImage} RawImage
   */
  // `images` is required, `text` is optional
  async _call(e, t = null, r = {}) {
    let n = await this.image_processor(e, r);
    if (t) {
      let [a, o] = n.pixel_values.dims.slice(-2), { image_token: i, patch_size: l, num_additional_image_tokens: c } = this.config, d = Math.floor(a / l) * Math.floor(o / l) + c;
      t = structuredClone(t), Array.isArray(t) || (t = [t]);
      for (let h = 0; h < t.length; ++h)
        t[h] = t[h].replace(i, i.repeat(d));
    }
    let s = t ? this.tokenizer(t, r) : {};
    return {
      ...n,
      ...s
    };
  }
}, Mp = {
  char: ["char_decode", 1],
  bpe: ["bpe_decode", 2],
  wp: ["wp_decode", 102]
}, WA = class extends Ae {
  static tokenizer_class = Ee;
  static image_processor_class = ht;
  /**
   * @returns {import('./tokenization_mgp_str.js').MgpstrTokenizer} The character tokenizer.
   */
  get char_tokenizer() {
    return this.components.char_tokenizer;
  }
  /**
   * @returns {import('../gpt2/tokenization_gpt2.js').GPT2Tokenizer} The BPE tokenizer.
   */
  get bpe_tokenizer() {
    return this.components.bpe_tokenizer;
  }
  /**
   * @returns {import('../bert/tokenization_bert.js').BertTokenizer} The WordPiece tokenizer.
   */
  get wp_tokenizer() {
    return this.components.wp_tokenizer;
  }
  /**
   * Helper function to decode the model prediction logits.
   * @param {import('../../utils/tensor.js').Tensor} pred_logits Model prediction logits.
   * @param {string} format Type of model prediction. Must be one of ['char', 'bpe', 'wp'].
   * @returns {[string[], number[]]} The decoded sentences and their confidence scores.
   */
  _decode_helper(e, t) {
    if (!Mp.hasOwnProperty(t))
      throw new Error(`Format ${t} is not supported.`);
    let [r, n] = Mp[t], s = this[r].bind(this), [a, o] = e.dims, i = [], l = [], c = e.tolist();
    for (let h = 0; h < a; ++h) {
      let _ = c[h], p = [], w = [];
      for (let y = 1; y < o; ++y) {
        let [b, k] = qe(at(_[y]));
        if (w.push(b), k == n)
          break;
        p.push(k);
      }
      let v = w.length > 0 ? w.reduce((y, b) => y * b, 1) : 0;
      l.push(p), i.push(v);
    }
    return [s(l), i];
  }
  /**
   * Convert a list of lists of char token ids into a list of strings by calling char tokenizer.
   * @param {number[][]} sequences List of tokenized input ids.
   * @returns {string[]} The list of char decoded sentences.
   */
  char_decode(e) {
    return this.char_tokenizer.batch_decode(e).map((t) => t.replaceAll(" ", ""));
  }
  /**
   * Convert a list of lists of BPE token ids into a list of strings by calling BPE tokenizer.
   * @param {number[][]} sequences List of tokenized input ids.
   * @returns {string[]} The list of BPE decoded sentences.
   */
  bpe_decode(e) {
    return this.bpe_tokenizer.batch_decode(e);
  }
  /**
   * Convert a list of lists of word piece token ids into a list of strings by calling word piece tokenizer.
   * @param {number[][]} sequences List of tokenized input ids.
   * @returns {string[]} The list of wp decoded sentences.
   */
  wp_decode(e) {
    return this.wp_tokenizer.batch_decode(e).map((t) => t.replaceAll(" ", ""));
  }
  /**
   * Convert a list of lists of token ids into a list of strings by calling decode.
   * @param {[import('../../utils/tensor.js').Tensor, import('../../utils/tensor.js').Tensor, import('../../utils/tensor.js').Tensor]} sequences List of tokenized input ids.
   * @returns {{generated_text: string[], scores: number[], char_preds: string[], bpe_preds: string[], wp_preds: string[]}}
   * Dictionary of all the outputs of the decoded results.
   * - generated_text: The final results after fusion of char, bpe, and wp.
   * - scores: The final scores after fusion of char, bpe, and wp.
   * - char_preds: The list of character decoded sentences.
   * - bpe_preds: The list of BPE decoded sentences.
   * - wp_preds: The list of wp decoded sentences.
   */
  // @ts-expect-error The type of this method is not compatible with the one in the base class.
  batch_decode([e, t, r]) {
    let [n, s] = this._decode_helper(e, "char"), [a, o] = this._decode_helper(t, "bpe"), [i, l] = this._decode_helper(r, "wp"), c = [], d = [];
    for (let h = 0; h < n.length; ++h) {
      let [_, p] = qe([s[h], o[h], l[h]]);
      c.push([n[h], a[h], i[h]][p]), d.push(_);
    }
    return {
      generated_text: c,
      scores: d,
      char_preds: n,
      bpe_preds: a,
      wp_preds: i
    };
  }
  /** @type {typeof Processor.from_pretrained} */
  static async from_pretrained(...e) {
    let t = await super.from_pretrained(...e), r = await Ee.from_pretrained("Xenova/gpt2"), n = await Ee.from_pretrained("Xenova/bert-base-uncased");
    return t.components = {
      image_processor: t.image_processor,
      char_tokenizer: t.tokenizer,
      bpe_tokenizer: r,
      wp_tokenizer: n
    }, t;
  }
  async _call(e, t = null) {
    let r = await this.image_processor(e);
    return t && (r.labels = this.tokenizer(t).input_ids), r;
  }
}, qA = class extends Ae {
  static tokenizer_class = Ee;
  static feature_extractor_class = Ft;
  /**
   * Calls the feature_extractor function with the given audio input.
   * @param {any} audio The audio input to extract features from.
   * @returns {Promise<any>} A Promise that resolves with the extracted features.
   */
  async _call(e) {
    return await this.feature_extractor(e);
  }
}, HA = class extends Ae {
  static tokenizer_class = Ee;
  static image_processor_class = ht;
}, wn = "<image>";
function QA(e, t, r, n, s) {
  return `${n.repeat(r * s)}${t}${e}
`;
}
var XA = class extends Ae {
  static tokenizer_class = Ee;
  static image_processor_class = ht;
  static uses_processor_config = !1;
  /**
   * @typedef {import('../../utils/image.js').RawImage} RawImage
   */
  // `images` is required, `text` is optional
  async _call(e, t = null, r = {}) {
    t || (le.warn(
      "You are using PaliGemma without a text prefix. It will perform as a picture-captioning model."
    ), t = ""), Array.isArray(e) || (e = [e]), Array.isArray(t) || (t = [t]);
    let n = this.tokenizer.bos_token, s = this.image_processor.config.image_seq_length, a;
    t.some((l) => l.includes(wn)) ? a = t.map((l) => {
      let c = l.replaceAll(wn, wn.repeat(s)), d = c.lastIndexOf(wn), h = d === -1 ? 0 : d + wn.length;
      return c.slice(0, h) + n + c.slice(h) + `
`;
    }) : (le.warn(
      "You are passing both `text` and `images` to `PaliGemmaProcessor`. The processor expects special image tokens in the text, as many tokens as there are images per each text. It is recommended to add `<image>` tokens in the very beginning of your text. For this call, we will infer how many images each text has and add special tokens."
    ), a = t.map(
      (l) => QA(l, n, s, wn, e.length)
    ));
    let o = this.tokenizer(a, r);
    return {
      ...await this.image_processor(e, r),
      ...o
    };
  }
}, xp = "<|image|>", YA = /<\|image_\d+\|>/g, KA = class extends Ae {
  static image_processor_class = ht;
  static tokenizer_class = Ee;
  /**
   *
   * @param {string|string[]} text
   * @param {RawImage|RawImage[]} images
   * @param  { { padding?: boolean, truncation?: boolean, num_crops?: number } | undefined } options
   * @returns {Promise<any>}
   */
  async _call(e, t = null, { padding: r = !0, truncation: n = !0, num_crops: s = null } = {}) {
    Array.isArray(e) || (e = [e]);
    let a, o;
    if (t) {
      o = await this.image_processor(t, { num_crops: s });
      let { num_img_tokens: i } = o, l = e.map(
        (d, h) => d.split(YA).join(xp.repeat(i[h]))
      );
      a = this.tokenizer(l, { padding: r, truncation: n });
      let c = this.tokenizer._tokenizer.token_to_id(xp);
      a.input_ids.map_((d) => d == c ? -d : d);
    } else
      a = this.tokenizer(e);
    return {
      ...a,
      ...o
    };
  }
}, JA = class extends Ae {
  static tokenizer_class = Ee;
  static image_processor_class = ht;
  static uses_processor_config = !0;
  /**
   * @typedef {import('../../utils/image.js').RawImage} RawImage
   */
  // `images` is required, `text` is optional
  async _call(e, t = null, r = {}) {
    let n = await this.image_processor(e, r);
    if (t) {
      let [a, o] = n.pixel_values.dims.slice(-2), { image_token: i, image_break_token: l, image_end_token: c, patch_size: d, spatial_merge_size: h } = this.config, _ = d * h, p = Math.floor(a / _), w = Math.floor(o / _);
      t = structuredClone(t), Array.isArray(t) || (t = [t]);
      for (let v = 0; v < t.length; ++v) {
        let y = i.repeat(w), b = y + l, k = y + c, A = b.repeat(p - 1) + k;
        t[v] = t[v].replace(i, A);
      }
    }
    let s = t ? this.tokenizer(t, r) : {};
    return {
      ...n,
      ...s
    };
  }
}, ZA = class extends Ae {
  static feature_extractor_class = jm;
  /**
   * Calls the feature_extractor function with the given audio input.
   * @param {any} audio The audio input to extract features from.
   * @returns {Promise<any>} A Promise that resolves with the extracted features.
   */
  async _call(e) {
    return await this.feature_extractor(e);
  }
  /** @type {PyAnnoteFeatureExtractor['post_process_speaker_diarization']} */
  post_process_speaker_diarization(...e) {
    return (
      /** @type {PyAnnoteFeatureExtractor} */
      this.feature_extractor.post_process_speaker_diarization(
        ...e
      )
    );
  }
  get sampling_rate() {
    return this.feature_extractor.config.sampling_rate;
  }
}, fg = class extends vl {
}, eC = class extends fg {
}, _g = class extends Ae {
  static image_processor_class = ht;
  async _call(...e) {
    return await this.image_processor(...e);
  }
  post_process_masks(...e) {
    return this.image_processor.post_process_masks(...e);
  }
  reshape_input_points(...e) {
    return this.image_processor.reshape_input_points(...e);
  }
}, pg = class extends _g {
}, tC = class extends pg {
}, rC = class extends Ae {
  static tokenizer_class = Ee;
  static feature_extractor_class = Ft;
  /**
   * Calls the feature_extractor function with the given input.
   * @param {any} input The input to extract features from.
   * @returns {Promise<any>} A Promise that resolves with the extracted features.
   */
  async _call(e) {
    return await this.feature_extractor(e);
  }
}, nC = class extends Ae {
  static tokenizer_class = Ee;
  static feature_extractor_class = Ft;
  static uses_processor_config = !0;
  /**
   * @param {string} text The text input to process.
   * @param {Float32Array} audio The audio input to process.
   */
  async _call(e, t = null, r = {}) {
    if (Array.isArray(e))
      throw new Error("Batched inputs are not supported yet.");
    let n = {};
    if (t) {
      let a = t.length, { input_features: o } = await this.feature_extractor(t, {
        ...r,
        max_length: a
      }), i = Math.round(a / this.config.encoder_ds_factor + 1e-4), l = 1 + Math.ceil(i / this.config.stack_factor);
      n.audio_token_len = [l], n.audio_values = o;
      let c = this.config.audio_placeholder;
      if (!e.includes(c))
        throw new Error(`The input text does not contain the image token ${c}.`);
      e = e.replaceAll(c, c.repeat(l));
    }
    return {
      ...this.tokenizer(e, {
        add_special_tokens: !1,
        ...r
      }),
      ...n
    };
  }
}, ea = "[AUDIO]", sC = "[BEGIN_AUDIO]", aC = 375;
function oC(e, t) {
  let r = [];
  for (let n = 0; n < e.length; n += t)
    r.push(e.subarray(n, Math.min(n + t, e.length)));
  return r;
}
var iC = class extends Ae {
  static tokenizer_class = Ee;
  static feature_extractor_class = Ft;
  static uses_processor_config = !1;
  /**
   * @param {string} text The text input to process.
   * @param {Float32Array|Float32Array[]} audio The audio input(s) to process.
   */
  async _call(e, t = null, r = {}) {
    if (Array.isArray(e))
      throw new Error("Batched inputs are not supported yet.");
    let n = {};
    if (t) {
      if (!e.includes(ea))
        throw new Error(`The input text does not contain the audio token ${ea}.`);
      Array.isArray(t) || (t = [t]);
      let a = e.split(ea), o = a.length - 1;
      if (o !== t.length)
        throw new Error(
          `The number of audio inputs (${t.length}) does not match the number of audio tokens in the text (${o}).`
        );
      let i = this.feature_extractor.config.n_samples, l = t.map((p) => oC(p, i)), c = l.map((p) => p.length), d = l.flat(), h = (await Promise.all(d.map((p) => this.feature_extractor(p, r)))).map((p) => p.input_features);
      n.audio_values = h.length > 1 ? De(h, 0) : h[0];
      let _ = a[0];
      for (let p = 0; p < c.length; ++p) {
        _ += sC;
        for (let w = 0; w < c[p]; ++w)
          _ += ea.repeat(aC);
        _ += a[p + 1];
      }
      e = _;
    }
    return {
      ...this.tokenizer(e, {
        add_special_tokens: !1,
        ...r
      }),
      ...n
    };
  }
}, kp = 32, Pi = 6, ta = 8, lC = 10, cC = 32, uC = class extends Ae {
  static tokenizer_class = Ee;
  static feature_extractor_class = Ft;
  static uses_processor_config = !1;
  /** Number of mel frames in the first audio chunk. */
  get num_mel_frames_first_audio_chunk() {
    return (Pi + 1) * ta;
  }
  /** Number of raw audio samples in the first audio chunk. */
  get num_samples_first_audio_chunk() {
    let { hop_length: e, n_fft: t } = this.feature_extractor.config;
    return (this.num_mel_frames_first_audio_chunk - 1) * e + Math.floor(t / 2);
  }
  /** Number of raw audio samples per subsequent audio chunk. */
  get num_samples_per_audio_chunk() {
    let { hop_length: e, n_fft: t } = this.feature_extractor.config;
    return ta * e + t;
  }
  /** Number of right-pad tokens for non-streaming mode. */
  get num_right_pad_tokens() {
    return Pi + 1 + lC;
  }
  /** Number of mel frames per text token. */
  get audio_length_per_tok() {
    return ta;
  }
  /** Number of raw audio samples per token. */
  get raw_audio_length_per_tok() {
    return ta * this.feature_extractor.config.hop_length;
  }
  /**
   * Process audio input for VoxtralRealtime.
   *
   * In streaming mode with `is_first_audio_chunk=true`, the audio is left-padded
   * with silence and mel features are extracted with `center=true`.
   * Returns `{ input_ids, input_features }`.
   *
   * In streaming mode with `is_first_audio_chunk=false`, the audio chunk is
   * processed with `center=false` and only `{ input_features }` is returned.
   *
   * In non-streaming mode, the audio is right-padded to ensure the model
   * transcribes the full audio, then processed with `center=true`.
   * Returns `{ input_features }`.
   *
   * @param {Float32Array|Float64Array} audio The audio waveform.
   * @param {Object} [options]
   * @param {boolean} [options.is_streaming=false] Whether processing in streaming mode.
   * @param {boolean} [options.is_first_audio_chunk=true] Whether this is the first audio chunk.
   * @returns {Promise<Object>}
   */
  async _call(e, { is_streaming: t = !1, is_first_audio_chunk: r = !0 } = {}) {
    if (ot(e, "VoxtralRealtimeProcessor"), !t && !r)
      throw new Error("In non-streaming mode (`is_streaming=false`), `is_first_audio_chunk` must be `true`.");
    if (r)
      if (t) {
        let n = kp * this.raw_audio_length_per_tok, s = new Float32Array(n + e.length);
        s.set(e, n);
        let a = await this.feature_extractor(s, { center: !0 }), i = 1 + (kp + Pi), l = new BigInt64Array(i).fill(BigInt(cC));
        return l[0] = 1n, {
          input_ids: new V("int64", l, [1, i]),
          ...a
        };
      } else {
        let n = this.num_right_pad_tokens * this.raw_audio_length_per_tok, s = new Float32Array(e.length + n);
        return s.set(e), await this.feature_extractor(s, { center: !0 });
      }
    else
      return await this.feature_extractor(e, { center: !1 });
  }
}, dC = class extends Ae {
  static tokenizer_class = Ee;
  static feature_extractor_class = Ft;
  /**
   * Calls the feature_extractor function with the given audio input.
   * @param {any} audio The audio input to extract features from.
   * @returns {Promise<any>} A Promise that resolves with the extracted features.
   */
  async _call(e) {
    return await this.feature_extractor(e);
  }
}, hC = class extends Ae {
  static tokenizer_class = Ee;
  static feature_extractor_class = Ft;
  /**
   * Calls the feature_extractor function with the given audio input.
   * @param {any} audio The audio input to extract features from.
   * @returns {Promise<any>} A Promise that resolves with the extracted features.
   */
  async _call(e) {
    return await this.feature_extractor(e);
  }
}, fC = class extends Ae {
  static tokenizer_class = Ee;
  static feature_extractor_class = Ft;
  /**
   * Calls the feature_extractor function with the given audio input.
   * @param {any} audio The audio input to extract features from.
   * @returns {Promise<any>} A Promise that resolves with the extracted features.
   */
  async _call(e) {
    return await this.feature_extractor(e);
  }
}, _C = class {
  /** @type {typeof Processor.from_pretrained} */
  static async from_pretrained(e, t = {}) {
    let r = await sr(
      e,
      ds,
      !0,
      t
    ), { image_processor_type: n, feature_extractor_type: s, processor_class: a } = r;
    if (a && $i[a])
      return $i[a].from_pretrained(e, t);
    if (!n && !s)
      throw new Error("No `image_processor_type` or `feature_extractor_type` found in the config.");
    let o = {};
    if (n) {
      let l = ya[n.replace(/Fast$/, "")];
      if (!l)
        throw new Error(`Unknown image_processor_type: '${n}'.`);
      o.image_processor = new l(r);
    }
    if (s) {
      let l = ya[s];
      if (l)
        o.image_processor = new l(r);
      else {
        let c = fl[s];
        if (!c)
          throw new Error(`Unknown feature_extractor_type: '${s}'.`);
        o.feature_extractor = new c(r);
      }
    }
    let i = {};
    return new Ae(i, o, null);
  }
};
async function pC(e, t) {
  return await sr(e, "config.json", !0, t);
}
function vn(e) {
  let t = {}, r = {};
  switch (e.model_type) {
    // Sub-configs
    case "llava":
    case "paligemma":
    case "gemma3":
    case "florence2":
    case "llava_onevision":
    case "idefics3":
    case "granite_speech":
    case "ultravox":
    case "voxtral":
    case "voxtral_realtime":
    case "smolvlm":
    case "gemma3n":
    case "gemma4":
    case "lfm2_vl":
    case "chatterbox":
    case "lighton_ocr":
    case "glm_ocr":
    case "mistral3":
    case "qwen2_5_vl":
    case "qwen3_vl":
    case "qwen3_vl_moe":
      r = vn(e.text_config);
      break;
    case "moondream1":
      r = vn(e.phi_config);
      break;
    case "musicgen":
      r = vn(e.decoder);
      break;
    case "multi_modality":
      r = vn(e.language_config);
      break;
    // Decoder-only models
    case "gpt2":
    case "gptj":
    case "jais":
    case "codegen":
    case "gpt_bigcode":
      t.num_heads = "n_head", t.num_layers = "n_layer", t.hidden_size = "n_embd";
      break;
    case "gpt_neox":
    case "stablelm":
    case "opt":
    case "falcon":
    case "modernbert-decoder":
      t.num_heads = "num_attention_heads", t.num_layers = "num_hidden_layers", t.hidden_size = "hidden_size";
      break;
    case "gpt_oss":
    case "llama":
    case "llama4_text":
    case "nanochat":
    case "apertus":
    case "arcee":
    case "afmoe":
    case "lfm2":
    case "lfm2_moe":
    case "smollm3":
    case "olmo":
    case "olmo2":
    case "olmo3":
    case "mobilellm":
    case "granite":
    case "granitemoehybrid":
    case "cohere":
    case "cohere2":
    case "mistral":
    case "voxtral_realtime_text":
    case "voxtral_realtime_encoder":
    case "starcoder2":
    case "qwen2":
    case "qwen2_moe":
    case "qwen2_vl":
    case "qwen2_vl_text":
    case "qwen2_5_vl_text":
    case "qwen3_moe":
    case "qwen3_vl_text":
    case "qwen3_vl_moe_text":
    case "phi":
    case "phi3":
    case "phi3_v":
    case "llava_qwen2":
      t.num_heads = "num_key_value_heads", t.num_layers = "num_hidden_layers", t.hidden_size = "hidden_size", t.num_attention_heads = "num_attention_heads", t.dim_kv = "head_dim";
      break;
    case "qwen3":
    case "solar_open":
    case "glm_ocr_text":
    case "gemma":
    case "gemma2":
    case "vaultgemma":
    case "gemma3_text":
    case "gemma3n_text":
    case "gemma4_text":
    case "glm":
    case "helium":
    case "ernie4_5":
    case "hunyuan_v1_dense":
    case "falcon_h1":
    case "nemotron_h":
    case "ministral":
    case "ministral3":
      t.num_heads = "num_key_value_heads", t.num_layers = "num_hidden_layers", t.dim_kv = "head_dim";
      break;
    case "openelm":
      t.num_heads = "num_kv_heads", t.num_layers = "num_transformer_layers", t.dim_kv = "head_dim";
      break;
    case "gpt_neo":
    case "donut-swin":
      t.num_heads = "num_heads", t.num_layers = "num_layers", t.hidden_size = "hidden_size";
      break;
    case "bloom":
      t.num_heads = "n_head", t.num_layers = "n_layer", t.hidden_size = "hidden_size";
      break;
    case "mpt":
      t.num_heads = "n_heads", t.num_layers = "n_layers", t.hidden_size = "d_model";
      break;
    case "exaone":
      t.num_heads = "num_key_value_heads", t.num_layers = "num_layers", t.dim_kv = "head_dim", t.num_attention_heads = "num_attention_heads";
      break;
    case "youtu":
    case "deepseek_v3":
    case "deepseek_v4":
    case "glm_moe_dsa":
    case "mistral4":
      t.num_heads = "num_key_value_heads", t.num_layers = "num_hidden_layers", t.dim_kv = e.model_type === "deepseek_v4" ? "head_dim" : "qk_head_dim", t.num_attention_heads = "num_attention_heads";
      break;
    case "zaya":
      t.num_heads = "num_key_value_heads", t.num_layers = "num_hidden_layers", t.hidden_size = "hidden_size", t.dim_kv = "head_dim", t.num_attention_heads = "num_attention_heads";
      break;
    case "hrm_text":
      t.num_heads = "num_key_value_heads", t.num_layers = "num_hidden_layers", t.hidden_size = "hidden_size", t.dim_kv = "head_dim", t.num_attention_heads = "num_attention_heads";
      break;
    // Encoder-decoder models
    case "t5":
    case "mt5":
    case "longt5":
      t.num_decoder_layers = "num_decoder_layers", t.num_decoder_heads = "num_heads", t.decoder_dim_kv = "d_kv", t.num_encoder_layers = "num_layers", t.num_encoder_heads = "num_heads", t.encoder_dim_kv = "d_kv";
      break;
    case "bart":
    case "mbart":
    case "marian":
    case "whisper":
    case "lite-whisper":
    case "m2m_100":
    case "blenderbot":
    case "blenderbot-small":
    case "florence2_language":
      t.num_decoder_layers = "decoder_layers", t.num_decoder_heads = "decoder_attention_heads", t.decoder_hidden_size = "d_model", t.num_encoder_layers = "encoder_layers", t.num_encoder_heads = "encoder_attention_heads", t.encoder_hidden_size = "d_model";
      break;
    case "speecht5":
      t.num_decoder_layers = "decoder_layers", t.num_decoder_heads = "decoder_attention_heads", t.decoder_hidden_size = "hidden_size", t.num_encoder_layers = "encoder_layers", t.num_encoder_heads = "encoder_attention_heads", t.encoder_hidden_size = "hidden_size";
      break;
    case "trocr":
      t.num_encoder_layers = t.num_decoder_layers = "decoder_layers", t.num_encoder_heads = t.num_decoder_heads = "decoder_attention_heads", t.encoder_hidden_size = t.decoder_hidden_size = "d_model";
      break;
    case "musicgen_decoder":
      t.num_encoder_layers = t.num_decoder_layers = "num_hidden_layers", t.num_encoder_heads = t.num_decoder_heads = "num_attention_heads", t.encoder_hidden_size = t.decoder_hidden_size = "hidden_size";
      break;
    case "moonshine":
      t.num_decoder_layers = "decoder_num_hidden_layers", t.num_decoder_heads = "decoder_num_key_value_heads", t.num_encoder_layers = "encoder_num_hidden_layers", t.num_encoder_heads = "encoder_num_key_value_heads", t.encoder_hidden_size = t.decoder_hidden_size = "hidden_size";
      break;
    case "cohere_asr":
      t.num_decoder_layers = "num_hidden_layers", t.num_decoder_heads = "num_key_value_heads", t.decoder_hidden_size = "hidden_size", t.decoder_dim_kv = "head_dim";
      let {
        num_hidden_layers: s,
        num_attention_heads: a,
        hidden_size: o
      } = (
        /** @type {any} */
        e.encoder_config
      );
      r = {
        num_encoder_layers: s,
        num_encoder_heads: a,
        encoder_hidden_size: o,
        // @ts-expect-error TS2339
        encoder_dim_kv: e.head_dim
      };
      break;
    case "vision-encoder-decoder":
      let i = vn(e.decoder), l = "num_decoder_layers" in i, c = et(e, ["model_type", "is_encoder_decoder"]);
      return l ? (c.num_decoder_layers = i.num_decoder_layers, c.num_decoder_heads = i.num_decoder_heads, c.decoder_hidden_size = i.decoder_hidden_size, c.num_encoder_layers = i.num_encoder_layers, c.num_encoder_heads = i.num_encoder_heads, c.encoder_hidden_size = i.encoder_hidden_size) : (c.num_layers = i.num_layers, c.num_heads = i.num_heads, c.hidden_size = i.hidden_size), c;
  }
  let n = {
    ...r,
    ...et(e, ["model_type", "multi_query", "is_encoder_decoder"])
  };
  for (let s in t)
    n[s] = e[t[s]];
  return n;
}
function Pa(e, t) {
  e instanceof Vi || (e = new Vi(e));
  let r = t?.prefix ?? "past_key_values", n = r === "present" ? "present" : "past", s = /* @__PURE__ */ new Set();
  if (["lfm2", "lfm2_moe"].includes(e.model_type)) {
    let { layer_types: a } = (
      /** @type {any} */
      e
    );
    for (let o = 0; o < a.length; ++o)
      if (a[o] === "full_attention")
        s.add(`${r}.${o}.key`), s.add(`${r}.${o}.value`);
      else if (a[o] === "conv")
        s.add(`${n}_conv.${o}`);
      else
        throw new Error(`Unsupported layer type: ${a[o]}`);
    return s;
  } else if (["granitemoehybrid", "falcon_h1", "nemotron_h"].includes(e.model_type)) {
    let a = (
      /** @type {any} */
      e
    ), o = a.layer_types ?? a.layers_block_type, i = a.num_hidden_layers ?? o?.length;
    for (let l = 0; l < i; ++l)
      (!o || o[l] === "mamba") && (s.add(`${n}_conv.${l}`), s.add(`${n}_ssm.${l}`)), (!o || o[l] === "attention") && (s.add(`${r}.${l}.key`), s.add(`${r}.${l}.value`));
    return s;
  } else if (["qwen3_next", "qwen3_5_text", "qwen3_5_moe_text", "olmo_hybrid"].includes(e.model_type)) {
    let { layer_types: a } = (
      /** @type {any} */
      e
    );
    for (let o = 0; o < a.length; ++o)
      if (a[o] === "full_attention")
        s.add(`${r}.${o}.key`), s.add(`${r}.${o}.value`);
      else if (a[o] === "linear_attention")
        e.model_type === "olmo_hybrid" ? (s.add(`${n}_conv.${o}.key`), s.add(`${n}_conv.${o}.value`), s.add(`${n}_conv.${o}.query`)) : s.add(`${n}_conv.${o}`), s.add(`${n}_recurrent.${o}`);
      else
        throw new Error(`Unsupported layer type: ${a[o]}`);
    return s;
  } else if (["gemma4", "gemma4_text"].includes(e.model_type)) {
    let a = (
      /** @type {any} */
      e.model_type === "gemma4" ? (
        /** @type {any} */
        e.text_config
      ) : e
    ), o = a.num_hidden_layers, i = a.num_kv_shared_layers ?? 0, l = o - i;
    for (let c = 0; c < l; ++c)
      s.add(`${r}.${c}.key`), s.add(`${r}.${c}.value`);
    return s;
  } else if (e.model_type === "deepseek_v4") {
    let { layer_types: a, num_hidden_layers: o } = (
      /** @type {any} */
      e
    );
    for (let i = 0; i < o; ++i) {
      s.add(`${r}.${i}.key`), s.add(`${r}.${i}.value`);
      let l = a[i];
      if (l === "compressed_sparse_attention")
        s.add(`${n}_compressor.${i}.kv`), s.add(`${n}_compressor.${i}.gate`), s.add(`${n}_indexer.${i}.kv`), s.add(`${n}_indexer.${i}.gate`);
      else if (l === "heavily_compressed_attention")
        s.add(`${n}_compressor.${i}.kv`), s.add(`${n}_compressor.${i}.gate`);
      else if (l && l !== "sliding_attention")
        throw new Error(`Unsupported layer type: ${l}`);
    }
    return s;
  } else if (e.model_type === "zaya") {
    let { num_hidden_layers: a, cca_time1: o } = (
      /** @type {any} */
      e
    ), i = o ?? 1;
    for (let l = 0; l < a; l += i)
      s.add(`${r}.${l}.key`), s.add(`${r}.${l}.value`), s.add(`${r}.${l}.conv_state`), s.add(`${r}.${l}.shift_state`);
    return s;
  } else if (["lfm2_vl", "qwen3_5", "qwen3_5_moe", "voxtral_realtime"].includes(e.model_type)) {
    let a;
    return e.model_type === "voxtral_realtime" && t?.session_name === "audio_encoder" ? a = /** @type {any} */
    e.audio_config : a = /** @type {any} */
    e.text_config, Pa(a, t);
  }
  return mC(e, { prefix: r });
}
function mC(e, { prefix: t = "past_key_values" } = {}) {
  let r = /* @__PURE__ */ new Set(), n = e.normalized_config;
  if (n.is_encoder_decoder && "num_encoder_heads" in n && "num_decoder_heads" in n)
    for (let s = 0; s < n.num_decoder_layers; ++s)
      r.add(`${t}.${s}.encoder.key`), r.add(`${t}.${s}.encoder.value`), r.add(`${t}.${s}.decoder.key`), r.add(`${t}.${s}.decoder.value`);
  else if (n.multi_query)
    for (let s = 0; s < n.num_layers; ++s)
      r.add(`${t}.${s}.key_value`);
  else
    for (let s = 0; s < n.num_layers; ++s)
      r.add(`${t}.${s}.key`), r.add(`${t}.${s}.value`);
  return r;
}
var Vi = class Ui {
  // NOTE: Typo in original
  /** @type {string|null} */
  model_type = null;
  /** @type {boolean} */
  is_encoder_decoder = !1;
  /** @type {number} */
  max_position_embeddings;
  /** @type {TransformersJSConfig} */
  "transformers.js_config";
  /**
   * Create a new `PretrainedConfig` from a parsed `config.json` object.
   * @param {Object} configJSON The JSON of the config.
   */
  constructor(t) {
    Object.assign(this, t), this.normalized_config = vn(this);
  }
  /**
   * Loads a pretrained config from the given `pretrained_model_name_or_path`.
   *
   * @param {string} pretrained_model_name_or_path The path to the pretrained config.
   * @param {PretrainedOptions} options Additional options for loading the config.
   * @throws {Error} Throws an error if the config.json is not found in the `pretrained_model_name_or_path`.
   *
   * @returns {Promise<PretrainedConfig>} A new instance of the `PretrainedConfig` class.
   */
  static async from_pretrained(t, { progress_callback: r = null, config: n = null, cache_dir: s = null, local_files_only: a = !1, revision: o = "main" } = {}) {
    n && !(n instanceof Ui) && (n = new Ui(n));
    let i = n ?? await pC(t, {
      progress_callback: r,
      config: n,
      cache_dir: s,
      local_files_only: a,
      revision: o
    });
    return new this(i);
  }
}, hs = class {
  /** @type {typeof PretrainedConfig.from_pretrained} */
  static async from_pretrained(...e) {
    return Vi.from_pretrained(...e);
  }
};
function mg(e, t, r) {
  return e ? typeof e == "object" && e !== null ? e.hasOwnProperty(t) ? +e[t] : e.hasOwnProperty(r) ? +e[r] : 0 : +e : 0;
}
function gg(e, t) {
  let r = [];
  for (let n = 0; n < t; ++n)
    r.push(`${e}_data${n === 0 ? "" : "_" + n}`);
  return r;
}
async function gC(e, t, r, n) {
  let s = `${t}${n}.onnx`, a = `${r.subfolder ?? ""}/${s}`;
  return await wa(e, a, !0, r, me.IS_NODE_ENV);
}
async function wC(e, t, r, n, s, a = {}) {
  let o = `${t}${r}.onnx`, i = me.IS_NODE_ENV, l = [], c = mg(s, o, t);
  if (c > 0) {
    if (c > np)
      throw new Error(
        `The number of external data chunks (${c}) exceeds the maximum allowed value (${np}).`
      );
    let d = gg(o, c);
    for (let h of d) {
      let _ = `${n.subfolder ?? ""}/${h}`;
      l.push(
        new Promise(async (p, w) => {
          let v = await wa(
            e,
            _,
            !0,
            n,
            i
          );
          p(v instanceof Uint8Array ? { path: h, data: v } : h);
        })
      );
    }
  } else a.externalData !== void 0 && (l = a.externalData.map(async (d) => {
    if (typeof d.data == "string") {
      let h = await wa(e, d.data, !0, n);
      return { ...d, data: h };
    }
    return d;
  }));
  return Promise.all(l);
}
async function vC(e, t, r, n = !1, s = void 0) {
  let a = r.config?.["transformers.js_config"] ?? {}, o = (
    /** @type {import("../utils/devices.js").DeviceType} */
    xm(r.device ?? a.device, t, {
      warn: (k) => le.info(k)
    })
  ), i = $T(o), l = a.device_config ?? {};
  l.hasOwnProperty(o) && (a = {
    ...a,
    ...l[o]
  });
  let c = (
    /** @type {import("../utils/dtypes.js").DataType} */
    km(r.dtype ?? a.dtype, t, o, {
      configDtype: a.dtype,
      warn: (k) => le.info(k)
    })
  );
  if (va.hasOwnProperty(c)) {
    if (o === "webgpu" && // NOTE: Currently, we assume that the Native WebGPU EP always supports fp16. In future, we will add a check for this.
    !me.IS_NODE_ENV && c === Qe.fp16 && !await UT())
      throw new Error(`The device (${o}) does not support fp16.`);
  } else throw new Error(`Invalid dtype: ${c}. Should be one of: ${Object.keys(Qe).join(", ")}`);
  let d = va[c], h = { ...r.session_options };
  h.executionProviders ??= i;
  let _ = a.free_dimension_overrides;
  _ ? h.freeDimensionOverrides ??= _ : o.startsWith("webnn") && !h.freeDimensionOverrides && le.warn(
    `WebNN does not currently support dynamic shapes and requires 'free_dimension_overrides' to be set in config.json, preferably as a field within config["transformers.js_config"]["device_config"]["${o}"]. When 'free_dimension_overrides' is not set, you may experience significant performance degradation.`
  );
  let p = gC(e, t, r, d), w = r.use_external_data_format ?? a.use_external_data_format, v = await wC(
    e,
    t,
    d,
    r,
    w,
    h
  );
  if (v.length > 0 && (!me.IS_NODE_ENV || v.some((k) => typeof k != "string")) && (h.externalData = v), n && o === "webgpu") {
    let k = Pa(r.config, {
      prefix: "present",
      session_name: s
    });
    if (k.size > 0 && !ol()) {
      let A = {};
      for (let E of k)
        A[E] = "gpu-buffer";
      h.preferredOutputLocation = A;
    }
  }
  return { buffer_or_path: await p, session_options: h, session_config: {
    dtype: c,
    device: o
  } };
}
async function yC(e, t, r, n = void 0) {
  return Object.fromEntries(
    await Promise.all(
      Object.keys(t).map(async (s) => {
        let a = n?.[s] ?? !1, { buffer_or_path: o, session_options: i, session_config: l } = await vC(
          e,
          t[s],
          r,
          a,
          s
        ), c = await ym(o, i, l);
        return [s, c];
      })
    )
  );
}
function wg(e) {
  for (let t in e)
    Mm(e[t]) ? e[t] = new V(e[t]) : typeof e[t] == "object" && wg(e[t]);
  return e;
}
async function ve(e, t) {
  let r = bC(e, t);
  try {
    let n = Object.fromEntries(
      Object.entries(r).map(([a, o]) => {
        let i = (
          /** @type {any} */
          o.ort_tensor
        );
        return me.IS_NODE_ENV && typeof Float16Array < "u" && i.cpuData instanceof Float16Array && (i.cpuData = new Uint16Array(i.cpuData.buffer)), [a, i];
      })
    ), s = await bm(e, n);
    return wg(s);
  } catch (n) {
    let s = Object.fromEntries(
      Object.entries(r).map(([a, o]) => {
        let i = {
          type: o.type,
          dims: o.dims,
          location: o.location
        };
        return i.location !== "gpu-buffer" && (i.data = o.data), [a, i];
      })
    );
    throw le.error(`An error occurred during model execution: "${n}".`), le.error("Inputs given to model:", s), n;
  }
}
function bC(e, t) {
  let r = /* @__PURE__ */ Object.create(null), n = [];
  for (let o of e.inputNames) {
    let i = t[o];
    if (!(i instanceof V)) {
      n.push(o);
      continue;
    }
    r[o] = ol() ? i.clone() : i;
  }
  if (n.length > 0)
    throw new Error(
      `An error occurred during model execution: "Missing the following inputs: ${n.join(", ")}.`
    );
  let s = Object.keys(t).length, a = e.inputNames.length;
  if (s > a) {
    let o = Object.keys(t).filter((i) => !e.inputNames.includes(i));
    le.warn(
      `WARNING: Too many inputs were provided (${s} > ${a}). The following inputs will be ignored: "${o.join(", ")}".`
    );
  }
  return r;
}
var Ve = class {
}, MC = class extends Ve {
  /**
   * @param {Object} output The output of the model.
   * @param {Tensor} output.last_hidden_state Sequence of hidden-states at the output of the last layer of the model.
   * @param {Tensor} [output.hidden_states] Hidden-states of the model at the output of each layer plus the optional initial embedding outputs.
   * @param {Tensor} [output.attentions] Attentions weights after the attention softmax, used to compute the weighted average in the self-attention heads.
   */
  constructor({ last_hidden_state: e, hidden_states: t = null, attentions: r = null }) {
    super(), this.last_hidden_state = e, this.hidden_states = t, this.attentions = r;
  }
}, ae = class extends Ve {
  /**
   * @param {Object} output The output of the model.
   * @param {Tensor} output.logits classification (or regression if config.num_labels==1) scores (before SoftMax).
   * @param {Record<string, Tensor>} [output.attentions] Object of `torch.FloatTensor` (one for each layer) of shape `(batch_size, num_heads, sequence_length, sequence_length)`.
   * Attentions weights after the attention softmax, used to compute the weighted average in the self-attention heads.
   */
  constructor({ logits: e, ...t }) {
    super(), this.logits = e;
    let r = Object.values(t);
    r.length > 0 && (this.attentions = r);
  }
}, He = class extends Ve {
  /**
   * @param {Object} output The output of the model.
   * @param {Tensor} output.logits Classification scores (before SoftMax).
   */
  constructor({ logits: e }) {
    super(), this.logits = e;
  }
}, Xe = class extends Ve {
  /**
   * @param {Object} output The output of the model.
   * @param {Tensor} output.logits Prediction scores of the language modeling head (scores for each vocabulary token before SoftMax).
   */
  constructor({ logits: e }) {
    super(), this.logits = e;
  }
}, it = class extends Ve {
  /**
   * @param {Object} output The output of the model.
   * @param {Tensor} output.start_logits Span-start scores (before SoftMax).
   * @param {Tensor} output.end_logits Span-end scores (before SoftMax).
   */
  constructor({ start_logits: e, end_logits: t }) {
    super(), this.start_logits = e, this.end_logits = t;
  }
}, Lr = class extends Ve {
  /**
   * @param {Object} output The output of the model.
   * @param {Tensor} output.logits Prediction scores of the language modeling head (scores for each vocabulary token before softmax).
   */
  constructor({ logits: e }) {
    super(), this.logits = e;
  }
}, xC = class extends Ve {
  /**
   * @param {Object} output The output of the model.
   * @param {Tensor} output.logits Prediction scores of the language modeling head (scores for each vocabulary token before softmax).
   * @param {Tensor} output.past_key_values Contains pre-computed hidden-states (key and values in the self-attention blocks)
   * that can be used (see `past_key_values` input) to speed up sequential decoding.
   */
  constructor({ logits: e, past_key_values: t }) {
    super(), this.logits = e, this.past_key_values = t;
  }
}, kC = class extends Ve {
  /**
   * @param {Object} output The output of the model.
   * @param {Tensor} output.logits The output logits of the model.
   * @param {Tensor} output.past_key_values An tensor of key/value pairs that represent the previous state of the model.
   * @param {Tensor} output.encoder_outputs The output of the encoder in a sequence-to-sequence model.
   * @param {Tensor} [output.decoder_attentions] Attentions weights of the decoder, after the attention softmax, used to compute the weighted average in the self-attention heads.
   * @param {Tensor} [output.cross_attentions] Attentions weights of the decoder's cross-attention layer, after the attention softmax, used to compute the weighted average in the cross-attention heads.
   */
  constructor({ logits: e, past_key_values: t, encoder_outputs: r, decoder_attentions: n = null, cross_attentions: s = null }) {
    super(), this.logits = e, this.past_key_values = t, this.encoder_outputs = r, this.decoder_attentions = n, this.cross_attentions = s;
  }
}, vg = class extends Ve {
  /**
   * @param {Object} output The output of the model.
   * @param {Tensor} output.alphas Estimated alpha values, of shape `(batch_size, num_channels, height, width)`.
   */
  constructor({ alphas: e }) {
    super(), this.alphas = e;
  }
}, Ut = class extends mt {
  /**
   * Apply the processor to the input logits.
   *
   * @abstract
   * @param {bigint[][]} input_ids The input IDs.
   * @param {Tensor} logits The logits to process.
   * @throws {Error} Throws an error if `_call` is not implemented in the subclass.
   */
  _call(e, t) {
    throw Error("`_call` should be implemented in a subclass");
  }
}, TC = class extends mt {
  /**
   * Apply the processor to the input logits.
   *
   * @abstract
   * @param {bigint[][]} input_ids The input IDs.
   * @param {Tensor} logits The logits to process.
   * @throws {Error} Throws an error if `_call` is not implemented in the subclass.
   */
  _call(e, t) {
    throw Error("`_call` should be implemented in a subclass");
  }
}, ji = class extends mt {
  /**
   * Constructs a new instance of `LogitsProcessorList`.
   */
  constructor() {
    super(), this.processors = [];
  }
  /**
   * Adds a new logits processor to the list.
   *
   * @param {LogitsProcessor} item The logits processor function to add.
   */
  push(e) {
    this.processors.push(e);
  }
  /**
   * Adds multiple logits processors to the list.
   *
   * @param {LogitsProcessor[]} items The logits processor functions to add.
   */
  extend(e) {
    this.processors.push(...e);
  }
  /**
   * Applies all logits processors in the list to a batch of logits, modifying them in-place.
   *
   * @param {bigint[][]} input_ids The input IDs for the language model.
   * @param {Tensor} logits
   */
  _call(e, t) {
    let r = t;
    for (let n of this.processors)
      r = n(e, r);
    return r;
  }
  [Symbol.iterator]() {
    return this.processors.values();
  }
}, EC = class extends Ut {
  /**
   * Create a ForcedBOSTokenLogitsProcessor.
   * @param {number} bos_token_id The ID of the beginning-of-sequence token to be forced.
   */
  constructor(e) {
    super(), this.bos_token_id = e;
  }
  /**
   * Apply the BOS token forcing to the logits.
   * @param {bigint[][]} input_ids The input IDs.
   * @param {Tensor} logits The logits.
   * @returns {Tensor} The logits with BOS token forcing.
   */
  _call(e, t) {
    for (let r = 0; r < e.length; ++r)
      if (e[r].length === 1) {
        let n = (
          /** @type {Float32Array} */
          t[r].data
        );
        n.fill(-1 / 0), n[this.bos_token_id] = 0;
      }
    return t;
  }
}, AC = class extends Ut {
  /**
   * Create a ForcedEOSTokenLogitsProcessor.
   * @param {number} max_length The maximum length of the sequence to be generated.
   * @param {number|number[]} eos_token_id The ID or IDs of the *end-of-sequence* token.
   */
  constructor(e, t) {
    super(), this.max_length = e, this.eos_token_id = Array.isArray(t) ? t : [t];
  }
  /**
   * Apply the processor to input_ids and logits.
   *
   * @param {bigint[][]} input_ids The input IDs.
   * @param {Tensor} logits The logits tensor.
   */
  _call(e, t) {
    for (let r = 0; r < e.length; ++r)
      if (e[r].length === this.max_length - 1) {
        let n = (
          /** @type {Float32Array} */
          t[r].data
        );
        n.fill(-1 / 0);
        for (let s of this.eos_token_id)
          n[s] = 0;
      }
    return t;
  }
}, CC = class extends Ut {
  /**
   * Create a SuppressTokensLogitsProcessor.
   * @param {number[]} suppress_tokens The IDs of the tokens to suppress.
   */
  constructor(e) {
    super(), this.suppress_tokens = e;
  }
  /**
   * Suppress the specified tokens by setting their logits to -Infinity.
   * @param {bigint[][]} input_ids The input IDs.
   * @param {Tensor} logits The logits.
   * @returns {Tensor} The modified logits.
   */
  _call(e, t) {
    for (let r = 0; r < e.length; ++r) {
      let n = (
        /** @type {Float32Array} */
        t[r].data
      );
      for (let s of this.suppress_tokens)
        n[s] = -1 / 0;
    }
    return t;
  }
}, yg = class extends Ut {
  /**
   * Create a SuppressTokensAtBeginLogitsProcessor.
   * @param {number[]} begin_suppress_tokens The IDs of the tokens to suppress.
   * @param {number} begin_index The number of tokens to generate before suppressing tokens.
   */
  constructor(e, t) {
    super(), this.begin_suppress_tokens = e, this.begin_index = t;
  }
  /**
   * Apply the BOS token forcing to the logits.
   * @param {bigint[][]} input_ids The input IDs.
   * @param {Tensor} logits The logits.
   * @returns {Tensor} The logits with BOS token forcing.
   */
  _call(e, t) {
    for (let r = 0; r < e.length; ++r)
      if (e[r].length === this.begin_index) {
        let n = (
          /** @type {Float32Array} */
          t[r].data
        );
        for (let s of this.begin_suppress_tokens)
          n[s] = -1 / 0;
      }
    return t;
  }
}, SC = class extends Ut {
  /**
   * Constructs a new WhisperTimeStampLogitsProcessor.
   * @param {import('../models/whisper/generation_whisper.js').WhisperGenerationConfig} generate_config The config object passed to the `generate()` method of a transformer model.
   * @param {number[]} init_tokens The initial tokens of the input sequence.
   */
  constructor(e, t) {
    super(), this.eos_token_id = Array.isArray(e.eos_token_id) ? e.eos_token_id[0] : e.eos_token_id, this.no_timestamps_token_id = e.no_timestamps_token_id, this.timestamp_begin = this.no_timestamps_token_id + 1, this.begin_index = t.length, t.at(-1) === this.no_timestamps_token_id && (this.begin_index -= 1), this.max_initial_timestamp_index = e.max_initial_timestamp_index;
  }
  /**
   * Modify the logits to handle timestamp tokens.
   * @param {bigint[][]} input_ids The input sequence of tokens.
   * @param {Tensor} logits The logits output by the model.
   * @returns {Tensor} The modified logits.
   */
  _call(e, t) {
    for (let r = 0; r < e.length; ++r) {
      let n = (
        /** @type {Float32Array} */
        t[r].data
      );
      if (n[this.no_timestamps_token_id] = -1 / 0, e[r].length === this.begin_index) {
        n.subarray(0, this.timestamp_begin).fill(-1 / 0);
        continue;
      }
      let s = e[r].slice(this.begin_index), a = s.length >= 1 && s[s.length - 1] >= this.timestamp_begin, o = s.length < 2 || s[s.length - 2] >= this.timestamp_begin;
      if (a && (o ? n.subarray(this.timestamp_begin).fill(-1 / 0) : n.subarray(0, this.eos_token_id).fill(-1 / 0)), e[r].length === this.begin_index && this.max_initial_timestamp_index !== null) {
        let d = this.timestamp_begin + this.max_initial_timestamp_index;
        n.subarray(d + 1).fill(-1 / 0);
      }
      let i = AT(n), l = Math.log(
        i.subarray(this.timestamp_begin).map(Math.exp).reduce((d, h) => d + h)
      ), c = qe(i.subarray(0, this.timestamp_begin))[0];
      l > c && n.subarray(0, this.timestamp_begin).fill(-1 / 0);
    }
    return t;
  }
}, PC = class extends Ut {
  /**
   * Create a NoRepeatNGramLogitsProcessor.
   * @param {number} no_repeat_ngram_size The no-repeat n-gram size. All n-grams of this size can only occur once.
   */
  constructor(e) {
    super(), this.no_repeat_ngram_size = e;
  }
  /**
   * Generate n-grams from a sequence of token IDs.
   * @param {bigint[]} prevInputIds List of previous input IDs.
   * @returns {Map<string, number[]>} Map of generated n-grams
   */
  getNgrams(e) {
    let t = e.length, r = [];
    for (let s = 0; s < t + 1 - this.no_repeat_ngram_size; ++s) {
      let a = [];
      for (let o = 0; o < this.no_repeat_ngram_size; ++o)
        a.push(e[s + o]);
      r.push(a.map(Number));
    }
    let n = /* @__PURE__ */ new Map();
    for (let s of r) {
      let a = s.slice(0, s.length - 1), o = JSON.stringify(a), i = n.get(o) ?? [];
      i.push(s[s.length - 1]), n.set(o, i);
    }
    return n;
  }
  /**
   * Generate n-grams from a sequence of token IDs.
   * @param {Map<string, number[]>} bannedNgrams Map of banned n-grams
   * @param {bigint[]} prevInputIds List of previous input IDs.
   * @returns {number[]} Map of generated n-grams
   */
  getGeneratedNgrams(e, t) {
    let r = t.slice(t.length + 1 - this.no_repeat_ngram_size, t.length);
    return e.get(JSON.stringify(r.map(Number))) ?? [];
  }
  /**
   * Calculate banned n-gram tokens
   * @param {bigint[]} prevInputIds List of previous input IDs.
   * @returns {number[]} Map of generated n-grams
   */
  calcBannedNgramTokens(e) {
    let t = [];
    if (e.length + 1 < this.no_repeat_ngram_size)
      return t;
    {
      let r = this.getNgrams(e);
      return this.getGeneratedNgrams(r, e);
    }
  }
  /**
   * Apply the no-repeat n-gram processor to the logits.
   * @param {bigint[][]} input_ids The input IDs.
   * @param {Tensor} logits The logits.
   * @returns {Tensor} The logits with no-repeat n-gram processing.
   */
  _call(e, t) {
    for (let r = 0; r < e.length; ++r) {
      let n = (
        /** @type {Float32Array} */
        t[r].data
      ), s = this.calcBannedNgramTokens(e[r]);
      for (let a of s)
        n[a] = -1 / 0;
    }
    return t;
  }
}, FC = class extends Ut {
  /**
   * Create a \u0052epetitionPenaltyLogitsProcessor.
   * @param {number} penalty Penalty applied to repeated tokens.
   * - 1.0 means no penalty. Above 1.0 penalizes previously generated tokens.
   * - Between 0.0 and 1.0 rewards previously generated tokens.
   */
  constructor(e) {
    super(), this.penalty = e;
  }
  /**
   * Apply the repetition penalty to the logits.
   * @param {bigint[][]} input_ids The input IDs.
   * @param {Tensor} logits The logits.
   * @returns {Tensor} The logits with repetition penalty processing.
   */
  _call(e, t) {
    for (let r = 0; r < e.length; ++r) {
      let n = (
        /** @type {Float32Array} */
        t[r].data
      );
      for (let s of new Set(e[r])) {
        let a = Number(s);
        n[a] < 0 ? n[a] *= this.penalty : n[a] /= this.penalty;
      }
    }
    return t;
  }
}, IC = class extends Ut {
  /**
   * Create a MinLengthLogitsProcessor.
   * @param {number} min_length The minimum length below which the score of `eos_token_id` is set to negative infinity.
   * @param {number|number[]} eos_token_id The ID or IDs of the end-of-sequence token.
   */
  constructor(e, t) {
    super(), this.min_length = e, this.eos_token_id = Array.isArray(t) ? t : [t];
  }
  /**
   * Apply logit processor.
   * @param {bigint[][]} input_ids The input IDs.
   * @param {Tensor} logits The logits.
   * @returns {Tensor} The processed logits.
   */
  _call(e, t) {
    for (let r = 0; r < e.length; ++r)
      if (e[r].length < this.min_length) {
        let n = (
          /** @type {Float32Array} */
          t[r].data
        );
        for (let s of this.eos_token_id)
          n[s] = -1 / 0;
      }
    return t;
  }
}, LC = class extends Ut {
  /**
   * Create a MinNewTokensLengthLogitsProcessor.
   * @param {number} prompt_length_to_skip The input tokens length.
   * @param {number} min_new_tokens The minimum *new* tokens length below which the score of `eos_token_id` is set to negative infinity.
   * @param {number|number[]} eos_token_id The ID or IDs of the end-of-sequence token.
   */
  constructor(e, t, r) {
    super(), this.prompt_length_to_skip = e, this.min_new_tokens = t, this.eos_token_id = Array.isArray(r) ? r : [r];
  }
  /**
   * Apply logit processor.
   * @param {bigint[][]} input_ids The input IDs.
   * @param {Tensor} logits The logits.
   * @returns {Tensor} The processed logits.
   */
  _call(e, t) {
    for (let r = 0; r < e.length; ++r)
      if (e[r].length - this.prompt_length_to_skip < this.min_new_tokens) {
        let s = (
          /** @type {Float32Array} */
          t[r].data
        );
        for (let a of this.eos_token_id)
          s[a] = -1 / 0;
      }
    return t;
  }
}, OC = class extends Ut {
  /**
   * Create a `NoBadWordsLogitsProcessor`.
   * @param {number[][]} bad_words_ids List of token ID sequences that are not allowed to be generated.
   * @param {number|number[]} eos_token_id The ID of the *end-of-sequence* token. Optionally, use a list to set multiple *end-of-sequence* tokens.
   */
  constructor(e, t) {
    super(), this.bad_words_ids = e, this.eos_token_id = Array.isArray(t) ? t : [t];
  }
  /**
   * Apply logit processor.
   * @param {bigint[][]} input_ids The input IDs.
   * @param {Tensor} logits The logits.
   * @returns {Tensor} The processed logits.
   */
  _call(e, t) {
    for (let r = 0; r < e.length; ++r) {
      let n = (
        /** @type {Float32Array} */
        t[r].data
      ), s = e[r];
      for (let a of this.bad_words_ids) {
        if (s.length < a.length - 1) continue;
        let o = !0;
        for (let i = 1; i <= a.length - 1; ++i)
          if (a.at(-i - 1) != s.at(-i)) {
            o = !1;
            break;
          }
        o && (n[a.at(-1)] = -1 / 0);
      }
    }
    return t;
  }
}, NC = class extends Ut {
  /**
   * Create a `ClassifierFreeGuidanceLogitsProcessor`.
   * @param {number} guidance_scale The guidance scale for classifier-free guidance (CFG). CFG is enabled by setting `guidance_scale > 1`.
   * Higher guidance scale encourages the model to generate samples that are more closely tied to the input
   * prompt, usually at the expense of poorer quality.
   */
  constructor(e) {
    if (super(), e <= 1)
      throw new Error(
        `Require guidance scale >1 to use the classifier-free guidance processor, got guidance scale ${e}.`
      );
    this.guidance_scale = e;
  }
  /**
   * Apply logit processor.
   * @param {bigint[][]} input_ids The input IDs.
   * @param {Tensor} logits The logits.
   * @returns {Tensor} The processed logits.
   */
  _call(e, t) {
    if (t.dims[0] !== 2 * e.length)
      throw new Error(
        `Logits should have twice the batch size of the input ids, the first half of batches corresponding to the conditional inputs, and the second half of batches corresponding to the unconditional inputs. Got batch size ${t.dims[0]} for the logits and ${e.length} for the input ids.`
      );
    let r = e.length, n = t.slice([0, r], null), s = t.slice([r, t.dims[0]], null);
    for (let a = 0; a < s.data.length; ++a)
      s.data[a] += (n.data[a] - s.data[a]) * this.guidance_scale;
    return s;
  }
}, DC = class extends TC {
  /**
   * Create a `TemperatureLogitsWarper`.
   * @param {number} temperature Strictly positive float value used to modulate the logits distribution.
   * A value smaller than `1` decreases randomness (and vice versa), with `0` being equivalent to shifting
   * all probability mass to the most likely token.
   */
  constructor(e) {
    if (super(), typeof e != "number" || e <= 0) {
      let t = `\`temperature\` (=${e}) must be a strictly positive float, otherwise your next token scores will be invalid.`;
      e === 0 && (t += " If you're looking for greedy decoding strategies, set `do_sample=false`.");
    }
    this.temperature = e;
  }
  /**
   * Apply logit warper.
   * @param {bigint[][]} input_ids The input IDs.
   * @param {Tensor} logits The logits.
   * @returns {Tensor} The processed logits.
   */
  _call(e, t) {
    let r = (
      /** @type {Float32Array} */
      t.data
    );
    for (let n = 0; n < r.length; ++n)
      r[n] /= this.temperature;
    return t;
  }
};
var bg = class {
  // Parameters that control the length of the output
  /**
   * The maximum length the generated tokens can have.
   * Corresponds to the length of the input prompt + `max_new_tokens`.
   * Its effect is overridden by `max_new_tokens`, if also set.
   * @type {number}
   * @default 20
   */
  max_length = 20;
  /**
   * The maximum number of tokens to generate, ignoring the number of tokens in the prompt.
   * @type {number}
   * @default null
   */
  max_new_tokens = null;
  /**
   * The minimum length of the sequence to be generated.
   * Corresponds to the length of the input prompt + `min_new_tokens`.
   * Its effect is overridden by `min_new_tokens`, if also set.
   * @type {number}
   * @default 0
   */
  min_length = 0;
  /**
   * The minimum number of tokens to generate, ignoring the number of tokens in the prompt.
   * @type {number}
   * @default null
   */
  min_new_tokens = null;
  /**
   * Controls the stopping condition for beam-based methods, like beam-search. It accepts the following values:
   * - `true`, where the generation stops as soon as there are `num_beams` complete candidates;
   * - `false`, where a heuristic is applied and the generation stops when it is very unlikely to find better candidates;
   * - `"never"`, where the beam search procedure only stops when there cannot be better candidates (canonical beam search algorithm).
   * @type {boolean|"never"}
   * @default false
   */
  early_stopping = !1;
  /**
   * The maximum time, in seconds, allowed for generation.
   * Generation will still finish the current pass after the allocated time has passed.
   * @type {number}
   * @default null
   */
  max_time = null;
  // Parameters that control the generation strategy used
  /**
   * Whether to use sampling; use greedy decoding otherwise.
   * @type {boolean}
   * @default false
   */
  do_sample = !1;
  /**
   * Number of beams for beam search. 1 means no beam search.
   * @type {number}
   * @default 1
   */
  num_beams = 1;
  /**
   * Number of groups to divide `num_beams` into to encourage diversity among different groups of beams.
   * See [this paper](https://huggingface.co/papers/1610.02424) for more details.
   * @type {number}
   * @default 1
   */
  num_beam_groups = 1;
  /**
   * Balance model confidence against the degeneration penalty during contrastive search decoding.
   * @type {number}
   * @default null
   */
  penalty_alpha = null;
  /**
   * Whether the model should reuse past key/value states, when supported, to speed up decoding.
   * @type {boolean}
   * @default true
   */
  use_cache = !0;
  // Parameters for manipulation of the model output logits
  /**
   * The value used to modulate the next token probabilities.
   * @type {number}
   * @default 1.0
   */
  temperature = 1;
  /**
   * The number of highest-probability vocabulary tokens to keep for top-k filtering.
   * @type {number}
   * @default 50
   */
  top_k = 50;
  /**
   * If set to a float below 1, only the smallest set of most probable tokens with probabilities that add up to `top_p` or higher are kept for generation.
   * @type {number}
   * @default 1.0
   */
  top_p = 1;
  /**
   * Local typicality measures how similar the conditional probability of predicting a target token next is to the expected conditional probability of predicting a random token next, given the partial text already generated.
   * If set to a float below 1, the smallest set of the most locally typical tokens with probabilities that add up to `typical_p` or higher are kept for generation.
   * See [this paper](https://huggingface.co/papers/2202.00666) for more details.
   * @type {number}
   * @default 1.0
   */
  typical_p = 1;
  /**
   * If set to a float strictly between 0 and 1, only tokens with a conditional probability greater than `epsilon_cutoff` will be sampled.
   * In the paper, suggested values range from 3e-4 to 9e-4, depending on the size of the model.
   * See [Truncation Sampling as Language Model Desmoothing](https://huggingface.co/papers/2210.15191) for more details.
   * @type {number}
   * @default 0.0
   */
  epsilon_cutoff = 0;
  /**
   * Eta sampling is a hybrid of locally typical sampling and epsilon sampling.
   * If set to a float strictly between 0 and 1, a token is only considered if it is greater than either `eta_cutoff` or `sqrt(eta_cutoff) * exp(-entropy(softmax(next_token_logits)))`.
   * The latter term is intuitively the expected next token probability, scaled by `sqrt(eta_cutoff)`. In the paper, suggested values range from 3e-4 to 2e-3, depending on the size of the model.
   * See [Truncation Sampling as Language Model Desmoothing](https://huggingface.co/papers/2210.15191) for more details.
   * @type {number}
   * @default 0.0
   */
  eta_cutoff = 0;
  /**
   * This value is subtracted from a beam's score if it generates the same token as any beam from another group at a particular time.
   * Note that `diversity_penalty` is only effective if `group beam search` is enabled.
   * @type {number}
   * @default 0.0
   */
  diversity_penalty = 0;
  /**
   * Penalty applied to repeated tokens. 1.0 means no penalty.
   * See [this paper](https://huggingface.co/papers/1909.05858) for more details.
   * @type {number}
   * @default 1.0
   */
  repetition_penalty = 1;
  /**
   * Penalty applied to sequences that are not in the original input.
   * 1.0 means no penalty.
   * @type {number}
   * @default 1.0
   */
  encoder_repetition_penalty = 1;
  /**
   * Exponential penalty applied to sequence length during beam-based generation.
   * It is applied as an exponent to the sequence length, which in turn is used to divide the score of the sequence.
   * Since the score is the log likelihood of the sequence (i.e. negative), `length_penalty` > 0.0 promotes longer sequences, while `length_penalty` < 0.0 encourages shorter sequences.
   * @type {number}
   * @default 1.0
   */
  length_penalty = 1;
  /**
   * If set to an integer greater than 0, all n-grams of that size can only occur once.
   * @type {number}
   * @default 0
   */
  no_repeat_ngram_size = 0;
  /**
   * List of token IDs that are not allowed to be generated.
   * In order to get the token IDs of the words that should not appear in the generated text, use
   * `tokenizer(bad_words, { add_prefix_space: true, add_special_tokens: false }).input_ids`.
   * @type {number[][]}
   * @default null
   */
  bad_words_ids = null;
  /**
   * List of token IDs that must be generated.
   * If given a `number[][]`, this is treated as a simple list of words that must be included, the opposite of `bad_words_ids`.
   * If given `number[][][]`, this triggers a [disjunctive constraint](https://github.com/huggingface/transformers/issues/14081), which allows different forms of each word.
   * @type {number[][]|number[][][]}
   * @default null
   */
  force_words_ids = null;
  /**
   * Whether to renormalize the logits after applying all the logits processors or warpers (including the custom ones).
   * It's highly recommended to set this flag to `true` because search algorithms assume the score logits are normalized, but some logit processors or warpers break the normalization.
   * @type {boolean}
   * @default false
   */
  renormalize_logits = !1;
  /**
   * Custom constraints that guide generation to include certain tokens as defined by `Constraint` objects.
   * @type {Object[]}
   * @default null
   */
  constraints = null;
  /**
   * The ID of the token to force as the first generated token after the `decoder_start_token_id`.
   * Useful for multilingual models like mBART where the first generated token needs to be the target language token.
   * @type {number}
   * @default null
   */
  forced_bos_token_id = null;
  /**
   * The ID of the token to force as the last generated token when `max_length` is reached.
   * Optionally, use a list to set multiple *end-of-sequence* tokens.
   * @type {number|number[]}
   * @default null
   */
  forced_eos_token_id = null;
  /**
   * Whether to remove possible *nan* and *inf* outputs of the model to prevent the generation method from crashing. Note that using `remove_invalid_values` can slow down generation.
   * @type {boolean}
   */
  remove_invalid_values = !1;
  /**
   * This tuple adds an exponentially increasing length penalty after a certain number of tokens have been generated.
   * The tuple consists of: `(start_index, decay_factor)` where `start_index` indicates where the penalty starts and `decay_factor` represents the factor of exponential decay.
   * @type {[number, number]}
   * @default null
   */
  exponential_decay_length_penalty = null;
  /**
   * A list of tokens to suppress during generation.
   * The `SuppressTokens` logit processor sets their log probabilities to `-inf` so that they are not sampled.
   * @type {number[]}
   * @default null
   */
  suppress_tokens = null;
  /**
   * Streamer used to yield generated text incrementally.
   * @type {import('./streamers.js').TextStreamer}
   * @default null
   */
  streamer = null;
  /**
   * A list of tokens to suppress at the beginning of the generation.
   * The `SuppressBeginTokens` logit processor sets their log probabilities to `-inf` so that they are not sampled.
   * @type {number[]}
   * @default null
   */
  begin_suppress_tokens = null;
  /**
   * A list of integer pairs that maps generation indices to token indices that will be forced before sampling.
   * For example, `[[1, 123]]` means the second generated token will always be a token of index 123.
   * @type {[number, number][]}
   * @default null
   */
  forced_decoder_ids = null;
  /**
   * The guidance scale for classifier-free guidance (CFG). CFG is enabled by setting `guidance_scale > 1`.
   * Higher guidance scale encourages the model to generate samples that are more closely tied to the input
   * prompt, usually at the expense of poorer quality.
   * @type {number}
   * @default null
   */
  guidance_scale = null;
  // Parameters that define the output variables of `generate`
  /**
   * The number of independently computed returned sequences for each element in the batch.
   * @type {number}
   * @default 1
   */
  num_return_sequences = 1;
  /**
   * Whether to return attention tensors from all attention layers.
   * See `attentions` under returned tensors for more details.
   * @type {boolean}
   * @default false
   */
  output_attentions = !1;
  /**
   * Whether to return the hidden states of all layers.
   * See `hidden_states` under returned tensors for more details.
   * @type {boolean}
   * @default false
   */
  output_hidden_states = !1;
  /**
   * Whether to return the prediction scores.
   * See `scores` under returned tensors for more details.
   * @type {boolean}
   * @default false
   */
  output_scores = !1;
  /**
   * Whether to return a `ModelOutput` instead of a plain tuple.
   * @type {boolean}
   * @default false
   */
  return_dict_in_generate = !1;
  // Special tokens that can be used at generation time
  /**
   * The ID of the *padding* token.
   * @type {number}
   * @default null
   */
  pad_token_id = null;
  /**
   * The ID of the *beginning-of-sequence* token.
   * @type {number}
   * @default null
   */
  bos_token_id = null;
  /**
   * The ID of the *end-of-sequence* token.
   * Optionally, use a list to set multiple *end-of-sequence* tokens.
   * @type {number|number[]}
   * @default null
   */
  eos_token_id = null;
  // Generation parameters exclusive to encoder-decoder models
  /**
   * If set to an integer greater than 0, all n-grams of that size that occur in the `encoder_input_ids` cannot occur in the `decoder_input_ids`.
   * @type {number}
   * @default 0
   */
  encoder_no_repeat_ngram_size = 0;
  /**
   * If an encoder-decoder model starts decoding with a token other than *bos*, the ID of that token.
   * @type {number}
   * @default null
   */
  decoder_start_token_id = null;
  // Wild card
  /**
   * Additional generation kwargs forwarded to the model's `generate` function.
   * Kwargs that are not present in `generate`'s signature are used in the model forward pass.
   * @type {Object}
   * @default {}
   */
  generation_kwargs = {};
  /**
   *
   * @param {GenerationConfig|import('../configs.js').PretrainedConfig} config
   */
  constructor(e) {
    Object.assign(this, et(e, Object.getOwnPropertyNames(this)));
  }
}, Fa = class extends mt {
  /**
   *
   * @param {number[][]} input_ids (`number[][]` of shape `(batch_size, sequence_length)`):
   * Indices of input sequence tokens in the vocabulary.
   * @param {number[][]} scores (`number[][]` of shape `(batch_size, config.vocab_size)`):
   * Prediction scores of a language modeling head. These can be scores for each vocabulary token before SoftMax
   * or scores for each vocabulary token after SoftMax.
   * @returns {boolean[]} A list of booleans indicating whether each sequence should be stopped.
   */
  _call(e, t) {
    throw Error("StoppingCriteria needs to be subclassed");
  }
}, Mg = class xg extends mt {
  /**
   * Constructs a new instance of `StoppingCriteriaList`.
   */
  constructor() {
    super(), this.criteria = [];
  }
  /**
   * Adds a new stopping criterion to the list.
   *
   * @param {StoppingCriteria} item The stopping criterion to add.
   */
  push(t) {
    this.criteria.push(t);
  }
  /**
   * Adds multiple stopping criteria to the list.
   *
   * @param {StoppingCriteria|StoppingCriteriaList|StoppingCriteria[]} items The stopping criteria to add.
   */
  extend(t) {
    t instanceof xg ? t = t.criteria : t instanceof Fa && (t = [t]), this.criteria.push(...t);
  }
  _call(t, r) {
    let n = new Array(t.length).fill(!1);
    for (let s of this.criteria) {
      let a = s(t, r);
      for (let o = 0; o < n.length; ++o)
        n[o] ||= a[o];
    }
    return n;
  }
  [Symbol.iterator]() {
    return this.criteria.values();
  }
}, zC = class extends Fa {
  /**
   *
   * @param {number} max_length The maximum length that the output sequence can have in number of tokens.
   * @param {number} [max_position_embeddings=null] The maximum model length, as defined by the model's `config.max_position_embeddings` attribute.
   */
  constructor(e, t = null) {
    super(), this.max_length = e, this.max_position_embeddings = t;
  }
  _call(e) {
    return e.map((t) => t.length >= this.max_length);
  }
}, BC = class extends Fa {
  /**
   *
   * @param {number|number[]} eos_token_id The ID of the *end-of-sequence* token.
   * Optionally, use a list to set multiple *end-of-sequence* tokens.
   */
  constructor(e) {
    super(), Array.isArray(e) || (e = [e]), this.eos_token_id = e;
  }
  /**
   *
   * @param {number[][]} input_ids
   * @param {number[][]} scores
   * @returns {boolean[]}
   */
  _call(e, t) {
    return e.map((r) => {
      let n = r.at(-1);
      return this.eos_token_id.some((s) => n == s);
    });
  }
};
var Ia = class extends mt {
  /**
   * Creates a new Sampler object with the specified generation config.
   * @param {GenerationConfig} generation_config The generation config.
   */
  constructor(e) {
    super(), this.generation_config = e;
  }
  /**
   * Executes the sampler, using the specified logits.
   * @param {Tensor} logits
   * @returns {Promise<[bigint, number][]>}
   */
  async _call(e) {
    return this.sample(e);
  }
  /**
   * Abstract method for sampling the logits.
   * @param {Tensor} logits
   * @throws {Error} If not implemented in subclass.
   * @returns {Promise<[bigint, number][]>}
   */
  async sample(e) {
    throw Error("sample should be implemented in subclasses.");
  }
  /**
   * Returns the specified logits as an array, with temperature applied.
   * @param {Tensor} logits
   * @param {number} index
   * @returns {Float32Array}
   */
  getLogits(e, t) {
    let r = e.dims.at(-1), n = (
      /** @type {Float32Array} */
      e.data
    );
    if (t === -1)
      n = n.slice(-r);
    else {
      let s = t * r;
      n = n.slice(s, s + r);
    }
    return n;
  }
  /**
   * Selects an item randomly based on the specified probabilities.
   * @param {Float32Array} probabilities An array of probabilities to use for selection.
   * @returns {number} The index of the selected item.
   */
  randomSelect(e) {
    return uT(e);
  }
  /**
   * Returns a Sampler object based on the specified options.
   * @param {GenerationConfig} generation_config An object containing options for the sampler.
   * @returns {LogitsSampler} A Sampler object.
   */
  static getSampler(e) {
    if (e.do_sample)
      return new $C(e);
    if (e.num_beams > 1)
      return new GC(e);
    if (e.num_return_sequences > 1)
      throw Error(
        `num_return_sequences has to be 1 when doing greedy search, but is ${e.num_return_sequences}.`
      );
    return new RC(e);
  }
}, RC = class extends Ia {
  /**
   * Sample the maximum probability of a given logits tensor.
   * @param {Tensor} logits
   * @returns {Promise<[bigint, number][]>} An array with a single tuple, containing the index of the maximum value and a meaningless score (since this is a greedy search).
   */
  async sample(e) {
    let t = qe(e.data)[1];
    return [[BigInt(t), 0]];
  }
}, $C = class extends Ia {
  /**
   * Sample from the logits.
   * @param {Tensor} logits
   * @returns {Promise<[bigint, number][]>}
   */
  async sample(e) {
    let t = e.dims.at(-1);
    this.generation_config.top_k > 0 && (t = Math.min(this.generation_config.top_k, t));
    let [r, n] = await Pn(e, t), s = at(
      /** @type {Float32Array} */
      r.data
    );
    return Array.from({ length: this.generation_config.num_beams }, () => {
      let a = this.randomSelect(s);
      return [
        n.data[a],
        // token id
        Math.log(s[a])
        // score
      ];
    });
  }
}, GC = class extends Ia {
  /**
   * Sample from the logits.
   * @param {Tensor} logits
   * @returns {Promise<[bigint, number][]>}
   */
  async sample(e) {
    let t = e.dims.at(-1);
    this.generation_config.top_k > 0 && (t = Math.min(this.generation_config.top_k, t));
    let [r, n] = await Pn(e, t), s = at(
      /** @type {Float32Array} */
      r.data
    );
    return Array.from({ length: this.generation_config.num_beams }, (a, o) => [
      n.data[o],
      // token id
      Math.log(s[o])
      // score
    ]);
  }
}, VC = class {
  /**
   * Create a DynamicCache, optionally pre-populated with entries.
   * @param {Record<string, Tensor>} [entries] Initial name→Tensor mappings.
   */
  constructor(e) {
    if (e)
      for (let t in e) {
        if (t in this)
          throw new TypeError(`Key "${t}" conflicts with an existing property on DynamicCache`);
        let r = e[t];
        if (!(r instanceof V))
          throw new TypeError(`Expected a Tensor for key "${t}", got ${typeof r}`);
        this[t] = r;
      }
  }
  /**
   * Get the cached sequence length. This requires at least one attention cache entry to be present.
   * @returns {number} The past sequence length.
   */
  get_seq_length() {
    let e = (
      /** @type {any} */
      this
    );
    if (Object.keys(e).length === 0)
      return 0;
    for (let t in e)
      if (t.startsWith("past_key_values."))
        return e[t].dims.at(-2);
    throw new Error("Unable to determine sequence length from the cache.");
  }
  /**
   * Update the cache in-place with new entries, disposing replaced GPU tensors.
   * @param {Record<string, Tensor>} newEntries The new name → Tensor mappings.
   */
  update(e) {
    for (let t in e) {
      let r = this[t], n = e[t];
      r && r !== n && r.location === "gpu-buffer" && r.dispose(), this[t] = n;
    }
  }
  /**
   * Dispose all contained tensors whose data resides on the GPU.
   * Returns a promise that resolves when all disposals are complete.
   * @returns {Promise<void>} Promise that resolves when all GPU tensors are disposed.
   */
  async dispose() {
    let e = [];
    for (
      let t of
      /** @type {Tensor[]} */
      Object.values(this)
    )
      t.location === "gpu-buffer" && e.push(t.dispose());
    await Promise.all(e);
  }
}, yl = (
  /** @type {new (entries?: Record<string, Tensor>) => DynamicCache} */
  /** @type {unknown} */
  VC
), j = {
  EncoderOnly: 0,
  EncoderDecoder: 1,
  Seq2Seq: 2,
  Vision2Seq: 3,
  DecoderOnly: 4,
  DecoderOnlyWithoutHead: 5,
  MaskGeneration: 6,
  ImageTextToText: 7,
  Musicgen: 8,
  MultiModality: 9,
  Phi3V: 10,
  AudioTextToText: 11,
  AutoEncoder: 12,
  ImageAudioTextToText: 13,
  Supertonic: 14,
  Chatterbox: 15,
  VoxtralRealtime: 16,
  MultimodalEncoder: 17
}, dr = {
  [j.DecoderOnly]: {
    sessions: (e, t) => ({ model: t.model_file_name ?? "model" }),
    cache_sessions: { model: !0 },
    optional_configs: { generation_config: "generation_config.json" }
  },
  [j.DecoderOnlyWithoutHead]: {
    sessions: (e, t) => ({ model: t.model_file_name ?? "model" })
  },
  [j.Seq2Seq]: {
    sessions: () => ({ model: "encoder_model", decoder_model_merged: "decoder_model_merged" }),
    cache_sessions: { decoder_model_merged: !0 },
    optional_configs: { generation_config: "generation_config.json" }
  },
  [j.Vision2Seq]: {
    sessions: () => ({ model: "encoder_model", decoder_model_merged: "decoder_model_merged" }),
    cache_sessions: { decoder_model_merged: !0 },
    optional_configs: { generation_config: "generation_config.json" }
  },
  [j.Musicgen]: {
    sessions: () => ({
      model: "text_encoder",
      decoder_model_merged: "decoder_model_merged",
      encodec_decode: "encodec_decode"
    }),
    cache_sessions: { decoder_model_merged: !0 },
    optional_configs: { generation_config: "generation_config.json" }
  },
  [j.EncoderDecoder]: {
    sessions: () => ({ model: "encoder_model", decoder_model_merged: "decoder_model_merged" }),
    cache_sessions: { decoder_model_merged: !0 }
  },
  [j.MaskGeneration]: {
    sessions: () => ({ model: "vision_encoder", prompt_encoder_mask_decoder: "prompt_encoder_mask_decoder" })
  },
  [j.ImageTextToText]: {
    text_only_sessions: { embed_tokens: "embed_tokens", decoder_model_merged: "decoder_model_merged" },
    sessions: (e, t, r) => {
      let n = { ...dr[j.ImageTextToText].text_only_sessions };
      return r || (n.vision_encoder = "vision_encoder"), e.is_encoder_decoder && (n.model = "encoder_model"), n;
    },
    cache_sessions: { decoder_model_merged: !0 },
    optional_configs: { generation_config: "generation_config.json" }
  },
  [j.AudioTextToText]: {
    text_only_sessions: { embed_tokens: "embed_tokens", decoder_model_merged: "decoder_model_merged" },
    sessions: (e, t, r) => {
      let n = { ...dr[j.AudioTextToText].text_only_sessions };
      return r || (n.audio_encoder = "audio_encoder"), n;
    },
    cache_sessions: { decoder_model_merged: !0 },
    optional_configs: { generation_config: "generation_config.json" }
  },
  [j.ImageAudioTextToText]: {
    text_only_sessions: { embed_tokens: "embed_tokens", decoder_model_merged: "decoder_model_merged" },
    sessions: (e, t, r) => {
      let n = { ...dr[j.ImageAudioTextToText].text_only_sessions };
      return r || (n.audio_encoder = "audio_encoder", n.vision_encoder = "vision_encoder"), n;
    },
    cache_sessions: { decoder_model_merged: !0 },
    optional_configs: { generation_config: "generation_config.json" }
  },
  [j.Phi3V]: {
    sessions: () => ({
      prepare_inputs_embeds: "prepare_inputs_embeds",
      model: "model",
      vision_encoder: "vision_encoder"
    }),
    cache_sessions: { model: !0 },
    optional_configs: { generation_config: "generation_config.json" }
  },
  [j.MultiModality]: {
    sessions: () => ({
      prepare_inputs_embeds: "prepare_inputs_embeds",
      model: "language_model",
      lm_head: "lm_head",
      gen_head: "gen_head",
      gen_img_embeds: "gen_img_embeds",
      image_decode: "image_decode"
    }),
    cache_sessions: { model: !0 },
    optional_configs: { generation_config: "generation_config.json" }
  },
  [j.AutoEncoder]: {
    sessions: () => ({ encoder_model: "encoder_model", decoder_model: "decoder_model" })
  },
  [j.Supertonic]: {
    sessions: () => ({
      text_encoder: "text_encoder",
      latent_denoiser: "latent_denoiser",
      voice_decoder: "voice_decoder"
    })
  },
  [j.Chatterbox]: {
    sessions: () => ({
      embed_tokens: "embed_tokens",
      speech_encoder: "speech_encoder",
      model: "language_model",
      conditional_decoder: "conditional_decoder"
    }),
    cache_sessions: { model: !0 },
    optional_configs: { generation_config: "generation_config.json" }
  },
  [j.VoxtralRealtime]: {
    text_only_sessions: { embed_tokens: "embed_tokens", decoder_model_merged: "decoder_model_merged" },
    sessions: (e, t, r) => {
      let n = { ...dr[j.VoxtralRealtime].text_only_sessions };
      return r || (n.audio_encoder = "audio_encoder"), n;
    },
    cache_sessions: { decoder_model_merged: !0, audio_encoder: !0 },
    optional_configs: { generation_config: "generation_config.json" }
  },
  [j.MultimodalEncoder]: {
    // The vision and audio encoders are only loaded when the config has their `vision_config` / `audio_config`
    sessions: (e, t) => ({
      model: t.model_file_name ?? "model",
      ...e.vision_config && { vision_encoder: "vision_encoder" },
      ...e.audio_config && { audio_encoder: "audio_encoder" }
    })
  },
  default: {
    sessions: (e, t) => ({ model: t.model_file_name ?? "model" })
  }
};
function UC(e) {
  return dr[e]?.text_only_sessions ?? null;
}
function jC(e, t, r = {}) {
  let n = dr[e] ?? dr.default;
  return {
    sessions: n.sessions(t, r, r.textOnly ?? !1),
    cache_sessions: n.cache_sessions,
    optional_configs: n.optional_configs
  };
}
function kg(e, { warn: t = !0 } = {}) {
  let r = (
    /** @type {string[]} */
    e.architectures || []
  );
  for (let n of r) {
    let s = hr.get(n);
    if (s !== void 0)
      return s;
  }
  if (e.model_type) {
    let n = hr.get(e.model_type);
    if (n !== void 0)
      return n;
    for (let s of Object.values(yn))
      if (s.has(e.model_type)) {
        let a = hr.get(s.get(e.model_type));
        if (a !== void 0)
          return a;
      }
  }
  if (t) {
    let n = r.length > 0 ? r.join(", ") : "(none)";
    le.warn(
      `[resolve_model_type] Architecture(s) not found in MODEL_TYPE_MAPPING: [${n}] for model type '${e.model_type}'. Falling back to EncoderOnly (single model.onnx file). If you encounter issues, please report at: ${Ca}`
    );
  }
  return j.EncoderOnly;
}
function Tg(e, { config: t = null, cache_dir: r = null, local_files_only: n = !1, revision: s = "main" } = {}) {
  if (t !== null)
    return hs.from_pretrained(e, { config: t, cache_dir: r, local_files_only: n, revision: s });
  let a = nl(e, { cache_dir: r, local_files_only: n, revision: s });
  return hm(
    a,
    () => hs.from_pretrained(e, { config: t, cache_dir: r, local_files_only: n, revision: s })
  );
}
async function Eg(e, { config: t = null, dtype: r = null, device: n = null, model_file_name: s = null } = {}) {
  t = await Tg(e, { config: t });
  let a = [
    // Add config.json (always loaded)
    "config.json"
  ], o = t["transformers.js_config"] ?? {}, i = o.use_external_data_format, l = "onnx", c = n ?? o.device, d = r ?? o.dtype, h = kg(t), _ = (v, y = null) => {
    y = y ?? v;
    let b = xm(c, v), k = km(d, v, b), A = va[k] ?? "", E = `${y}${A}.onnx`, C = l ? `${l}/${E}` : E;
    a.push(C);
    let N = mg(i, E, v);
    for (let M of gg(E, N)) {
      let $ = l ? `${l}/${M}` : M;
      a.push($);
    }
  }, { sessions: p, optional_configs: w } = jC(h, t, { model_file_name: s });
  for (let [v, y] of Object.entries(p))
    _(v, y);
  if (w)
    for (let v of Object.values(w))
      a.push(v);
  return a;
}
var yn = null;
function WC(e) {
  yn = e;
}
function Wi(e) {
  if (e instanceof V)
    return e;
  if (e.length === 0)
    throw Error("items must be non-empty");
  if (Array.isArray(e[0])) {
    if (e.some((t) => t.length !== e[0].length))
      throw Error(
        "Unable to create tensor, you should probably activate truncation and/or padding with 'padding=True' and/or 'truncation=True' to have batched tensors with the same length."
      );
    return new V("int64", BigInt64Array.from(e.flat().map((t) => BigInt(t))), [
      e.length,
      e[0].length
    ]);
  } else
    return new V("int64", BigInt64Array.from(e.map((t) => BigInt(t))), [1, e.length]);
}
function Ag(e) {
  return new V("bool", [e], [1]);
}
var Tp = {
  [j.DecoderOnly]: {
    can_generate: !0,
    forward: _r,
    prepare_inputs: An
  },
  [j.DecoderOnlyWithoutHead]: {
    can_generate: !1,
    forward: _r,
    prepare_inputs: An
  },
  [j.Seq2Seq]: {
    can_generate: !0,
    forward: ra,
    prepare_inputs: ba
  },
  [j.Vision2Seq]: {
    can_generate: !0,
    forward: ra,
    prepare_inputs: ba
  },
  [j.Musicgen]: {
    can_generate: !0,
    forward: ra
  },
  [j.EncoderDecoder]: {
    can_generate: !1,
    forward: ra
  },
  [j.ImageTextToText]: {
    can_generate: !0,
    forward: XC,
    prepare_inputs: na
  },
  [j.AudioTextToText]: {
    can_generate: !0,
    forward: QC,
    prepare_inputs: na
  },
  [j.ImageAudioTextToText]: {
    can_generate: !0,
    prepare_inputs: na
  },
  [j.Phi3V]: {
    can_generate: !0,
    prepare_inputs: na
  },
  [j.MultiModality]: {
    can_generate: !0
  },
  [j.AutoEncoder]: {
    can_generate: !1,
    forward: qC
  },
  [j.Chatterbox]: {
    can_generate: !0,
    forward: Ir
  },
  [j.VoxtralRealtime]: {
    can_generate: !0,
    prepare_inputs: An
  },
  default: {
    can_generate: !1,
    forward: Ir
  }
};
function Ep(e, t) {
  let r = hr.get(e), n = !1, s = t?.architectures?.[0];
  if (s && s !== e && e?.endsWith("ForCausalLM") && s.endsWith("ForConditionalGeneration")) {
    let i = hr.get(s);
    i !== void 0 && (r = i, n = !0);
  }
  let a = Tp[r] ?? Tp.default, o = dr[r] ?? dr.default;
  return { typeConfig: { ...a, ...o }, textOnly: n, modelType: r };
}
var hr = /* @__PURE__ */ new Map(), bl = /* @__PURE__ */ new Map(), En = /* @__PURE__ */ new Map(), I = class extends mt {
  main_input_name = "input_ids";
  forward_params = ["input_ids", "attention_mask"];
  _return_dict_in_generate_keys = null;
  /**
   * Create a model from configuration and inference sessions.
   * @param {import('../configs.js').PretrainedConfig} config The model configuration.
   * @param {Record<string, any>} sessions The inference sessions for the model.
   * @param {Record<string, Object>} configs Additional configuration files (e.g., generation_config.json).
   */
  constructor(e, t, r) {
    super(), this.config = e, this.sessions = t, this.configs = r;
    let n = En.get(this.constructor), { typeConfig: s } = Ep(n, e);
    this.can_generate = s.can_generate, this._forward = s.forward, this._prepare_inputs_for_generation = s.prepare_inputs, this.can_generate && this.forward_params.push("past_key_values"), this.custom_config = this.config["transformers.js_config"] ?? {};
  }
  /**
   * Disposes of all the ONNX sessions that were created during inference.
   * @returns {Promise<void[]>} Resolves after each session has been released.
   * @todo Use https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/FinalizationRegistry
   */
  async dispose() {
    let e = [];
    for (let t of Object.values(this.sessions))
      e.push(t.release?.());
    return await Promise.all(e);
  }
  /**
   * Instantiate one of the model classes of the library from a pretrained model.
   *
   * The model class to instantiate is selected based on the `model_type` property of the config object
   * (either passed as an argument or loaded from `pretrained_model_name_or_path` if possible)
   *
   * @param {string} pretrained_model_name_or_path The name or path of the pretrained model. Can be either:
   * - A string, the *model ID* of a pretrained model hosted inside a model repo on huggingface.co.
   *   Valid model IDs can be located at the root level, like `bert-base-uncased`, or namespaced under a
   *   user or organization name, like `dbmdz/bert-base-german-cased`.
   * - A path to a *directory* containing model weights, e.g., `./my_model_directory/`.
   * @param {import('../utils/hub.js').PretrainedModelOptions} options Additional options for loading the model.
   *
   * @returns {Promise<PreTrainedModel>} A model instance with ready inference sessions.
   */
  static async from_pretrained(e, {
    progress_callback: t = null,
    config: r = null,
    cache_dir: n = null,
    local_files_only: s = !1,
    revision: a = "main",
    model_file_name: o = null,
    subfolder: i = "onnx",
    device: l = null,
    dtype: c = null,
    use_external_data_format: d = null,
    session_options: h = {}
  } = {}) {
    let _ = {
      progress_callback: t,
      config: r,
      cache_dir: n,
      local_files_only: s,
      revision: a,
      model_file_name: o,
      subfolder: i,
      device: l,
      dtype: c,
      use_external_data_format: d,
      session_options: h
    }, p = En.get(this);
    r = _.config = await hs.from_pretrained(e, _);
    let { typeConfig: w, textOnly: v, modelType: y } = Ep(p, r);
    if (y === void 0) {
      let E = p ?? r?.model_type;
      E !== "custom" && le.warn(
        `Model type for '${E}' not found, assuming encoder-only architecture. Please report this at ${Ca}.`
      );
    }
    if (t && !(t instanceof ca)) {
      let E = {};
      try {
        let C = await Eg(e, {
          config: r,
          dtype: c,
          device: l,
          model_file_name: o
        });
        (await Promise.all(
          C.map((M) => ms(e, M, _))
        )).forEach((M, $) => {
          if (M.exists) {
            let R = C[$] === "config.json";
            E[C[$]] = {
              loaded: R ? M.size ?? 0 : 0,
              total: M.size ?? 0
            };
          }
        });
      } catch (C) {
        le.warn(`Unable to fetch model file metadata for total progress tracking: ${C}`);
      }
      Object.keys(E).length > 0 && (_.progress_callback = new ca(t, E));
    }
    let b = w.sessions(r, _, v), k = [
      yC(e, b, _, w.cache_sessions)
    ];
    w.optional_configs && k.push(KC(e, w.optional_configs, _));
    let A = await Promise.all(k);
    return new this(r, ...A);
  }
  /**
   * Runs the model with the provided inputs.
   * @param {Object} model_inputs Object containing input tensors.
   * @returns {Promise<Object>} Object containing output tensors.
   */
  async _call(e) {
    return await this.forward(e);
  }
  /**
   * Run the model's forward pass.
   * @param {Object} model_inputs The input data to the model in the format specified in the ONNX model.
   * @returns {Promise<Object>} The output data from the model in the format specified in the ONNX model.
   */
  async forward(e) {
    return await this._forward(this, e);
  }
  /**
   * Get the model's generation config, if it exists.
   * @returns {GenerationConfig|null} The model's generation config if it exists, otherwise `null`.
   */
  get generation_config() {
    return this.configs?.generation_config ?? null;
  }
  /**
   * @param {GenerationConfig} generation_config
   * @param {number} input_ids_seq_length The starting sequence length for the input ids.
   * @returns {LogitsProcessorList}
   * @private
   */
  _get_logits_processor(e, t, r = null) {
    let n = new ji();
    if (e.repetition_penalty !== null && e.repetition_penalty !== 1 && n.push(new FC(e.repetition_penalty)), e.no_repeat_ngram_size !== null && e.no_repeat_ngram_size > 0 && n.push(new PC(e.no_repeat_ngram_size)), e.bad_words_ids !== null && n.push(
      new OC(e.bad_words_ids, e.eos_token_id)
    ), e.min_length !== null && e.eos_token_id !== null && e.min_length > 0 && n.push(new IC(e.min_length, e.eos_token_id)), e.min_new_tokens !== null && e.eos_token_id !== null && e.min_new_tokens > 0 && n.push(
      new LC(
        t,
        e.min_new_tokens,
        e.eos_token_id
      )
    ), e.forced_bos_token_id !== null && n.push(new EC(e.forced_bos_token_id)), e.forced_eos_token_id !== null && n.push(
      new AC(e.max_length, e.forced_eos_token_id)
    ), e.suppress_tokens !== null && n.push(new CC(e.suppress_tokens)), e.begin_suppress_tokens !== null) {
      let s = t > 1 || e.forced_bos_token_id === null ? t : t + 1;
      n.push(
        new yg(e.begin_suppress_tokens, s)
      );
    }
    return e.guidance_scale !== null && e.guidance_scale > 1 && n.push(new NC(e.guidance_scale)), e.temperature === 0 && e.do_sample && (le.warn(
      "`do_sample` changed to false because `temperature: 0` implies greedy sampling (always selecting the most likely token), which is incompatible with `do_sample: true`."
    ), e.do_sample = !1), e.do_sample && e.temperature !== null && e.temperature !== 1 && n.push(new DC(e.temperature)), r !== null && n.extend(r), n;
  }
  /**
   * This function merges multiple generation configs together to form a final generation config to be used by the model for text generation.
   * It first creates an empty `GenerationConfig` object, then it applies the model's own `generation_config` property to it. Finally, if a `generation_config` object was passed in the arguments, it overwrites the corresponding properties in the final config with those of the passed config object.
   * @param {GenerationConfig|null} generation_config A `GenerationConfig` object containing generation parameters.
   * @param {Object} kwargs Additional generation parameters to be used in place of those in the `generation_config` object.
   * @returns {GenerationConfig} The final generation config object to be used by the model for text generation.
   */
  _prepare_generation_config(e, t, r = bg) {
    let n = { ...this.config };
    for (let a of ["decoder", "generator", "text_config"])
      a in n && Object.assign(n, n[a]);
    let s = new r(n);
    return Object.assign(s, this.generation_config ?? {}), e && Object.assign(s, e), t && Object.assign(s, et(t, Object.getOwnPropertyNames(s))), s;
  }
  /**
   *
   * @param {GenerationConfig} generation_config
   * @param {import('../generation/stopping_criteria.js').StoppingCriteria|import('../generation/stopping_criteria.js').StoppingCriteria[]|StoppingCriteriaList} [stopping_criteria=null]
   */
  _get_stopping_criteria(e, t = null) {
    let r = new Mg();
    return e.max_length !== null && r.push(
      new zC(e.max_length, this.config.max_position_embeddings ?? null)
    ), e.eos_token_id !== null && r.push(new BC(e.eos_token_id)), t && r.extend(t), r;
  }
  /**
   * Confirms that the model class is compatible with generation.
   * If not, raises an exception that points to the right class to use.
   */
  _validate_model_class() {
    if (!this.can_generate) {
      let e = [
        yn.MODEL_FOR_CAUSAL_LM_MAPPING_NAMES,
        // MODEL_MAPPING_NAMES.MODEL_FOR_CAUSAL_IMAGE_MODELING_MAPPING, // TODO
        yn.MODEL_FOR_VISION_2_SEQ_MAPPING_NAMES,
        yn.MODEL_FOR_SEQ_TO_SEQ_CAUSAL_LM_MAPPING_NAMES,
        yn.MODEL_FOR_SPEECH_SEQ_2_SEQ_MAPPING_NAMES
      ].filter(Boolean), t = En.get(this.constructor), r = /* @__PURE__ */ new Set(), n = this.config.model_type;
      for (let a of e) {
        let o = a?.get(n);
        o && r.add(o);
      }
      let s = `The current model class (${t}) is not compatible with \`.generate()\`, as it doesn't have a language model head.`;
      throw r.size > 0 && (s += ` Please use the following class instead: ${[...r].join(", ")}`), Error(s);
    }
  }
  prepare_inputs_for_generation(...e) {
    if (!this._prepare_inputs_for_generation)
      throw new Error("prepare_inputs_for_generation is not implemented for this model.");
    return this._prepare_inputs_for_generation(this, ...e);
  }
  /**
   *
   * @param {Object} inputs
   * @param {bigint[][]} inputs.generated_input_ids
   * @param {Object} inputs.outputs
   * @param {Object} inputs.model_inputs
   * @param {boolean} inputs.is_encoder_decoder
   * @returns {Object} The updated model inputs for the next generation iteration.
   */
  _update_model_kwargs_for_generation({ generated_input_ids: e, outputs: t, model_inputs: r, is_encoder_decoder: n }) {
    return r.past_key_values = qi(t, r.past_key_values), r.input_ids = new V("int64", e.flat(), [e.length, 1]), n ? "decoder_attention_mask" in r && (r.decoder_attention_mask = De(
      [r.decoder_attention_mask, gt([r.decoder_attention_mask.dims[0], 1])],
      1
    )) : r.attention_mask = De(
      [r.attention_mask, gt([r.attention_mask.dims[0], 1])],
      1
    ), r.position_ids = null, r;
  }
  /**
   * This function extracts the model-specific `inputs` for generation.
   * @param {Object} params
   * @param {Tensor} [params.inputs=null]
   * @param {number} [params.bos_token_id=null]
   * @param {Record<string, Tensor|number[]>} [params.model_kwargs]
   * @returns {{inputs_tensor: Tensor, model_inputs: Record<string, Tensor> & {past_key_values?: DynamicCache}, model_input_name: string}} The model-specific inputs for generation.
   */
  _prepare_model_inputs({ inputs: e, bos_token_id: t, model_kwargs: r }) {
    let n = et(r, this.forward_params), s = this.main_input_name;
    if (s in n) {
      if (e)
        throw new Error(
          "`inputs`: {inputs}` were passed alongside {input_name} which is not allowed. Make sure to either pass {inputs} or {input_name}=..."
        );
    } else
      n[s] = e;
    return { inputs_tensor: n[s], model_inputs: n, model_input_name: s };
  }
  async _prepare_encoder_decoder_kwargs_for_generation({
    inputs_tensor: e,
    model_inputs: t,
    model_input_name: r,
    generation_config: n
  }) {
    if (this.sessions.model.inputNames.includes("inputs_embeds") && !t.inputs_embeds && "_prepare_inputs_embeds" in this) {
      let { input_ids: a, pixel_values: o, attention_mask: i, ...l } = t, c = await this._prepare_inputs_embeds(t);
      t = {
        ...l,
        ...et(c, ["inputs_embeds", "attention_mask"])
      };
    }
    let { last_hidden_state: s } = await Ir(this, t);
    if (n.guidance_scale !== null && n.guidance_scale > 1)
      s = De([s, Ri(s, 0)], 0), "attention_mask" in t && (t.attention_mask = De(
        [t.attention_mask, ul(t.attention_mask)],
        0
      ));
    else if (t.decoder_input_ids) {
      let a = Wi(t.decoder_input_ids).dims[0];
      if (a !== s.dims[0]) {
        if (s.dims[0] !== 1)
          throw new Error(
            `The encoder outputs have a different batch size (${s.dims[0]}) than the decoder inputs (${a}).`
          );
        s = De(
          Array.from({ length: a }, () => s),
          0
        );
      }
    }
    return t.encoder_outputs = s, t;
  }
  /**
   * Prepares `decoder_input_ids` for generation with encoder-decoder models
   * @param {*} param0
   */
  _prepare_decoder_input_ids_for_generation({
    batch_size: e,
    model_input_name: t,
    model_kwargs: r,
    decoder_start_token_id: n,
    bos_token_id: s,
    generation_config: a
  }) {
    let { decoder_input_ids: o, ...i } = r;
    if (!(o instanceof V)) {
      if (o)
        Array.isArray(o[0]) || (o = Array.from(
          {
            length: e
          },
          () => o
        ));
      else if (n ??= s, this.config.model_type === "musicgen")
        o = Array.from(
          {
            // @ts-expect-error TS2339
            length: e * this.config.decoder.num_codebooks
          },
          () => [n]
        );
      else if (Array.isArray(n)) {
        if (n.length !== e)
          throw new Error(
            `\`decoder_start_token_id\` expected to have length ${e} but got ${n.length}`
          );
        o = n;
      } else
        o = Array.from(
          {
            length: e
          },
          () => [n]
        );
      o = Wi(o);
    }
    return i.decoder_attention_mask = cl(o), { input_ids: o, model_inputs: i };
  }
  /**
   * Generate token sequences with a language-modeling head.
   * @param {import('../generation/parameters.js').GenerationFunctionParameters} options
   * @returns {Promise<ModelOutput|Tensor>} The output of the model, which can contain the generated token ids, attentions, and scores.
   */
  async generate({
    inputs: e = null,
    generation_config: t = null,
    logits_processor: r = null,
    stopping_criteria: n = null,
    streamer: s = null,
    // inputs_attention_mask = null,
    ...a
  }) {
    this._validate_model_class(), t = this._prepare_generation_config(t, a);
    let { inputs_tensor: o, model_inputs: i, model_input_name: l } = this._prepare_model_inputs({
      inputs: e,
      model_kwargs: (
        /** @type {Record<string, Tensor|number[]>} */
        a
      )
    }), c = this.config.is_encoder_decoder;
    c && ("encoder_outputs" in i || (i = await this._prepare_encoder_decoder_kwargs_for_generation({
      inputs_tensor: o,
      model_inputs: i,
      model_input_name: l,
      generation_config: t
    })));
    let d;
    c ? { input_ids: d, model_inputs: i } = this._prepare_decoder_input_ids_for_generation({
      batch_size: i[l].dims.at(0),
      model_input_name: l,
      model_kwargs: i,
      decoder_start_token_id: t.decoder_start_token_id,
      bos_token_id: t.bos_token_id,
      generation_config: t
    }) : d = i[l];
    let h = d.dims.at(-1);
    t.max_new_tokens !== null && (t.max_length = h + t.max_new_tokens);
    let _ = this._get_logits_processor(
      t,
      h,
      r
    ), p = this._get_stopping_criteria(t, n), w = i[l].dims.at(0), v = Ia.getSampler(t), y = new Array(w).fill(0), b = d.tolist();
    s && s.put(b);
    let k, A = {}, E = {};
    for (; ; ) {
      if (i = this.prepare_inputs_for_generation(b, i, t), k = await this.forward(i), t.return_dict_in_generate)
        if (t.output_attentions) {
          let q = HC(k);
          for (let B in q)
            B in A || (A[B] = []), A[B].push(q[B]);
        } else this._return_dict_in_generate_keys && Object.assign(E, et(k, this._return_dict_in_generate_keys));
      let R = k.logits.slice(null, -1, null).to("float32"), W = _(b, R), Q = [];
      for (let q = 0; q < W.dims.at(0); ++q) {
        let B = W[q], P = await v(B);
        for (let [X, ce] of P) {
          let J = BigInt(X);
          y[q] += ce, b[q].push(J), Q.push([J]);
          break;
        }
      }
      if (s && s.put(Q), p(b).every((q) => q))
        break;
      i = this._update_model_kwargs_for_generation({
        generated_input_ids: Q,
        outputs: k,
        model_inputs: i,
        is_encoder_decoder: c
      });
    }
    s && s.end();
    let C = new V("int64", b.flat(), [b.length, b[0].length]), N = qi(k, i.past_key_values), M = new Set(Object.values(N));
    for (let R of Object.values(k))
      R.location === "gpu-buffer" && !M.has(R) && R.dispose();
    return "past_key_values" in a || t.return_dict_in_generate || await N.dispose(), t.return_dict_in_generate ? {
      sequences: C,
      past_key_values: N,
      ...A,
      ...E
      // TODO:
      // scores,
      // logits,
    } : C;
  }
  /**
   * Helper function to select valid inputs and run through the appropriate encoder (vision, text, audio) based on the input type.
   * @param {string} sessionName
   * @param {Record<string, Tensor>} inputs
   * @param {string} outputName
   * @private
   */
  async _encode_input(e, t, r) {
    if (!Object.hasOwn(this.sessions, e))
      throw new Error(`Model does not have a ${e} session.`);
    let n = this.sessions[e];
    return (await ve(n, et(t, n.inputNames)))[r];
  }
  /**
   * Encode image inputs into features for multimodal generation.
   * @param {any} inputs Vision encoder inputs.
   * @returns {Promise<any>} Image features.
   * @internal
   */
  async encode_image(e) {
    return this._encode_input("vision_encoder", e, "image_features");
  }
  /**
   * Encode token ids into embeddings for multimodal generation.
   * @param {any} inputs Text encoder inputs.
   * @returns {Promise<any>} Text embeddings.
   * @internal
   */
  async encode_text(e) {
    return this._encode_input("embed_tokens", e, "inputs_embeds");
  }
  /**
   * Encode audio inputs into features for multimodal generation.
   * @param {any} inputs Audio encoder inputs.
   * @returns {Promise<any>} Audio features.
   * @internal
   */
  async encode_audio(e) {
    return this._encode_input("audio_encoder", e, "audio_features");
  }
};
async function ra(e, t) {
  let { encoder_outputs: r, input_ids: n, decoder_input_ids: s, decoder_attention_mask: a, ...o } = t;
  if (!r) {
    let i = et(t, e.sessions.model.inputNames);
    r = (await Ir(e, i)).last_hidden_state;
  }
  return o.input_ids = s, o.encoder_hidden_states = r, e.sessions.decoder_model_merged.inputNames.includes("encoder_attention_mask") && (o.encoder_attention_mask = t.attention_mask), a && !o.attention_mask && (o.attention_mask = a), await _r(e, o, !0);
}
async function Ir(e, t) {
  let r = e.sessions.model, n = et(t, r.inputNames);
  if (r.inputNames.includes("inputs_embeds") && !n.inputs_embeds) {
    if (!t.input_ids)
      throw new Error("Both `input_ids` and `inputs_embeds` are missing in the model inputs.");
    n.inputs_embeds = await e.encode_text({ input_ids: t.input_ids });
  }
  if (r.inputNames.includes("token_type_ids") && !n.token_type_ids) {
    if (!n.input_ids)
      throw new Error("Both `input_ids` and `token_type_ids` are missing in the model inputs.");
    n.token_type_ids = ul(n.input_ids);
  }
  if (r.inputNames.includes("pixel_mask") && !n.pixel_mask) {
    if (!n.pixel_values)
      throw new Error("Both `pixel_values` and `pixel_mask` are missing in the model inputs.");
    let s = n.pixel_values.dims;
    n.pixel_mask = gt([s[0], s[2], s[3]]);
  }
  return await ve(r, n);
}
async function qC(e, t) {
  let r = await e.encode(t);
  return await e.decode(r);
}
function qi(e, t) {
  let r = /* @__PURE__ */ Object.create(null);
  for (let n in e)
    if (n.startsWith("present")) {
      let s = n.replace("present_ssm", "past_ssm").replace("present_conv", "past_conv").replace("present_recurrent", "past_recurrent").replace("present_compressor", "past_compressor").replace("present_indexer", "past_indexer").replace("present", "past_key_values");
      n.includes("encoder") && t ? r[s] = t[s] : r[s] = e[n];
    }
  return t ? (t.update(r), t) : new yl(r);
}
function HC(e) {
  let t = {};
  for (let r of ["cross_attentions", "encoder_attentions", "decoder_attentions"])
    for (let n in e)
      n.startsWith(r) && (r in t || (t[r] = []), t[r].push(e[n]));
  return t;
}
function Cg(e, t) {
  return e.map((r) => typeof r == "number" ? r : t[r] ?? 0);
}
function Ml(e, t, r) {
  if (r && Object.keys(r).length > 0)
    return Object.assign(t, r), r;
  let n = e.sessions.decoder_model_merged ?? e.sessions.model, s = (t[e.main_input_name] ?? t.attention_mask)?.dims?.[0] ?? 1, a = Pa(e.config), o = e.config?.normalized_config?.num_heads, i = { batch_size: s };
  typeof o == "number" && (i["batch_size x num_heads"] = s * o);
  let l = /* @__PURE__ */ Object.create(null);
  for (let c of n.inputMetadata) {
    if (!a.has(c.name)) continue;
    let d = Cg(c.shape, i), h = d.reduce((w, v) => w * v, 1), _ = us[c.type], p = new V(c.type, new _(h), d);
    t[c.name] = p, l[c.name] = p;
  }
  return r ? (r.update(l), r) : new yl(l);
}
function gs(e, t, r) {
  if (t.num_logits_to_keep) return;
  (e.sessions.decoder_model_merged ?? e.sessions.model)?.inputNames.includes("num_logits_to_keep") && (t.num_logits_to_keep = new V("int64", [r], []));
}
async function _r(e, t, r = !1) {
  let n = e.sessions[r ? "decoder_model_merged" : "model"], { past_key_values: s, ...a } = t;
  if (n.inputNames.includes("use_cache_branch") && (a.use_cache_branch = Ag(
    s != null && Object.keys(s).length > 0
  )), n.inputNames.includes("position_ids") && a.attention_mask && !a.position_ids) {
    let i = ["paligemma", "gemma3_text", "gemma3"].includes(e.config.model_type) ? 1 : 0;
    a.position_ids = YC(a, s, i);
  }
  gs(e, a, 0n), Ml(e, a, s);
  let o = et(a, n.inputNames);
  return await ve(n, o);
}
async function Sg(e, {
  // Generic parameters:
  encode_function: t,
  merge_function: r,
  modality_input_names: n,
  modality_output_name: s,
  // Produced by the tokenizer/processor:
  input_ids: a = null,
  attention_mask: o = null,
  // Used during generation:
  position_ids: i = null,
  inputs_embeds: l = null,
  past_key_values: c = null,
  // Generic generation parameters
  generation_config: d = null,
  logits_processor: h = null,
  num_logits_to_keep: _ = null,
  // Additional parameters
  ...p
}) {
  if (!l) {
    l = await e.encode_text({ input_ids: a, ...p });
    let v = et(p, n);
    if (Object.keys(v).length > 0) {
      if (a.dims[1] !== 1) {
        let y = await t({
          // Pass the modality values under its expected key.
          // The caller knows whether this is audio or image.
          ...v,
          ...p
        });
        ({ inputs_embeds: l, attention_mask: o } = r({
          [s]: y,
          inputs_embeds: l,
          input_ids: a,
          attention_mask: o
        }));
      } else if (c && a.dims[1] === 1) {
        let y = a.dims[1], b = c.get_seq_length();
        o = De(
          [
            gt([a.dims[0], b]),
            o.slice(null, [o.dims[1] - y, o.dims[1]])
          ],
          1
        );
      }
    }
  }
  if (!i && // Handle special case for qwen vl models
  [
    "qwen2_vl",
    "qwen2_vl_text",
    "qwen2_5_vl",
    "qwen2_5_vl_text",
    "qwen3_vl",
    "qwen3_vl_text",
    "qwen3_vl_moe",
    "qwen3_vl_moe_text",
    "qwen3_5",
    "qwen3_5_text",
    "qwen3_5_moe",
    "qwen3_5_moe_text",
    "glm_ocr",
    "glm_ocr_text"
  ].includes(e.config.model_type)) {
    let { image_grid_thw: v, video_grid_thw: y } = p;
    [i] = e.get_rope_index(a, v, y, o);
  }
  return await _r(
    e,
    {
      inputs_embeds: l,
      past_key_values: c,
      attention_mask: o,
      position_ids: i,
      generation_config: d,
      logits_processor: h,
      num_logits_to_keep: _
    },
    !0
  );
}
async function QC(e, t) {
  return await Sg(e, {
    ...t,
    modality_input_names: ["audio_values", "input_features"],
    modality_output_name: "audio_features",
    encode_function: e.encode_audio.bind(e),
    merge_function: e._merge_input_ids_with_audio_features.bind(e)
  });
}
async function XC(e, t) {
  return await Sg(e, {
    ...t,
    modality_input_names: ["pixel_values"],
    modality_output_name: "image_features",
    encode_function: e.encode_image.bind(e),
    merge_function: e._merge_input_ids_with_image_features.bind(e)
  });
}
function Pg(e, t = 0) {
  let [r, n] = e.dims, s = e.data, a = new BigInt64Array(s.length);
  for (let o = 0; o < r; ++o) {
    let i = o * n, l = BigInt(t);
    for (let c = 0; c < n; ++c) {
      let d = i + c;
      s[d] === 0n ? a[d] = BigInt(1) : (a[d] = l, l += s[d]);
    }
  }
  return { data: a, dims: e.dims };
}
function YC(e, t = null, r = 0) {
  let { input_ids: n, inputs_embeds: s, attention_mask: a } = e, { data: o, dims: i } = Pg(a, r), l = new V("int64", o, i);
  if (t) {
    let c = -(n ?? s).dims.at(1);
    l = l.slice(null, [c, null]);
  }
  return l;
}
function An(e, t, r, n) {
  let s = r.past_key_values ? r.past_key_values.get_seq_length() : 0;
  if (gs(e, r, 1n), !r.attention_mask) {
    let a;
    for (let o of ["input_ids", "inputs_embeds", "position_ids"])
      if (r[o]) {
        a = r[o].dims;
        break;
      }
    if (!a)
      throw new Error("attention_mask is not provided, and unable to infer its shape from model inputs.");
    r.attention_mask = gt([a[0], s + a[1]]);
  }
  if (r.past_key_values) {
    let { input_ids: a, attention_mask: o } = r;
    o && o.dims[1] > a.dims[1] || s < a.dims[1] && (r.input_ids = a.slice(null, [s, null]));
  }
  return r;
}
function ba(e, t, r, n) {
  return r.past_key_values && (t = t.map((s) => [s.at(-1)])), gs(e, r, 1n), {
    ...r,
    decoder_input_ids: Wi(t)
  };
}
function na(e, ...t) {
  return e.config.is_encoder_decoder ? ba(e, ...t) : An(e, ...t);
}
function Fg({
  modality_token_id: e,
  inputs_embeds: t,
  modality_features: r,
  input_ids: n,
  attention_mask: s
}) {
  let a = n.tolist().map(
    (c) => c.reduce((d, h, _) => (h == e && d.push(_), d), [])
  ), o = a.reduce((c, d) => c + d.length, 0), i = r.dims[0];
  if (o !== i)
    throw new Error(`Number of tokens and features do not match: tokens: ${o}, features ${i}`);
  let l = 0;
  for (let c = 0; c < a.length; ++c) {
    let d = a[c], h = t[c];
    for (let _ = 0; _ < d.length; ++_)
      h[d[_]].data.set(r[l++].data);
  }
  return { inputs_embeds: t, attention_mask: s };
}
function xl({
  image_token_id: e,
  inputs_embeds: t,
  image_features: r,
  input_ids: n,
  attention_mask: s
}) {
  return Fg({
    modality_token_id: e,
    inputs_embeds: t,
    modality_features: r,
    input_ids: n,
    attention_mask: s
  });
}
function Ig({
  audio_token_id: e,
  inputs_embeds: t,
  audio_features: r,
  input_ids: n,
  attention_mask: s
}) {
  return Fg({
    modality_token_id: e,
    inputs_embeds: t,
    modality_features: r,
    input_ids: n,
    attention_mask: s
  });
}
async function KC(e, t, r) {
  return Object.fromEntries(
    await Promise.all(
      Object.keys(t).map(async (n) => {
        let s = await sr(e, t[n], !1, r);
        return [n, s];
      })
    )
  );
}
var kl = {};
fs(kl, {
  ASTForAudioClassification: () => cS,
  ASTModel: () => lS,
  ASTPreTrainedModel: () => Cl,
  AfmoeForCausalLM: () => aS,
  AfmoeModel: () => sS,
  AfmoePreTrainedModel: () => El,
  AlbertForMaskedLM: () => tS,
  AlbertForQuestionAnswering: () => eS,
  AlbertForSequenceClassification: () => ZC,
  AlbertModel: () => JC,
  AlbertPreTrainedModel: () => ws,
  ApertusForCausalLM: () => nS,
  ApertusModel: () => rS,
  ApertusPreTrainedModel: () => Tl,
  ArceeForCausalLM: () => iS,
  ArceeModel: () => oS,
  ArceePreTrainedModel: () => Al,
  BartForConditionalGeneration: () => dS,
  BartForSequenceClassification: () => hS,
  BartModel: () => uS,
  BartPretrainedModel: () => La,
  BaseModelOutput: () => MC,
  BeitForImageClassification: () => _S,
  BeitModel: () => fS,
  BeitPreTrainedModel: () => Sl,
  BertForMaskedLM: () => mS,
  BertForQuestionAnswering: () => vS,
  BertForSequenceClassification: () => gS,
  BertForTokenClassification: () => wS,
  BertModel: () => pS,
  BertPreTrainedModel: () => Fn,
  BlenderbotForConditionalGeneration: () => bS,
  BlenderbotModel: () => yS,
  BlenderbotPreTrainedModel: () => Pl,
  BlenderbotSmallForConditionalGeneration: () => xS,
  BlenderbotSmallModel: () => MS,
  BlenderbotSmallPreTrainedModel: () => Fl,
  BloomForCausalLM: () => TS,
  BloomModel: () => kS,
  BloomPreTrainedModel: () => Il,
  CHMv2ForDepthEstimation: () => LS,
  CHMv2PreTrainedModel: () => Dg,
  CLIPModel: () => NS,
  CLIPPreTrainedModel: () => nn,
  CLIPSegForImageSegmentation: () => $S,
  CLIPSegModel: () => RS,
  CLIPSegPreTrainedModel: () => Ll,
  CLIPTextModel: () => DS,
  CLIPTextModelWithProjection: () => Rg,
  CLIPVisionModel: () => zS,
  CLIPVisionModelWithProjection: () => BS,
  CamembertForMaskedLM: () => AS,
  CamembertForQuestionAnswering: () => PS,
  CamembertForSequenceClassification: () => CS,
  CamembertForTokenClassification: () => SS,
  CamembertModel: () => ES,
  CamembertPreTrainedModel: () => In,
  CausalLMOutput: () => Lr,
  CausalLMOutputWithPast: () => xC,
  ChatterboxModel: () => Og,
  ChatterboxPreTrainedModel: () => Lg,
  ChineseCLIPModel: () => IS,
  ChineseCLIPPreTrainedModel: () => Ng,
  ClapAudioModelWithProjection: () => Bg,
  ClapModel: () => OS,
  ClapPreTrainedModel: () => Oa,
  ClapTextModelWithProjection: () => zg,
  CodeGenForCausalLM: () => VS,
  CodeGenModel: () => GS,
  CodeGenPreTrainedModel: () => Ol,
  Cohere2ForCausalLM: () => qS,
  Cohere2Model: () => WS,
  Cohere2PreTrainedModel: () => Dl,
  CohereAsrForConditionalGeneration: () => QS,
  CohereAsrModel: () => HS,
  CohereAsrPreTrainedModel: () => zl,
  CohereForCausalLM: () => jS,
  CohereModel: () => US,
  CoherePreTrainedModel: () => Nl,
  ConvBertForMaskedLM: () => YS,
  ConvBertForQuestionAnswering: () => ZS,
  ConvBertForSequenceClassification: () => KS,
  ConvBertForTokenClassification: () => JS,
  ConvBertModel: () => XS,
  ConvBertPreTrainedModel: () => Ln,
  ConvNextForImageClassification: () => tP,
  ConvNextModel: () => eP,
  ConvNextPreTrainedModel: () => Bl,
  \u0043onvNextV2ForImageClassification: () => nP,
  ConvNextV2Model: () => rP,
  ConvNextV2PreTrainedModel: () => Rl,
  DFineForObjectDetection: () => iP,
  DFineModel: () => oP,
  DFinePreTrainedModel: () => Gl,
  DINOv3ConvNextModel: () => NP,
  DINOv3ConvNextPreTrainedModel: () => Qg,
  DINOv3ViTModel: () => DP,
  DINOv3ViTPreTrainedModel: () => Xg,
  DPTForDepthEstimation: () => jP,
  DPTModel: () => UP,
  DPTPreTrainedModel: () => Ql,
  DacDecoderModel: () => Ug,
  DacDecoderOutput: () => Gg,
  DacEncoderModel: () => Vg,
  DacEncoderOutput: () => $g,
  DacModel: () => lP,
  DacPreTrainedModel: () => Na,
  DebertaForMaskedLM: () => uP,
  DebertaForQuestionAnswering: () => fP,
  \u0044ebertaForSequenceClassification: () => dP,
  DebertaForTokenClassification: () => hP,
  DebertaModel: () => cP,
  DebertaPreTrainedModel: () => On,
  DebertaV2ForMaskedLM: () => vP,
  DebertaV2ForQuestionAnswering: () => MP,
  DebertaV2ForSequenceClassification: () => yP,
  DebertaV2ForTokenClassification: () => bP,
  DebertaV2Model: () => wP,
  DebertaV2PreTrainedModel: () => Nn,
  DecisionTransformerModel: () => xP,
  DecisionTransformerPreTrainedModel: () => jg,
  DeepseekV3ForCausalLM: () => pP,
  DeepseekV3Model: () => _P,
  DeepseekV3PreTrainedModel: () => Vl,
  DeepseekV4ForCausalLM: () => gP,
  DeepseekV4Model: () => mP,
  DeepseekV4PreTrainedModel: () => Ul,
  DeiTForImageClassification: () => TP,
  DeiTModel: () => kP,
  DeiTPreTrainedModel: () => jl,
  DepthAnythingForDepthEstimation: () => EP,
  DepthAnythingPreTrainedModel: () => Wg,
  DepthProForDepthEstimation: () => AP,
  DepthProPreTrainedModel: () => qg,
  DetrForObjectDetection: () => SP,
  DetrForSegmentation: () => PP,
  DetrModel: () => CP,
  DetrObjectDetectionOutput: () => Wl,
  DetrPreTrainedModel: () => Da,
  DetrSegmentationOutput: () => Hg,
  Dinov2ForImageClassification: () => IP,
  Dinov2Model: () => FP,
  Dinov2PreTrainedModel: () => ql,
  Dinov2WithRegistersForImageClassification: () => OP,
  Dinov2WithRegistersModel: () => LP,
  Dinov2WithRegistersPreTrainedModel: () => Hl,
  DistilBertForMaskedLM: () => GP,
  DistilBertForQuestionAnswering: () => $P,
  DistilBertForSequenceClassification: () => BP,
  \u0044istilBertForTokenClassification: () => RP,
  DistilBertModel: () => zP,
  DistilBertPreTrainedModel: () => Dn,
  DonutSwinModel: () => VP,
  DonutSwinPreTrainedModel: () => Yg,
  EdgeTamModel: () => lN,
  EfficientNetForImageClassification: () => qP,
  EfficientNetModel: () => WP,
  EfficientNetPreTrainedModel: () => Xl,
  ElectraForMaskedLM: () => QP,
  ElectraForQuestionAnswering: () => KP,
  \u0045lectraForSequenceClassification: () => XP,
  ElectraForTokenClassification: () => YP,
  ElectraModel: () => HP,
  ElectraPreTrainedModel: () => zn,
  EmbeddingGemma2Model: () => Jg,
  EmbeddingGemma2PreTrainedModel: () => Kg,
  Ernie4_5ForCausalLM: () => ZP,
  Ernie4_5Model: () => JP,
  Ernie4_5PretrainedModel: () => Yl,
  EsmForMaskedLM: () => tF,
  EsmForSequenceClassification: () => rF,
  EsmForTokenClassification: () => nF,
  EsmModel: () => eF,
  EsmPreTrainedModel: () => ys,
  EuroBertForMaskedLM: () => aF,
  EuroBertForSequenceClassification: () => oF,
  EuroBertForTokenClassification: () => iF,
  EuroBertModel: () => sF,
  EuroBertPreTrainedModel: () => bs,
  ExaoneForCausalLM: () => cF,
  ExaoneModel: () => lF,
  ExaonePreTrainedModel: () => Kl,
  FalconForCausalLM: () => dF,
  FalconH1ForCausalLM: () => fF,
  FalconH1Model: () => hF,
  FalconH1PreTrainedModel: () => Zl,
  FalconModel: () => uF,
  FalconPreTrainedModel: () => Jl,
  FastViTForImageClassification: () => pF,
  FastViTModel: () => _F,
  FastViTPreTrainedModel: () => ec,
  Florence2ForConditionalGeneration: () => mF,
  Florence2PreTrainedModel: () => Zg,
  GLPNForDepthEstimation: () => LF,
  GLPNModel: () => IF,
  GLPNPreTrainedModel: () => lc,
  GPT2LMHeadModel: () => UF,
  GPT2Model: () => VF,
  GPT2PreTrainedModel: () => fc,
  GPTBigCodeForCausalLM: () => NF,
  GPTBigCodeModel: () => OF,
  GPTBigCodePreTrainedModel: () => cc,
  GPTJForCausalLM: () => WF,
  GPTJModel: () => jF,
  GPTJPreTrainedModel: () => _c,
  GPTNeoForCausalLM: () => zF,
  GPTNeoModel: () => DF,
  GPTNeoPreTrainedModel: () => uc,
  GPTNeoXForCausalLM: () => RF,
  GPTNeoXModel: () => BF,
  GPTNeoXPreTrainedModel: () => dc,
  Gemma2ForCausalLM: () => yF,
  Gemma2Model: () => vF,
  Gemma2PreTrainedModel: () => rc,
  Gemma3ForCausalLM: () => kF,
  Gemma3ForConditionalGeneration: () => rw,
  Gemma3Model: () => xF,
  Gemma3PreTrainedModel: () => tw,
  Gemma3nForCausalLM: () => TF,
  Gemma3nForConditionalGeneration: () => za,
  Gemma3nPreTrainedModel: () => nw,
  Gemma4ForCausalLM: () => EF,
  Gemma4ForConditionalGeneration: () => nc,
  GemmaForCausalLM: () => wF,
  GemmaModel: () => gF,
  GemmaPreTrainedModel: () => tc,
  GlmForCausalLM: () => CF,
  GlmModel: () => AF,
  GlmMoeDsaForCausalLM: () => PF,
  GlmMoeDsaModel: () => SF,
  GlmMoeDsaPreTrainedModel: () => ac,
  GlmOcrForConditionalGeneration: () => FF,
  GlmPreTrainedModel: () => sc,
  GptOssForCausalLM: () => GF,
  GptOssModel: () => $F,
  GptOssPreTrainedModel: () => hc,
  GraniteForCausalLM: () => HF,
  GraniteModel: () => qF,
  GraniteMoeHybridForCausalLM: () => XF,
  GraniteMoeHybridModel: () => QF,
  GraniteMoeHybridPreTrainedModel: () => mc,
  GranitePreTrainedModel: () => pc,
  GraniteSpeechForConditionalGeneration: () => YF,
  GroundingDinoForObjectDetection: () => KF,
  GroundingDinoPreTrainedModel: () => lw,
  GroupViTModel: () => JF,
  GroupViTPreTrainedModel: () => cw,
  HeliumForCausalLM: () => eI,
  HeliumModel: () => ZF,
  HeliumPreTrainedModel: () => wc,
  HieraForImageClassification: () => rI,
  HieraModel: () => tI,
  HieraPreTrainedModel: () => vc,
  HrmTextForCausalLM: () => sI,
  HrmTextModel: () => nI,
  HrmTextPreTrainedModel: () => yc,
  HubertForCTC: () => dI,
  HubertForSequenceClassification: () => hI,
  HubertModel: () => uI,
  HubertPreTrainedModel: () => cI,
  HunYuanDenseV1ForCausalLM: () => _I,
  HunYuanDenseV1Model: () => fI,
  HunYuanDenseV1PreTrainedModel: () => bc,
  IJepaForImageClassification: () => mI,
  IJepaModel: () => pI,
  IJepaPreTrainedModel: () => Mc,
  \u0049defics3ForConditionalGeneration: () => uw,
  ImageMattingOutput: () => vg,
  JAISLMHeadModel: () => wI,
  JAISModel: () => gI,
  JAISPreTrainedModel: () => xc,
  JinaCLIPModel: () => vI,
  JinaCLIPPreTrainedModel: () => Ba,
  JinaCLIPTextModel: () => dw,
  JinaCLIPVisionModel: () => yI,
  Lfm2ForCausalLM: () => MI,
  Lfm2Model: () => bI,
  Lfm2MoeForCausalLM: () => TI,
  Lfm2MoeModel: () => kI,
  Lfm2MoePreTrainedModel: () => Tc,
  Lfm2PreTrainedModel: () => kc,
  Lfm2VlForConditionalGeneration: () => EI,
  LightOnOcrForConditionalGeneration: () => xI,
  LiteWhisperForConditionalGeneration: () => SD,
  Llama4ForCausalLM: () => SI,
  Llama4PreTrainedModel: () => hw,
  LlamaForCausalLM: () => CI,
  LlamaModel: () => AI,
  LlamaPreTrainedModel: () => Ec,
  LlavaForConditionalGeneration: () => nr,
  LlavaOnevisionForConditionalGeneration: () => nr,
  LlavaPreTrainedModel: () => ew,
  LlavaQwen2ForCausalLM: () => MF,
  LongT5ForConditionalGeneration: () => FI,
  LongT5Model: () => PI,
  LongT5PreTrainedModel: () => Ac,
  M2M100ForConditionalGeneration: () => LI,
  M2M100Model: () => II,
  M2M100PreTrainedModel: () => Cc,
  MBartForCausalLM: () => GI,
  MBartForConditionalGeneration: () => RI,
  MBartForSequenceClassification: () => $I,
  MBartModel: () => BI,
  MBartPreTrainedModel: () => Ms,
  MPNetForMaskedLM: () => IL,
  MPNetForQuestionAnswering: () => NL,
  MPNetForSequenceClassification: () => LL,
  MPNetForTokenClassification: () => OL,
  MPNetModel: () => FL,
  MPNetPreTrainedModel: () => Bn,
  MT5ForConditionalGeneration: () => RL,
  MT5Model: () => BL,
  MT5PreTrainedModel: () => Gc,
  MarianMTModel: () => NI,
  MarianModel: () => OI,
  MarianPreTrainedModel: () => Sc,
  MaskFormerForInstanceSegmentation: () => zI,
  MaskFormerModel: () => DI,
  MaskFormerPreTrainedModel: () => Pc,
  MaskedLMOutput: () => Xe,
  Metric3DForDepthEstimation: () => VI,
  Metric3DPreTrainedModel: () => fw,
  Metric3Dv2ForDepthEstimation: () => UI,
  Metric3Dv2PreTrainedModel: () => _w,
  MgpstrForSceneTextRecognition: () => jI,
  MgpstrModelOutput: () => pw,
  MgpstrPreTrainedModel: () => mw,
  MimiDecoderModel: () => yw,
  MimiDecoderOutput: () => ww,
  MimiEncoderModel: () => vw,
  MimiEncoderOutput: () => gw,
  MimiModel: () => WI,
  MimiPreTrainedModel: () => Ra,
  Ministral3ForCausalLM: () => XI,
  Ministral3Model: () => QI,
  Ministral3PreTrainedModel: () => Ic,
  MinistralForCausalLM: () => HI,
  MinistralModel: () => qI,
  MinistralPreTrainedModel: () => Fc,
  \u004distral3ForConditionalGeneration: () => JI,
  Mistral4ForCausalLM: () => eL,
  Mistral4Model: () => ZI,
  Mistral4PreTrainedModel: () => Oc,
  MistralForCausalLM: () => KI,
  MistralModel: () => YI,
  MistralPreTrainedModel: () => Lc,
  MobileBertForMaskedLM: () => rL,
  MobileBertForQuestionAnswering: () => sL,
  MobileBertForSequenceClassification: () => nL,
  MobileBertModel: () => tL,
  MobileBertPreTrainedModel: () => xs,
  MobileLLMForCausalLM: () => oL,
  MobileLLMModel: () => aL,
  MobileLLMPreTrainedModel: () => Nc,
  MobileNetV1ForImageClassification: () => lL,
  MobileNetV1ForSemanticSegmentation: () => cL,
  MobileNetV1Model: () => iL,
  MobileNetV1PreTrainedModel: () => $a,
  MobileNetV2ForImageClassification: () => dL,
  MobileNetV2ForSemanticSegmentation: () => hL,
  MobileNetV2Model: () => uL,
  MobileNetV2PreTrainedModel: () => Ga,
  MobileNetV3ForImageClassification: () => _L,
  MobileNetV3ForSemanticSegmentation: () => pL,
  MobileNetV3Model: () => fL,
  MobileNetV3PreTrainedModel: () => Va,
  MobileNetV4ForImageClassification: () => gL,
  MobileNetV4ForSemanticSegmentation: () => wL,
  MobileNetV4Model: () => mL,
  MobileNetV4PreTrainedModel: () => Ua,
  MobileViTForImageClassification: () => yL,
  MobileViTModel: () => vL,
  MobileViTPreTrainedModel: () => Dc,
  MobileViTV2ForImageClassification: () => ML,
  MobileViTV2Model: () => bL,
  MobileViTV2PreTrainedModel: () => zc,
  ModelOutput: () => Ve,
  ModernBertDecoderForCausalLM: () => CL,
  ModernBertDecoderModel: () => AL,
  \u004dodernBertDecoderPreTrainedModel: () => Bc,
  ModernBertForMaskedLM: () => kL,
  ModernBertForSequenceClassification: () => TL,
  \u004dodernBertForTokenClassification: () => EL,
  ModernBertModel: () => xL,
  ModernBertPreTrainedModel: () => ks,
  Moondream1ForConditionalGeneration: () => bF,
  MoonshineForConditionalGeneration: () => PL,
  MoonshineModel: () => SL,
  MoonshinePreTrainedModel: () => Rc,
  MptForCausalLM: () => zL,
  MptModel: () => DL,
  MptPreTrainedModel: () => $c,
  MultiModalityCausalLM: () => $L,
  MultiModalityPreTrainedModel: () => bw,
  MusicgenForCausalLM: () => VL,
  \u004dusicgenForConditionalGeneration: () => Mw,
  MusicgenModel: () => GL,
  MusicgenPreTrainedModel: () => Vc,
  NanoChatForCausalLM: () => jL,
  NanoChatModel: () => UL,
  NanoChatPreTrainedModel: () => Uc,
  NemotronHForCausalLM: () => qL,
  NemotronHModel: () => WL,
  NemotronHPreTrainedModel: () => jc,
  NeoBertForMaskedLM: () => QL,
  NeoBertForQuestionAnswering: () => KL,
  \u004eeoBertForSequenceClassification: () => XL,
  NeoBertForTokenClassification: () => YL,
  NeoBertModel: () => HL,
  NeoBertPreTrainedModel: () => Rn,
  NomicBertModel: () => JL,
  NomicBertPreTrainedModel: () => xw,
  OPTForCausalLM: () => hO,
  OPTModel: () => dO,
  OPTPreTrainedModel: () => Kc,
  Olmo2ForCausalLM: () => rO,
  Olmo2Model: () => tO,
  Olmo2PreTrainedModel: () => qc,
  Olmo3ForCausalLM: () => sO,
  Olmo3Model: () => nO,
  Olmo3PreTrainedModel: () => Hc,
  OlmoForCausalLM: () => eO,
  OlmoHybridForCausalLM: () => oO,
  OlmoHybridModel: () => aO,
  OlmoHybridPreTrainedModel: () => Qc,
  OlmoModel: () => ZL,
  OlmoPreTrainedModel: () => Wc,
  OpenAIPrivacyFilterForTokenClassification: () => lO,
  OpenAIPrivacyFilterModel: () => iO,
  OpenAIPrivacyFilterPreTrainedModel: () => Xc,
  OpenELMForCausalLM: () => uO,
  OpenELMModel: () => cO,
  OpenELMPreTrainedModel: () => Yc,
  OwlViTForObjectDetection: () => mO,
  OwlViTModel: () => pO,
  OwlViTPreTrainedModel: () => Zc,
  Owlv2ForObjectDetection: () => _O,
  Owlv2Model: () => fO,
  Owlv2PreTrainedModel: () => Jc,
  PaliGemmaForConditionalGeneration: () => gO,
  ParakeetForCTC: () => wO,
  ParakeetPreTrainedModel: () => kw,
  PatchTSMixerForPrediction: () => yO,
  PatchTSMixerModel: () => vO,
  PatchTSMixerPreTrainedModel: () => eu,
  PatchTSTForPrediction: () => MO,
  PatchTSTModel: () => bO,
  PatchTSTPreTrainedModel: () => tu,
  Phi3ForCausalLM: () => EO,
  Phi3Model: () => TO,
  Phi3PreTrainedModel: () => nu,
  Phi3VForCausalLM: () => Ew,
  Phi3VPreTrainedModel: () => Tw,
  PhiForCausalLM: () => kO,
  PhiModel: () => xO,
  PhiPreTrainedModel: () => ru,
  PreTrainedModel: () => I,
  PvtForImageClassification: () => CO,
  PvtModel: () => AO,
  PvtPreTrainedModel: () => su,
  PyAnnoteForAudioFrameClassification: () => PO,
  PyAnnoteModel: () => SO,
  PyAnnotePreTrainedModel: () => au,
  QuestionAnsweringModelOutput: () => it,
  Qwen2ForCausalLM: () => IO,
  Qwen2Model: () => FO,
  Qwen2MoeForCausalLM: () => OO,
  Qwen2MoeModel: () => LO,
  Qwen2MoePreTrainedModel: () => iu,
  Qwen2PreTrainedModel: () => ou,
  Qwen2VLForCausalLM: () => aw,
  Qwen2VLForConditionalGeneration: () => oc,
  Qwen2VLPreTrainedModel: () => sw,
  Qwen2_5_VLForCausalLM: () => ow,
  Qwen2_5_VLForConditionalGeneration: () => ic,
  Qwen3ForCausalLM: () => DO,
  Qwen3Model: () => NO,
  Qwen3MoeForCausalLM: () => BO,
  Qwen3MoeModel: () => zO,
  Qwen3MoePreTrainedModel: () => cu,
  Qwen3NextForCausalLM: () => $O,
  Qwen3NextModel: () => RO,
  Qwen3NextPreTrainedModel: () => uu,
  Qwen3PreTrainedModel: () => lu,
  Qwen3VLForCausalLM: () => Aw,
  Qwen3VLForConditionalGeneration: () => du,
  Qwen3VLMoeForCausalLM: () => VO,
  Qwen3VLMoeForConditionalGeneration: () => GO,
  Qwen3_5ForCausalLM: () => Cw,
  Qwen3_5ForConditionalGeneration: () => hu,
  Qwen3_5MoeForCausalLM: () => jO,
  Qwen3_5MoeForConditionalGeneration: () => UO,
  RFDetrForObjectDetection: () => QO,
  RFDetrModel: () => HO,
  RFDetrObjectDetectionOutput: () => Sw,
  RFDetrPreTrainedModel: () => _u,
  RTDetrForObjectDetection: () => aP,
  RTDetrModel: () => sP,
  RTDetrObjectDetectionOutput: () => vs,
  RTDetrPreTrainedModel: () => $l,
  RTDetrV2ForObjectDetection: () => oN,
  RTDetrV2Model: () => aN,
  RTDetrV2ObjectDetectionOutput: () => Pw,
  RTDetrV2PreTrainedModel: () => pu,
  ResNetForImageClassification: () => qO,
  ResNetModel: () => WO,
  ResNetPreTrainedModel: () => fu,
  RoFormerForMaskedLM: () => tN,
  RoFormerForQuestionAnswering: () => sN,
  RoFormerForSequenceClassification: () => rN,
  RoFormerForTokenClassification: () => nN,
  RoFormerModel: () => eN,
  RoFormerPreTrainedModel: () => Gn,
  RobertaForMaskedLM: () => YO,
  RobertaForQuestionAnswering: () => ZO,
  \u0052obertaForSequenceClassification: () => KO,
  RobertaForTokenClassification: () => JO,
  RobertaModel: () => XO,
  RobertaPreTrainedModel: () => $n,
  Sam2ImageSegmentationOutput: () => Lw,
  Sam2Model: () => mu,
  Sam2PreTrainedModel: () => Ow,
  Sam3TrackerModel: () => cN,
  SamImageSegmentationOutput: () => Fw,
  SamModel: () => iN,
  SamPreTrainedModel: () => Iw,
  SapiensForDepthEstimation: () => dN,
  SapiensForNormalEstimation: () => hN,
  SapiensForSemanticSegmentation: () => uN,
  SapiensPreTrainedModel: () => ja,
  SegformerForImageClassification: () => _N,
  \u0053egformerForSemanticSegmentation: () => pN,
  SegformerModel: () => fN,
  SegformerPreTrainedModel: () => Wa,
  Seq2SeqLMOutput: () => kC,
  SequenceClassifierOutput: () => ae,
  SiglipModel: () => mN,
  SiglipPreTrainedModel: () => gu,
  SiglipTextModel: () => Nw,
  SiglipVisionModel: () => gN,
  SmolLM3ForCausalLM: () => vN,
  SmolLM3Model: () => wN,
  SmolLM3PreTrainedModel: () => wu,
  SmolVLMForConditionalGeneration: () => yN,
  SnacDecoderModel: () => zw,
  SnacEncoderModel: () => Dw,
  SnacModel: () => bN,
  SnacPreTrainedModel: () => qa,
  SolarOpenForCausalLM: () => xN,
  SolarOpenModel: () => MN,
  SolarOpenPreTrainedModel: () => vu,
  SpeechT5ForSpeechToText: () => TN,
  SpeechT5ForTextToSpeech: () => EN,
  SpeechT5HifiGan: () => AN,
  SpeechT5Model: () => kN,
  SpeechT5PreTrainedModel: () => Ha,
  SqueezeBertForMaskedLM: () => SN,
  SqueezeBertForQuestionAnswering: () => FN,
  SqueezeBertForSequenceClassification: () => PN,
  SqueezeBertModel: () => CN,
  SqueezeBertPreTrainedModel: () => Ts,
  StableLmForCausalLM: () => LN,
  StableLmModel: () => IN,
  StableLmPreTrainedModel: () => yu,
  Starcoder2ForCausalLM: () => NN,
  Starcoder2Model: () => ON,
  Starcoder2PreTrainedModel: () => bu,
  StyleTextToSpeech2Model: () => DN,
  StyleTextToSpeech2PreTrainedModel: () => Bw,
  SupertonicForConditionalGeneration: () => $w,
  SupertonicPreTrainedModel: () => Rw,
  Swin2SRForImageSuperResolution: () => GN,
  Swin2SRModel: () => $N,
  Swin2SRPreTrainedModel: () => Mu,
  SwinForImageClassification: () => BN,
  SwinForSemanticSegmentation: () => RN,
  SwinModel: () => zN,
  SwinPreTrainedModel: () => Qa,
  T5ForConditionalGeneration: () => UN,
  T5Model: () => VN,
  T5PreTrainedModel: () => xu,
  TableTransformerForObjectDetection: () => WN,
  TableTransformerModel: () => jN,
  TableTransformerObjectDetectionOutput: () => Gw,
  TableTransformerPreTrainedModel: () => ku,
  TokenClassifierOutput: () => He,
  TrOCRForCausalLM: () => qN,
  TrOCRPreTrainedModel: () => Vw,
  UltravoxModel: () => gc,
  UltravoxPreTrainedModel: () => iw,
  UniSpeechForCTC: () => QN,
  UniSpeechForSequenceClassification: () => XN,
  UniSpeechModel: () => HN,
  UniSpeechPreTrainedModel: () => Xa,
  UniSpeechSatForAudioFrameClassification: () => ZN,
  UniSpeechSatForCTC: () => KN,
  UniSpeechSatForSequenceClassification: () => JN,
  UniSpeechSatModel: () => YN,
  UniSpeechSatPreTrainedModel: () => Es,
  VaultGemmaForCausalLM: () => tD,
  VaultGemmaModel: () => eD,
  VaultGemmaPreTrainedModel: () => Tu,
  ViTForImageClassification: () => sD,
  ViTMAEModel: () => aD,
  ViTMAEPreTrainedModel: () => Uw,
  ViTMSNForImageClassification: () => iD,
  ViTMSNModel: () => oD,
  ViTMSNPreTrainedModel: () => Au,
  ViTModel: () => nD,
  ViTPreTrainedModel: () => Eu,
  VisionEncoderDecoderModel: () => rD,
  VitMatteForImageMatting: () => lD,
  VitMattePreTrainedModel: () => jw,
  VitPoseForPoseEstimation: () => cD,
  VitPosePreTrainedModel: () => Ww,
  VitsModel: () => uD,
  VitsModelOutput: () => qw,
  VitsPreTrainedModel: () => Hw,
  VoxtralForConditionalGeneration: () => dD,
  VoxtralRealtimeForConditionalGeneration: () => Xw,
  VoxtralRealtimePreTrainedModel: () => Qw,
  Wav2Vec2BertForCTC: () => vD,
  Wav2Vec2BertForSequenceClassification: () => yD,
  Wav2Vec2BertModel: () => wD,
  Wav2Vec2BertPreTrainedModel: () => Ya,
  Wav2Vec2ForAudioFrameClassification: () => lI,
  Wav2Vec2ForCTC: () => oI,
  Wav2Vec2ForSequenceClassification: () => iI,
  Wav2Vec2Model: () => aI,
  Wav2Vec2PreTrainedModel: () => Or,
  \u0057avLMForAudioFrameClassification: () => TD,
  WavLMForCTC: () => MD,
  WavLMForSequenceClassification: () => xD,
  WavLMForXVector: () => kD,
  WavLMModel: () => bD,
  WavLMPreTrainedModel: () => Vn,
  WeSpeakerResNetModel: () => ED,
  WeSpeakerResNetPreTrainedModel: () => Kw,
  WhisperForConditionalGeneration: () => Jw,
  WhisperModel: () => CD,
  WhisperPreTrainedModel: () => Cu,
  XLMForQuestionAnswering: () => OD,
  XLMForSequenceClassification: () => ID,
  XLMForTokenClassification: () => LD,
  XLMModel: () => PD,
  XLMPreTrainedModel: () => Un,
  XLMRobertaForMaskedLM: () => DD,
  XLMRobertaForQuestionAnswering: () => RD,
  XLMRobertaForSequenceClassification: () => zD,
  \u0058LMRobertaForTokenClassification: () => BD,
  XLMRobertaModel: () => ND,
  XLMRobertaPreTrainedModel: () => jn,
  XLMWithLMHeadModel: () => FD,
  XVectorOutput: () => Yw,
  YolosForObjectDetection: () => GD,
  YolosModel: () => $D,
  YolosObjectDetectionOutput: () => Zw,
  YolosPreTrainedModel: () => Su,
  YoutuForCausalLM: () => UD,
  YoutuModel: () => VD,
  YoutuPreTrainedModel: () => Pu,
  ZayaForCausalLM: () => WD,
  ZayaModel: () => jD,
  ZayaPreTrainedModel: () => Fu
});
var ws = class extends I {
}, JC = class extends ws {
}, ZC = class extends ws {
  /**
   * Calls the model on new inputs.
   *
   * @param {Object} model_inputs The inputs to the model.
   * @returns {Promise<SequenceClassifierOutput>} returned object
   */
  async _call(e) {
    return new ae(await super._call(e));
  }
}, eS = class extends ws {
  /**
   * Calls the model on new inputs.
   *
   * @param {Object} model_inputs The inputs to the model.
   * @returns {Promise<QuestionAnsweringModelOutput>} returned object
   */
  async _call(e) {
    return new it(await super._call(e));
  }
}, tS = class extends ws {
  /**
   * Calls the model on new inputs.
   *
   * @param {Object} model_inputs The inputs to the model.
   * @returns {Promise<MaskedLMOutput>} returned object
   */
  async _call(e) {
    return new Xe(await super._call(e));
  }
}, Tl = class extends I {
}, rS = class extends Tl {
}, nS = class extends Tl {
}, El = class extends I {
}, sS = class extends El {
}, aS = class extends El {
}, Al = class extends I {
}, oS = class extends Al {
}, iS = class extends Al {
}, Cl = class extends I {
}, lS = class extends Cl {
}, cS = class extends Cl {
}, La = class extends I {
}, uS = class extends La {
}, dS = class extends La {
}, hS = class extends La {
  /**
   * Calls the model on new inputs.
   *
   * @param {Object} model_inputs The inputs to the model.
   * @returns {Promise<SequenceClassifierOutput>} An object containing the model's output logits for sequence classification.
   */
  async _call(e) {
    return new ae(await super._call(e));
  }
}, Sl = class extends I {
}, fS = class extends Sl {
}, _S = class extends Sl {
  /**
   * @param {any} model_inputs
   */
  async _call(e) {
    return new ae(await super._call(e));
  }
}, Fn = class extends I {
}, pS = class extends Fn {
}, mS = class extends Fn {
  /**
   * Calls the model on new inputs.
   *
   * @param {Object} model_inputs The inputs to the model.
   * @returns {Promise<MaskedLMOutput>} An object containing the model's output logits for masked language modeling.
   */
  async _call(e) {
    return new Xe(await super._call(e));
  }
}, gS = class extends Fn {
  /**
   * Calls the model on new inputs.
   *
   * @param {Object} model_inputs The inputs to the model.
   * @returns {Promise<SequenceClassifierOutput>} An object containing the model's output logits for sequence classification.
   */
  async _call(e) {
    return new ae(await super._call(e));
  }
}, wS = class extends Fn {
  /**
   * Calls the model on new inputs.
   *
   * @param {Object} model_inputs The inputs to the model.
   * @returns {Promise<TokenClassifierOutput>} An object containing the model's output logits for token classification.
   */
  async _call(e) {
    return new He(await super._call(e));
  }
}, vS = class extends Fn {
  /**
   * Calls the model on new inputs.
   *
   * @param {Object} model_inputs The inputs to the model.
   * @returns {Promise<QuestionAnsweringModelOutput>} An object containing the model's output logits for question answering.
   */
  async _call(e) {
    return new it(await super._call(e));
  }
}, Pl = class extends I {
}, yS = class extends Pl {
}, bS = class extends Pl {
}, Fl = class extends I {
}, MS = class extends Fl {
}, xS = class extends Fl {
}, Il = class extends I {
}, kS = class extends Il {
}, TS = class extends Il {
}, In = class extends I {
}, ES = class extends In {
}, AS = class extends In {
  /**
   * Calls the model on new inputs.
   *
   * @param {Object} model_inputs The inputs to the model.
   * @returns {Promise<MaskedLMOutput>} An object containing the model's output logits for masked language modeling.
   */
  async _call(e) {
    return new Xe(await super._call(e));
  }
}, CS = class extends In {
  /**
   * Calls the model on new inputs.
   *
   * @param {Object} model_inputs The inputs to the model.
   * @returns {Promise<SequenceClassifierOutput>} An object containing the model's output logits for sequence classification.
   */
  async _call(e) {
    return new ae(await super._call(e));
  }
}, SS = class extends In {
  /**
   * Calls the model on new inputs.
   *
   * @param {Object} model_inputs The inputs to the model.
   * @returns {Promise<TokenClassifierOutput>} An object containing the model's output logits for token classification.
   */
  async _call(e) {
    return new He(await super._call(e));
  }
}, PS = class extends In {
  /**
   * Calls the model on new inputs.
   *
   * @param {Object} model_inputs The inputs to the model.
   * @returns {Promise<QuestionAnsweringModelOutput>} An object containing the model's output logits for question answering.
   */
  async _call(e) {
    return new it(await super._call(e));
  }
}, FS = 4299n, Ap = 6561n, Lg = class extends I {
  forward_params = [
    "input_ids",
    "inputs_embeds",
    "attention_mask",
    "position_ids",
    "audio_values",
    "exaggeration",
    "audio_features",
    "audio_tokens",
    "speaker_embeddings",
    "speaker_features",
    "past_key_values"
  ];
  main_input_name = "input_ids";
  _return_dict_in_generate_keys = ["audio_tokens", "speaker_embeddings", "speaker_features"];
}, Og = class extends Lg {
  /**
   * @param {Tensor} audio_values
   * @returns {Promise<{audio_features: Tensor, audio_tokens: Tensor, speaker_embeddings: Tensor, speaker_features: Tensor}>}
   */
  async encode_speech(e) {
    return ve(this.sessions.speech_encoder, {
      audio_values: e
    });
  }
  async forward({
    // Produced by the tokenizer/processor:
    input_ids: e = null,
    attention_mask: t = null,
    audio_values: r = null,
    exaggeration: n = null,
    // Used during generation:
    position_ids: s = null,
    inputs_embeds: a = null,
    past_key_values: o = null,
    // Generic generation parameters
    generation_config: i = null,
    logits_processor: l = null,
    num_logits_to_keep: c = null,
    // Speaker embeddings/features (useful for re-using pre-computed speaker data)
    audio_features: d = null,
    // float32[batch_size,sequence_length,1024]
    audio_tokens: h = null,
    // int64[batch_size,audio_sequence_length]
    speaker_embeddings: _ = null,
    // float32[batch_size,192]
    speaker_features: p = null,
    // float32[batch_size,feature_dim,80]
    // TODO: needed?
    ...w
  }) {
    let v;
    if (!a) {
      let b = this.sessions.embed_tokens.inputNames, k = { input_ids: e };
      if (b.includes("exaggeration")) {
        if (!(n instanceof V)) {
          let A = e.dims[0];
          if (n == null)
            n = ut([A], 0.5);
          else if (typeof n == "number")
            n = ut([A], n);
          else if (Array.isArray(n))
            n = new V("float32", n, [A]);
          else
            throw new Error("Unsupported type for `exaggeration` input");
        }
        k.exaggeration = n;
      }
      if (b.includes("position_ids") && (k.position_ids = s), { inputs_embeds: a } = await ve(this.sessions.embed_tokens, k), d && h && _ && p && (v = { audio_features: d, audio_tokens: h, speaker_embeddings: _, speaker_features: p }), v || r)
        v ??= await this.encode_speech(r), a = De([v.audio_features, a], 1), t = gt([a.dims[0], a.dims[1]]);
      else {
        let A = a.dims[1];
        if (!o || A !== 1)
          throw new Error("Incorrect state encountered during generation.");
        let E = o.get_seq_length();
        t = gt([a.dims[0], E + A]);
      }
    }
    return {
      ...await _r(
        this,
        {
          inputs_embeds: a,
          past_key_values: o,
          attention_mask: t,
          generation_config: i,
          logits_processor: l,
          num_logits_to_keep: c
        },
        !1
      ),
      ...v
    };
  }
  prepare_inputs_for_generation(e, t, r) {
    if (!t.position_ids && this.sessions.embed_tokens.inputNames.includes("position_ids"))
      if (t.input_ids.dims[1] === 1) {
        let n = Array.from(
          {
            length: e.length
          },
          (s, a) => e[a].length - e[a].findLastIndex((o) => o == Ap) - 1
        );
        t.position_ids = new V("int64", n, [e.length, 1]);
      } else {
        let s = t.input_ids.tolist().map((a) => {
          let o = 0;
          return a.map((i) => i >= Ap ? 0 : o++);
        });
        t.position_ids = new V("int64", s.flat(), t.input_ids.dims);
      }
    return t.input_ids.dims[1] === 1 && (delete t.audio_values, delete t.audio_features, delete t.audio_tokens, delete t.speaker_embeddings, delete t.speaker_features), An(this, e, t, r);
  }
  /** @type {PreTrainedModel['generate']} */
  async generate(e) {
    let t = e.past_key_values, { sequences: r, audio_tokens: n, speaker_embeddings: s, speaker_features: a, past_key_values: o } = (
      /** @type {any} */
      await super.generate({
        ...e,
        return_dict_in_generate: !0
      })
    );
    try {
      let i = r.slice(null, [
        /** @type {Tensor} */
        e.input_ids.dims[1],
        // Exclude start of speech token
        -1
        // Exclude end of speech token
      ]), l = ut([i.dims[0], 3], FS), c = De([n, i, l], 1), { waveform: d } = await ve(this.sessions.conditional_decoder, {
        speech_tokens: c,
        speaker_features: a,
        speaker_embeddings: s
      });
      return d;
    } finally {
      o !== t && await o?.dispose();
    }
  }
}, Ng = class extends I {
}, IS = class extends Ng {
}, Dg = class extends I {
}, LS = class extends Dg {
}, Oa = class extends I {
}, OS = class extends Oa {
}, zg = class extends Oa {
  /** @type {typeof PreTrainedModel.from_pretrained} */
  static async from_pretrained(e, t = {}) {
    return super.from_pretrained(e, {
      ...t,
      // Update default model file name if not provided
      model_file_name: t.model_file_name ?? "text_model"
    });
  }
}, Bg = class extends Oa {
  /** @type {typeof PreTrainedModel.from_pretrained} */
  static async from_pretrained(e, t = {}) {
    return super.from_pretrained(e, {
      ...t,
      // Update default model file name if not provided
      model_file_name: t.model_file_name ?? "audio_model"
    });
  }
}, nn = class extends I {
}, NS = class extends nn {
}, DS = class extends nn {
  /** @type {typeof PreTrainedModel.from_pretrained} */
  static async from_pretrained(e, t = {}) {
    return super.from_pretrained(e, {
      ...t,
      // Update default model file name if not provided
      model_file_name: t.model_file_name ?? "text_model"
    });
  }
}, Rg = class extends nn {
  /** @type {typeof PreTrainedModel.from_pretrained} */
  static async from_pretrained(e, t = {}) {
    return super.from_pretrained(e, {
      ...t,
      // Update default model file name if not provided
      model_file_name: t.model_file_name ?? "text_model"
    });
  }
}, zS = class extends nn {
  /** @type {typeof PreTrainedModel.from_pretrained} */
  static async from_pretrained(e, t = {}) {
    return super.from_pretrained(e, {
      ...t,
      // Update default model file name if not provided
      model_file_name: t.model_file_name ?? "vision_model"
    });
  }
}, BS = class extends nn {
  /** @type {typeof PreTrainedModel.from_pretrained} */
  static async from_pretrained(e, t = {}) {
    return super.from_pretrained(e, {
      ...t,
      // Update default model file name if not provided
      model_file_name: t.model_file_name ?? "vision_model"
    });
  }
}, Ll = class extends I {
}, RS = class extends Ll {
}, $S = class extends Ll {
}, Ol = class extends I {
}, GS = class extends Ol {
}, VS = class extends Ol {
}, Nl = class extends I {
}, US = class extends Nl {
}, jS = class extends Nl {
}, Dl = class extends I {
}, WS = class extends Dl {
}, qS = class extends Dl {
}, zl = class extends I {
  requires_attention_mask = !1;
  main_input_name = "input_features";
  forward_params = ["input_features", "decoder_input_ids", "decoder_attention_mask", "past_key_values"];
}, HS = class extends zl {
}, QS = class extends zl {
}, Ln = class extends I {
}, XS = class extends Ln {
}, YS = class extends Ln {
  /**
   * Calls the model on new inputs.
   *
   * @param {Object} model_inputs The inputs to the model.
   * @returns {Promise<MaskedLMOutput>} An object containing the model's output logits for masked language modeling.
   */
  async _call(e) {
    return new Xe(await super._call(e));
  }
}, KS = class extends Ln {
  /**
   * Calls the model on new inputs.
   *
   * @param {Object} model_inputs The inputs to the model.
   * @returns {Promise<SequenceClassifierOutput>} An object containing the model's output logits for sequence classification.
   */
  async _call(e) {
    return new ae(await super._call(e));
  }
}, JS = class extends Ln {
  /**
   * Calls the model on new inputs.
   *
   * @param {Object} model_inputs The inputs to the model.
   * @returns {Promise<TokenClassifierOutput>} An object containing the model's output logits for token classification.
   */
  async _call(e) {
    return new He(await super._call(e));
  }
}, ZS = class extends Ln {
  /**
   * Calls the model on new inputs.
   *
   * @param {Object} model_inputs The inputs to the model.
   * @returns {Promise<QuestionAnsweringModelOutput>} An object containing the model's output logits for question answering.
   */
  async _call(e) {
    return new it(await super._call(e));
  }
}, Bl = class extends I {
}, eP = class extends Bl {
}, tP = class extends Bl {
  /**
   * @param {any} model_inputs
   */
  async _call(e) {
    return new ae(await super._call(e));
  }
}, Rl = class extends I {
}, rP = class extends Rl {
}, nP = class extends Rl {
  /**
   * @param {any} model_inputs
   */
  async _call(e) {
    return new ae(await super._call(e));
  }
}, $l = class extends I {
}, sP = class extends $l {
}, aP = class extends $l {
  /**
   * @param {any} model_inputs
   */
  async _call(e) {
    return new vs(await super._call(e));
  }
}, vs = class extends Ve {
  /**
   * @param {Object} output The output of the model.
   * @param {Tensor} output.logits Classification logits (including no-object) for all queries.
   * @param {Tensor} output.pred_boxes Normalized boxes coordinates for all queries, represented as (center_x, center_y, width, height).
   * These values are normalized in [0, 1], relative to the size of each individual image in the batch (disregarding possible padding).
   */
  constructor({ logits: e, pred_boxes: t }) {
    super(), this.logits = e, this.pred_boxes = t;
  }
}, Gl = class extends I {
}, oP = class extends Gl {
}, iP = class extends Gl {
  /**
   * @param {any} model_inputs
   */
  async _call(e) {
    return new vs(await super._call(e));
  }
}, $g = class extends Ve {
  /**
   * @param {Object} output The output of the model.
   * @param {Tensor} output.audio_codes Discrete code embeddings, of shape `(batch_size, num_quantizers, codes_length)`.
   */
  constructor({ audio_codes: e }) {
    super(), this.audio_codes = e;
  }
}, Gg = class extends Ve {
  /**
   * @param {Object} output The output of the model.
   * @param {Tensor} output.audio_values Decoded audio values, of shape `(batch_size, num_channels, sequence_length)`.
   */
  constructor({ audio_values: e }) {
    super(), this.audio_values = e;
  }
}, Na = class extends I {
  main_input_name = "input_values";
  forward_params = ["input_values"];
}, lP = class extends Na {
  /**
   * Encodes the input audio waveform into discrete codes.
   * @param {Object} inputs Model inputs
   * @param {Tensor} [inputs.input_values] Float values of the input audio waveform, of shape `(batch_size, channels, sequence_length)`).
   * @returns {Promise<DacEncoderOutput>} The output tensor of shape `(batch_size, num_codebooks, sequence_length)`.
   */
  async encode(e) {
    return new $g(await ve(this.sessions.encoder_model, e));
  }
  /**
   * Decodes the given frames into an output audio waveform.
   * @param {DacEncoderOutput} inputs The encoded audio codes.
   * @returns {Promise<DacDecoderOutput>} The output tensor of shape `(batch_size, num_channels, sequence_length)`.
   */
  async decode(e) {
    return new Gg(await ve(this.sessions.decoder_model, e));
  }
}, Vg = class extends Na {
  /** @type {typeof PreTrainedModel.from_pretrained} */
  static async from_pretrained(e, t = {}) {
    return super.from_pretrained(e, {
      ...t,
      // Update default model file name if not provided
      model_file_name: t.model_file_name ?? "encoder_model"
    });
  }
}, Ug = class extends Na {
  /** @type {typeof PreTrainedModel.from_pretrained} */
  static async from_pretrained(e, t = {}) {
    return super.from_pretrained(e, {
      ...t,
      // Update default model file name if not provided
      model_file_name: t.model_file_name ?? "decoder_model"
    });
  }
}, On = class extends I {
}, cP = class extends On {
}, uP = class extends On {
  /**
   * Calls the model on new inputs.
   *
   * @param {Object} model_inputs The inputs to the model.
   * @returns {Promise<MaskedLMOutput>} An object containing the model's output logits for masked language modeling.
   */
  async _call(e) {
    return new Xe(await super._call(e));
  }
}, dP = class extends On {
  /**
   * Calls the model on new inputs.
   *
   * @param {Object} model_inputs The inputs to the model.
   * @returns {Promise<SequenceClassifierOutput>} An object containing the model's output logits for sequence classification.
   */
  async _call(e) {
    return new ae(await super._call(e));
  }
}, hP = class extends On {
  /**
   * Calls the model on new inputs.
   *
   * @param {Object} model_inputs The inputs to the model.
   * @returns {Promise<TokenClassifierOutput>} An object containing the model's output logits for token classification.
   */
  async _call(e) {
    return new He(await super._call(e));
  }
}, fP = class extends On {
  /**
   * Calls the model on new inputs.
   *
   * @param {Object} model_inputs The inputs to the model.
   * @returns {Promise<QuestionAnsweringModelOutput>} An object containing the model's output logits for question answering.
   */
  async _call(e) {
    return new it(await super._call(e));
  }
}, Vl = class extends I {
}, _P = class extends Vl {
}, pP = class extends Vl {
}, Ul = class extends I {
}, mP = class extends Ul {
}, gP = class extends Ul {
}, Nn = class extends I {
}, wP = class extends Nn {
}, vP = class extends Nn {
  /**
   * Calls the model on new inputs.
   *
   * @param {Object} model_inputs The inputs to the model.
   * @returns {Promise<MaskedLMOutput>} An object containing the model's output logits for masked language modeling.
   */
  async _call(e) {
    return new Xe(await super._call(e));
  }
}, yP = class extends Nn {
  /**
   * Calls the model on new inputs.
   *
   * @param {Object} model_inputs The inputs to the model.
   * @returns {Promise<SequenceClassifierOutput>} An object containing the model's output logits for sequence classification.
   */
  async _call(e) {
    return new ae(await super._call(e));
  }
}, bP = class extends Nn {
  /**
   * Calls the model on new inputs.
   *
   * @param {Object} model_inputs The inputs to the model.
   * @returns {Promise<TokenClassifierOutput>} An object containing the model's output logits for token classification.
   */
  async _call(e) {
    return new He(await super._call(e));
  }
}, MP = class extends Nn {
  /**
   * Calls the model on new inputs.
   *
   * @param {Object} model_inputs The inputs to the model.
   * @returns {Promise<QuestionAnsweringModelOutput>} An object containing the model's output logits for question answering.
   */
  async _call(e) {
    return new it(await super._call(e));
  }
}, jg = class extends I {
}, xP = class extends jg {
}, jl = class extends I {
}, kP = class extends jl {
}, TP = class extends jl {
  /**
   * @param {any} model_inputs
   */
  async _call(e) {
    return new ae(await super._call(e));
  }
}, Wg = class extends I {
}, EP = class extends Wg {
}, qg = class extends I {
}, AP = class extends qg {
}, Da = class extends I {
}, CP = class extends Da {
}, SP = class extends Da {
  /**
   * @param {any} model_inputs
   */
  async _call(e) {
    return new Wl(await super._call(e));
  }
}, PP = class extends Da {
  /**
   * Runs the model with the provided inputs
   * @param {Object} model_inputs Model inputs
   * @returns {Promise<DetrSegmentationOutput>} Object containing segmentation outputs
   */
  async _call(e) {
    return new Hg(await super._call(e));
  }
}, Wl = class extends Ve {
  /**
   * @param {Object} output The output of the model.
   * @param {Tensor} output.logits Classification logits (including no-object) for all queries.
   * @param {Tensor} output.pred_boxes Normalized boxes coordinates for all queries, represented as (center_x, center_y, width, height).
   * These values are normalized in [0, 1], relative to the size of each individual image in the batch (disregarding possible padding).
   */
  constructor({ logits: e, pred_boxes: t }) {
    super(), this.logits = e, this.pred_boxes = t;
  }
}, Hg = class extends Ve {
  /**
   * @param {Object} output The output of the model.
   * @param {Tensor} output.logits The output logits of the model.
   * @param {Tensor} output.pred_boxes Predicted boxes.
   * @param {Tensor} output.pred_masks Predicted masks.
   */
  constructor({ logits: e, pred_boxes: t, pred_masks: r }) {
    super(), this.logits = e, this.pred_boxes = t, this.pred_masks = r;
  }
}, ql = class extends I {
}, FP = class extends ql {
}, IP = class extends ql {
  /**
   * @param {any} model_inputs
   */
  async _call(e) {
    return new ae(await super._call(e));
  }
}, Hl = class extends I {
}, LP = class extends Hl {
}, OP = class extends Hl {
  /**
   * @param {any} model_inputs
   */
  async _call(e) {
    return new ae(await super._call(e));
  }
}, Qg = class extends I {
}, NP = class extends Qg {
}, Xg = class extends I {
}, DP = class extends Xg {
}, Dn = class extends I {
}, zP = class extends Dn {
}, BP = class extends Dn {
  /**
   * Calls the model on new inputs.
   *
   * @param {Object} model_inputs The inputs to the model.
   * @returns {Promise<SequenceClassifierOutput>} An object containing the model's output logits for sequence classification.
   */
  async _call(e) {
    return new ae(await super._call(e));
  }
}, RP = class extends Dn {
  /**
   * Calls the model on new inputs.
   *
   * @param {Object} model_inputs The inputs to the model.
   * @returns {Promise<TokenClassifierOutput>} An object containing the model's output logits for token classification.
   */
  async _call(e) {
    return new He(await super._call(e));
  }
}, $P = class extends Dn {
  /**
   * Calls the model on new inputs.
   *
   * @param {Object} model_inputs The inputs to the model.
   * @returns {Promise<QuestionAnsweringModelOutput>} An object containing the model's output logits for question answering.
   */
  async _call(e) {
    return new it(await super._call(e));
  }
}, GP = class extends Dn {
  /**
   * Calls the model on new inputs.
   *
   * @param {Object} model_inputs The inputs to the model.
   * @returns {Promise<MaskedLMOutput>} returned object
   */
  async _call(e) {
    return new Xe(await super._call(e));
  }
}, Yg = class extends I {
}, VP = class extends Yg {
}, Ql = class extends I {
}, UP = class extends Ql {
}, jP = class extends Ql {
}, Xl = class extends I {
}, WP = class extends Xl {
}, qP = class extends Xl {
  /**
   * @param {any} model_inputs
   */
  async _call(e) {
    return new ae(await super._call(e));
  }
}, zn = class extends I {
}, HP = class extends zn {
}, QP = class extends zn {
  /**
   * Calls the model on new inputs.
   *
   * @param {Object} model_inputs The inputs to the model.
   * @returns {Promise<MaskedLMOutput>} An object containing the model's output logits for masked language modeling.
   */
  async _call(e) {
    return new Xe(await super._call(e));
  }
}, XP = class extends zn {
  /**
   * Calls the model on new inputs.
   *
   * @param {Object} model_inputs The inputs to the model.
   * @returns {Promise<SequenceClassifierOutput>} An object containing the model's output logits for sequence classification.
   */
  async _call(e) {
    return new ae(await super._call(e));
  }
}, YP = class extends zn {
  /**
   * Calls the model on new inputs.
   *
   * @param {Object} model_inputs The inputs to the model.
   * @returns {Promise<TokenClassifierOutput>} An object containing the model's output logits for token classification.
   */
  async _call(e) {
    return new He(await super._call(e));
  }
}, KP = class extends zn {
  /**
   * Calls the model on new inputs.
   *
   * @param {Object} model_inputs The inputs to the model.
   * @returns {Promise<QuestionAnsweringModelOutput>} An object containing the model's output logits for question answering.
   */
  async _call(e) {
    return new it(await super._call(e));
  }
}, Kg = class extends I {
}, Jg = class extends Kg {
  async forward({
    input_ids: e,
    attention_mask: t,
    pixel_values: r = null,
    image_position_ids: n = null,
    pixel_values_videos: s = null,
    video_position_ids: a = null,
    input_features: o = null,
    input_features_mask: i = null
  }) {
    let l = {
      image_features: r && await this.encode_image({ pixel_values: r, pixel_position_ids: n }),
      video_features: s && await this.encode_image({
        pixel_values: s,
        pixel_position_ids: a
      }),
      audio_features: o && await this.encode_audio({ input_features: o, input_features_mask: i })
    }, { image_token_id: c, video_token_id: d, audio_token_id: h, text_config: _ } = (
      /** @type {any} */
      this.config
    ), p = { image: c, video: d, audio: h };
    for (let [w, v] of Object.entries(p)) {
      let y = `${w}_features`;
      l[y] ??= new V("float32", new Float32Array(0), [0, _.hidden_size]);
      let b = 0;
      for (let k of e.data)
        Number(k) === v && ++b;
      if (b !== l[y].dims[0])
        throw new Error(
          `The number of ${w} tokens (${b}) and ${w} features (${l[y].dims[0]}) do not match.`
        );
    }
    return await ve(this.sessions.model, { input_ids: e, attention_mask: t, ...l });
  }
}, Yl = class extends I {
}, JP = class extends Yl {
}, ZP = class extends Yl {
}, ys = class extends I {
}, eF = class extends ys {
}, tF = class extends ys {
  /**
   * Calls the model on new inputs.
   *
   * @param {Object} model_inputs The inputs to the model.
   * @returns {Promise<MaskedLMOutput>} An object containing the model's output logits for masked language modeling.
   */
  async _call(e) {
    return new Xe(await super._call(e));
  }
}, rF = class extends ys {
  /**
   * Calls the model on new inputs.
   *
   * @param {Object} model_inputs The inputs to the model.
   * @returns {Promise<SequenceClassifierOutput>} An object containing the model's output logits for sequence classification.
   */
  async _call(e) {
    return new ae(await super._call(e));
  }
}, nF = class extends ys {
  /**
   * Calls the model on new inputs.
   *
   * @param {Object} model_inputs The inputs to the model.
   * @returns {Promise<TokenClassifierOutput>} An object containing the model's output logits for token classification.
   */
  async _call(e) {
    return new He(await super._call(e));
  }
}, bs = class extends I {
}, sF = class extends bs {
}, aF = class extends bs {
  /**
   * Calls the model on new inputs.
   *
   * @param {Object} model_inputs The inputs to the model.
   * @returns {Promise<MaskedLMOutput>} An object containing the model's output logits for masked language modeling.
   */
  async _call(e) {
    return new Xe(await super._call(e));
  }
}, oF = class extends bs {
  /**
   * Calls the model on new inputs.
   *
   * @param {Object} model_inputs The inputs to the model.
   * @returns {Promise<SequenceClassifierOutput>} An object containing the model's output logits for sequence classification.
   */
  async _call(e) {
    return new ae(await super._call(e));
  }
}, iF = class extends bs {
  /**
   * Calls the model on new inputs.
   *
   * @param {Object} model_inputs The inputs to the model.
   * @returns {Promise<TokenClassifierOutput>} An object containing the model's output logits for token classification.
   */
  async _call(e) {
    return new He(await super._call(e));
  }
}, Kl = class extends I {
}, lF = class extends Kl {
}, cF = class extends Kl {
}, Jl = class extends I {
}, uF = class extends Jl {
}, dF = class extends Jl {
}, Zl = class extends I {
}, hF = class extends Zl {
}, fF = class extends Zl {
}, ec = class extends I {
}, _F = class extends ec {
}, pF = class extends ec {
  /**
   * @param {any} model_inputs
   */
  async _call(e) {
    return new ae(await super._call(e));
  }
}, Zg = class extends I {
  forward_params = [
    // Encoder inputs
    "input_ids",
    "inputs_embeds",
    "attention_mask",
    "pixel_values",
    // Decoder inputs
    "encoder_outputs",
    "decoder_input_ids",
    "decoder_inputs_embeds",
    "decoder_attention_mask",
    "past_key_values"
  ];
  main_input_name = "inputs_embeds";
}, mF = class extends Zg {
  _merge_input_ids_with_image_features({ inputs_embeds: e, image_features: t, input_ids: r, attention_mask: n }) {
    return {
      inputs_embeds: De(
        [
          t,
          // image embeds
          e
          // task prefix embeds
        ],
        1
      ),
      attention_mask: De(
        [
          gt(t.dims.slice(0, 2)),
          // image attention mask
          n
          // task prefix attention mask
        ],
        1
      )
    };
  }
  async _prepare_inputs_embeds({ input_ids: e, pixel_values: t, inputs_embeds: r, attention_mask: n }) {
    if (!e && !t)
      throw new Error("Either `input_ids` or `pixel_values` should be provided.");
    let s, a;
    return e && (s = await this.encode_text({ input_ids: e })), t && (a = await this.encode_image({ pixel_values: t })), s && a ? { inputs_embeds: r, attention_mask: n } = this._merge_input_ids_with_image_features({
      inputs_embeds: s,
      image_features: a,
      input_ids: e,
      attention_mask: n
    }) : r = s || a, { inputs_embeds: r, attention_mask: n };
  }
  async forward({
    input_ids: e,
    pixel_values: t,
    attention_mask: r,
    decoder_input_ids: n,
    decoder_attention_mask: s,
    encoder_outputs: a,
    past_key_values: o,
    inputs_embeds: i,
    decoder_inputs_embeds: l,
    num_logits_to_keep: c = null
  }) {
    if (i || ({ inputs_embeds: i, attention_mask: r } = await this._prepare_inputs_embeds({
      input_ids: e,
      pixel_values: t,
      inputs_embeds: i,
      attention_mask: r
    })), !a) {
      let { last_hidden_state: h } = await Ir(this, { inputs_embeds: i, attention_mask: r });
      a = h;
    }
    if (!l) {
      if (!n)
        throw new Error("Either `decoder_input_ids` or `decoder_inputs_embeds` should be provided.");
      l = await this.encode_text({ input_ids: n });
    }
    return await _r(this, {
      inputs_embeds: l,
      attention_mask: s,
      encoder_attention_mask: r,
      encoder_hidden_states: a,
      past_key_values: o,
      num_logits_to_keep: c
    }, !0);
  }
}, tc = class extends I {
}, gF = class extends tc {
}, wF = class extends tc {
}, rc = class extends I {
}, vF = class extends rc {
}, yF = class extends rc {
}, ew = class extends I {
  forward_params = ["input_ids", "attention_mask", "pixel_values", "position_ids", "past_key_values"];
}, nr = class extends ew {
  _merge_input_ids_with_image_features(e) {
    let t = e.image_features.dims.at(-1), r = e.image_features.view(-1, t);
    return xl({
      // @ts-ignore
      image_token_id: this.config.image_token_index ?? this.config.image_token_id,
      ...e,
      image_features: r
    });
  }
}, bF = class extends nr {
}, MF = class extends nr {
}, tw = class extends I {
}, xF = class extends tw {
}, rw = class extends nr {
}, kF = class extends rw {
}, nw = class extends I {
  forward_params = [
    "input_ids",
    "attention_mask",
    "inputs_embeds",
    "per_layer_inputs",
    "position_ids",
    "pixel_values",
    "input_features",
    "input_features_mask",
    "past_key_values"
  ];
}, za = class extends nw {
  async forward({
    // Produced by the tokenizer/processor:
    input_ids: e = null,
    attention_mask: t = null,
    pixel_values: r = null,
    input_features: n = null,
    input_features_mask: s = null,
    // Used during generation:
    position_ids: a = null,
    inputs_embeds: o = null,
    per_layer_inputs: i = null,
    past_key_values: l = null,
    // Generic generation parameters
    generation_config: c = null,
    logits_processor: d = null,
    num_logits_to_keep: h = null,
    // TODO: needed?
    ..._
  }) {
    if ((!o || !i) && ({ inputs_embeds: o, per_layer_inputs: i } = await ve(this.sessions.embed_tokens, {
      input_ids: e
    }), e.dims[1] !== 1)) {
      if (r) {
        let { image_features: w } = await this._encode_vision({ pixel_values: r, ..._ });
        ({ inputs_embeds: o, attention_mask: t } = this._merge_input_ids_with_image_features({
          image_features: w,
          inputs_embeds: o,
          input_ids: e,
          attention_mask: t
        }));
      }
      if (n) {
        let { audio_features: w } = await ve(this.sessions.audio_encoder, {
          input_features: n,
          input_features_mask: s
        });
        ({ inputs_embeds: o, attention_mask: t } = this._merge_input_ids_with_audio_features({
          audio_features: w,
          inputs_embeds: o,
          input_ids: e,
          attention_mask: t
        }));
      }
    }
    return await _r(
      this,
      {
        inputs_embeds: o,
        per_layer_inputs: i,
        past_key_values: l,
        attention_mask: t,
        position_ids: a,
        generation_config: c,
        logits_processor: d,
        num_logits_to_keep: h
      },
      !0
    );
  }
  _encode_vision(e) {
    return ve(this.sessions.vision_encoder, { pixel_values: e.pixel_values });
  }
  _merge_input_ids_with_image_features(e) {
    let t = e.image_features.dims.at(-1), r = e.image_features.view(-1, t);
    return xl({
      // @ts-ignore
      image_token_id: this.config.image_token_id,
      ...e,
      image_features: r
    });
  }
  _merge_input_ids_with_audio_features(e) {
    let t = e.audio_features.dims.at(-1), r = e.audio_features.view(-1, t);
    return Ig({
      // @ts-ignore
      audio_token_id: this.config.audio_token_id,
      ...e,
      audio_features: r
    });
  }
}, TF = class extends za {
}, nc = class extends za {
  forward_params = [
    "input_ids",
    "attention_mask",
    "inputs_embeds",
    "per_layer_inputs",
    "position_ids",
    "pixel_values",
    "image_position_ids",
    "input_features",
    "input_features_mask",
    "past_key_values"
  ];
  _encode_vision(e) {
    return ve(this.sessions.vision_encoder, {
      pixel_values: e.pixel_values,
      pixel_position_ids: e.image_position_ids
    });
  }
}, EF = class extends nc {
}, sc = class extends I {
}, AF = class extends sc {
}, CF = class extends sc {
}, ac = class extends I {
}, SF = class extends ac {
}, PF = class extends ac {
}, sw = class extends I {
  forward_params = [
    // Text inputs
    "input_ids",
    "attention_mask",
    "position_ids",
    "past_key_values",
    // Vision inputs
    "pixel_values",
    "image_grid_thw"
  ];
}, oc = class extends sw {
  // NOTE: This is used as the base class for all Qwen VL models and their CausalLM variants.
  // CausalLM variants (e.g., Qwen2VLForCausalLM) extend this class but load only
  // embed_tokens + decoder_model_merged (no vision_encoder) via MultimodalLanguageModelOnly type.
  image_grid_thw_name = "grid_thw";
  /**
   * Compute text-only 3D rope position IDs (all 3 dims get the same 1D positions).
   * @param {Tensor} input_ids
   * @param {Tensor} attention_mask
   * @returns {[Tensor, Tensor]} [position_ids, mrope_position_deltas]
   */
  _get_text_only_rope_index(e, t) {
    if (t) {
      let { data: r, dims: n } = Pg(t), s = BigInt64Array.from({ length: 3 * r.length }, (o, i) => r[i % r.length]), a = Array.from(
        { length: n[0] },
        (o, i) => qe(r.subarray(n[1] * i, n[1] * (i + 1)))[0] + 1n + BigInt(n[1])
      );
      return [
        new V("int64", s, [3, ...n]),
        new V("int64", a, [a.length, 1])
      ];
    } else {
      let [r, n] = e.dims, s = BigInt64Array.from(
        { length: 3 * r * n },
        (a, o) => BigInt(Math.floor(o % n / r))
      );
      return [new V("int64", s, [3, ...e.dims]), Am([r, 1])];
    }
  }
  /**
   * Reorder per-segment position ID lists from [seg1[t,h,w], seg2[t,h,w], ...] into
   * global [all_t, all_h, all_w] order, then write back into the position_ids array
   * respecting attention mask.
   * @param {number[][]} llm_pos_ids_list List of per-segment position arrays, each of length 3*seg_len
   * @param {number[]} attn_mask Attention mask for this batch element
   * @param {number[][][]} position_ids_list [3][batch][seq] output array to write into
   * @param {number} batch_idx Current batch index
   * @returns {number[]} Flat reordered positions of length total_len
   */
  _reorder_and_write_positions(e, t, r, n) {
    let s = e.reduce((l, c) => l + c.length, 0), a = new Array(s), o = 0;
    for (let l = 0; l < 3; ++l)
      for (let c of e) {
        let d = c.length / 3;
        for (let h = l * d; h < (l + 1) * d; ++h)
          a[o++] = c[h];
      }
    let i = 0;
    for (let l = 0; l < t.length; ++l)
      if (t[l] == 1) {
        for (let c = 0; c < 3; ++c)
          r[c][n][l] = a[c * s / 3 + i];
        ++i;
      }
    return a;
  }
  /**
   * Build per-batch position ID segments for multimodal rope.
   * Override this in subclasses to change how vision/text segments are identified and positioned.
   * @param {object} params
   * @param {any[]} params.filtered_ids - attention-masked token IDs for this batch element
   * @param {any[][]} params.image_grid_thw_list - all image grid dimensions
   * @param {any[][]} params.video_grid_thw_list - all video grid dimensions
   * @param {number} params.spatial_merge_size
   * @param {{image_index: number, video_index: number}} params.state - mutable counters shared across batches
   * @returns {number[][]} llm_pos_ids_list - segments of [t..., h..., w...] positions
   */
  _get_multimodal_rope_positions({
    filtered_ids: e,
    image_grid_thw_list: t,
    video_grid_thw_list: r,
    spatial_merge_size: n,
    state: s
  }) {
    let { image_token_id: a, video_token_id: o, vision_start_token_id: i } = this.config, l = e, d = l.reduce((b, k, A) => (k == i && b.push(A), b), []).map((b) => l[b + 1]), h = d.filter((b) => b == a).length, _ = d.filter((b) => b == o).length, p = [], w = 0, v = h, y = _;
    for (let b = 0; b < d.length; ++b) {
      let k = l.findIndex((L, O) => O > w && L == a), A = l.findIndex((L, O) => O > w && L == o), E = v > 0 && k !== -1 ? k : l.length + 1, C = y > 0 && A !== -1 ? A : l.length + 1, N, M, $, R;
      E < C ? ([M, $, R] = t[s.image_index], ++s.image_index, --v, N = E) : ([M, $, R] = r[s.video_index], ++s.video_index, --y, N = C);
      let [W, Q, H] = [
        Number(M),
        Math.floor(Number($) / n),
        Math.floor(Number(R) / n)
      ], q = N - w, B = p.length > 0 ? qe(p.at(-1))[0] + 1 : 0;
      p.push(Array.from({ length: 3 * q }, (L, O) => B + O % q));
      let P = q + B, X = W * Q * H, ce = Array.from(
        { length: X },
        (L, O) => P + Math.floor(O / (Q * H))
      ), J = Array.from(
        { length: X },
        (L, O) => P + Math.floor(O / H) % Q
      ), ne = Array.from({ length: X }, (L, O) => P + O % H);
      p.push([ce, J, ne].flat()), w = N + X;
    }
    if (w < l.length) {
      let b = p.length > 0 ? qe(p.at(-1))[0] + 1 : 0, k = l.length - w;
      p.push(Array.from({ length: 3 * k }, (A, E) => b + E % k));
    }
    return p;
  }
  /**
   * Calculate the 3D rope index based on image and video's temporal, height and width in LLM.
   *
   * Explanation:
   *     Each embedding sequence contains vision embedding and text embedding or just contains text embedding.
   *
   *     For pure text embedding sequence, the rotary position embedding has no difference with mordern LLMs.
   *     Examples:
   *         input_ids: [T T T T T], here T is for text.
   *         temporal position_ids: [0, 1, 2, 3, 4]
   *         height position_ids: [0, 1, 2, 3, 4]
   *         width position_ids: [0, 1, 2, 3, 4]
   *
   *     For vision and text embedding sequence, we calculate 3D rotary position embedding for vision part
   *     and 1D rotary position embeddin for text part.
   *     Examples:
   *         Assume we have a video input with 3 temporal patches, 2 height patches and 2 width patches.
   *         input_ids: [V V V V V V V V V V V V T T T T T], here V is for vision.
   *         vision temporal position_ids: [0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2]
   *         vision height position_ids: [0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1]
   *         vision width position_ids: [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1]
   *         text temporal position_ids: [3, 4, 5, 6, 7]
   *         text height position_ids: [3, 4, 5, 6, 7]
   *         text width position_ids: [3, 4, 5, 6, 7]
   *         Here we calculate the text start position_ids as the max vision position_ids plus 1.
   *
   * @param {Tensor} input_ids Indices of input sequence tokens in the vocabulary. Tensor of shape `(batch_size, sequence_length)`.
   * @param {Tensor} image_grid_thw (Optional) The temporal, height and width of feature shape of each image in LLM. Tensor of shape `(num_images, 3)`.
   * @param {Tensor} video_grid_thw (Optional) The temporal, height and width of feature shape of each video in LLM. Tensor of shape `(num_videos, 3)`.
   * @param {Tensor} attention_mask (Optional) Mask to avoid performing attention on padding token indices. Tensor of shape `(batch_size, sequence_length)`.
   * @returns {[Tensor, Tensor]} [position_ids, mrope_position_deltas]
   */
  get_rope_index(e, t, r, n) {
    let { vision_config: s } = this.config, a = s.spatial_merge_size ?? 2;
    if (t || r) {
      let o = e.tolist();
      n || (n = cl(e));
      let i = n.tolist(), l = Array.from(
        { length: 3 },
        () => Array.from({ length: e.dims[0] }, () => Array.from({ length: e.dims[1] }, () => 0))
      ), c = t ? t.tolist() : [], d = r ? r.tolist() : [], h = { image_index: 0, video_index: 0 }, _ = [];
      for (let p = 0; p < o.length; ++p) {
        let w = o[p].filter((b, k) => i[p][k] == 1), v = this._get_multimodal_rope_positions({
          filtered_ids: w,
          image_grid_thw_list: c,
          video_grid_thw_list: d,
          spatial_merge_size: a,
          state: h
        }), y = this._reorder_and_write_positions(
          v,
          i[p],
          l,
          p
        );
        _.push(qe(y)[0] + 1 - o[p].length);
      }
      return [
        new V("int64", l.flat(1 / 0), [3, e.dims[0], e.dims[1]]),
        new V("int64", _, [_.length, 1])
      ];
    } else
      return this._get_text_only_rope_index(e, n);
  }
  async encode_image({ pixel_values: e, image_grid_thw: t }) {
    return (await ve(this.sessions.vision_encoder, {
      pixel_values: e,
      [this.image_grid_thw_name]: t
    })).image_features;
  }
  _merge_input_ids_with_image_features(e) {
    return xl({
      // @ts-ignore
      image_token_id: this.config.image_token_id,
      ...e
    });
  }
  prepare_inputs_for_generation(e, t, r) {
    if (gs(this, t, 1n), !t.attention_mask || t.position_ids || !(this.sessions.decoder_model_merged ?? this.sessions.model).inputNames.includes("position_ids"))
      return t;
    if (!t.past_key_values)
      [t.position_ids, t.rope_deltas] = this.get_rope_index(
        t.input_ids,
        t.image_grid_thw,
        t.video_grid_thw,
        t.attention_mask
      );
    else {
      t.pixel_values = null;
      let s = t.past_key_values.get_seq_length();
      if (s < t.input_ids.dims[1]) {
        let [a, o] = this.get_rope_index(
          t.input_ids,
          t.image_grid_thw,
          t.video_grid_thw,
          t.attention_mask
        );
        t.rope_deltas = o, t.position_ids = a.slice(null, null, [s, null]), t.input_ids = t.input_ids.slice(null, [s, null]);
      } else {
        t.rope_deltas || ([, t.rope_deltas] = this.get_rope_index(
          t.input_ids,
          t.image_grid_thw,
          t.video_grid_thw,
          t.attention_mask
        ));
        let a = BigInt(s), o = t.rope_deltas.map((i) => a + i);
        t.position_ids = fr([o, o, o], 0);
      }
    }
    return t;
  }
}, aw = class extends oc {
}, ic = class extends oc {
  image_grid_thw_name = "image_grid_thw";
}, ow = class extends aw {
  image_grid_thw_name = "image_grid_thw";
}, FF = class extends ic {
  /**
   * Compute 3D positional indices for vision tokens.
   * Temporal is constant, height is repeat-interleaved, width tiles.
   * @param {number} start_position
   * @param {number[]} grid_thw [T, H, W]
   * @param {number} temp_merge_size
   * @param {number} spatial_merge_size
   * @returns {number[]} Flat array of length 3 * seq_len: [temporal..., height..., width...]
   */
  get_vision_position_ids(e, t, r, n) {
    let s = Math.floor(t[0] / r), a = Math.floor(t[1] / n), o = Math.floor(t[2] / n), i = a * o * s, l = Array.from({ length: i }, () => e), c = Array.from(
      { length: i },
      (h, _) => e + Math.floor(_ / (o * s))
    ), d = Array.from({ length: i }, (h, _) => e + _ % o);
    return [...l, ...c, ...d];
  }
  /**
   * GlmOcr uses mm_token_type_ids-style grouping (image tokens identified by image_token_id)
   * instead of vision_start_token_id scanning used by Qwen2VL.
   * After a vision segment, position advances by max(h, w) / spatial_merge_size.
   */
  _get_multimodal_rope_positions({
    filtered_ids: e,
    image_grid_thw_list: t,
    video_grid_thw_list: r,
    spatial_merge_size: n,
    state: s
  }) {
    let { image_token_id: a } = this.config, o = [], i = 0, l = e[0] == a ? 1 : 0;
    for (let h = 1; h <= e.length; ++h) {
      let _ = h < e.length ? e[h] == a ? 1 : 0 : -1;
      _ !== l && (o.push([l, i, h]), i = h, l = _);
    }
    let c = 0, d = [];
    for (let [h, _, p] of o)
      if (h === 0) {
        let w = p - _;
        d.push(Array.from({ length: 3 * w }, (v, y) => c + y % w)), c += w;
      } else {
        let w = t[s.image_index++].map(Number), v = w[0];
        d.push(
          this.get_vision_position_ids(c, w, v, n)
        ), c += Math.max(w[1], w[2]) / n;
      }
    return d;
  }
}, lc = class extends I {
}, IF = class extends lc {
}, LF = class extends lc {
}, cc = class extends I {
}, OF = class extends cc {
}, NF = class extends cc {
}, uc = class extends I {
}, DF = class extends uc {
}, zF = class extends uc {
}, dc = class extends I {
}, BF = class extends dc {
}, RF = class extends dc {
}, hc = class extends I {
}, $F = class extends hc {
}, GF = class extends hc {
}, fc = class extends I {
}, VF = class extends fc {
}, UF = class extends fc {
}, _c = class extends I {
}, jF = class extends _c {
}, WF = class extends _c {
}, pc = class extends I {
}, qF = class extends pc {
}, HF = class extends pc {
}, mc = class extends I {
}, QF = class extends mc {
}, XF = class extends mc {
}, iw = class extends I {
  forward_params = ["input_ids", "attention_mask", "position_ids", "audio_values", "past_key_values"];
}, gc = class extends iw {
  _merge_input_ids_with_audio_features(e) {
    let t = e.audio_features.dims.at(-1), r = e.audio_features.view(-1, t);
    return Ig({
      // @ts-ignore
      audio_token_id: this.config.ignore_index ?? this.config.audio_token_id ?? this.config.audio_token_index,
      ...e,
      audio_features: r
    });
  }
}, YF = class extends gc {
  forward_params = ["input_ids", "attention_mask", "input_features", "past_key_values"];
}, lw = class extends I {
}, KF = class extends lw {
}, cw = class extends I {
}, JF = class extends cw {
}, wc = class extends I {
}, ZF = class extends wc {
}, eI = class extends wc {
}, vc = class extends I {
}, tI = class extends vc {
}, rI = class extends vc {
  /**
   * @param {any} model_inputs
   */
  async _call(e) {
    return new ae(await super._call(e));
  }
}, yc = class extends I {
}, nI = class extends yc {
}, sI = class extends yc {
  forward_params = ["input_ids", "attention_mask", "token_type_ids", "past_key_values"];
  prepare_inputs_for_generation(e, t, r) {
    let n = An(this, e, t, r);
    return n.token_type_ids = (n.past_key_values ? ul : cl)(n.input_ids), n;
  }
}, Or = class extends I {
}, aI = class extends Or {
}, oI = class extends Or {
  /**
   * @param {Object} model_inputs
   * @param {Tensor} model_inputs.input_values Float values of input raw speech waveform.
   * @param {Tensor} model_inputs.attention_mask Mask to avoid performing convolution and attention on padding token indices. Mask values selected in [0, 1]
   */
  async _call(e) {
    return new Lr(await super._call(e));
  }
}, iI = class extends Or {
  /**
   * Calls the model on new inputs.
   * @param {Object} model_inputs The inputs to the model.
   * @returns {Promise<SequenceClassifierOutput>} An object containing the model's output logits for sequence classification.
   */
  async _call(e) {
    return new ae(await super._call(e));
  }
}, lI = class extends Or {
  /**
   * Calls the model on new inputs.
   * @param {Object} model_inputs The inputs to the model.
   * @returns {Promise<TokenClassifierOutput>} An object containing the model's output logits for sequence classification.
   */
  async _call(e) {
    return new He(await super._call(e));
  }
}, cI = class extends I {
}, uI = class extends Or {
}, dI = class extends Or {
  /**
   * @param {Object} model_inputs
   * @param {Tensor} model_inputs.input_values Float values of input raw speech waveform.
   * @param {Tensor} model_inputs.attention_mask Mask to avoid performing convolution and attention on padding token indices. Mask values selected in [0, 1]
   */
  async _call(e) {
    return new Lr(await super._call(e));
  }
}, hI = class extends Or {
  /**
   * Calls the model on new inputs.
   * @param {Object} model_inputs The inputs to the model.
   * @returns {Promise<SequenceClassifierOutput>} An object containing the model's output logits for sequence classification.
   */
  async _call(e) {
    return new ae(await super._call(e));
  }
}, bc = class extends I {
}, fI = class extends bc {
}, _I = class extends bc {
}, uw = class extends nr {
  forward_params = [
    "input_ids",
    "attention_mask",
    "pixel_values",
    "pixel_attention_mask",
    "position_ids",
    "past_key_values"
  ];
}, Mc = class extends I {
}, pI = class extends Mc {
}, mI = class extends Mc {
  /**
   * @param {any} model_inputs
   */
  async _call(e) {
    return new ae(await super._call(e));
  }
}, xc = class extends I {
}, gI = class extends xc {
}, wI = class extends xc {
}, Ba = class extends I {
}, vI = class extends Ba {
  async forward(e) {
    let t = !e.input_ids, r = !e.pixel_values;
    if (t && r)
      throw new Error("Either `input_ids` or `pixel_values` should be provided.");
    if (t && (e.input_ids = gt([e.pixel_values.dims[0], 1])), r) {
      let { image_size: l } = this.config.vision_config;
      e.pixel_values = ut([0, 3, l, l], 0);
    }
    let { text_embeddings: n, image_embeddings: s, l2norm_text_embeddings: a, l2norm_image_embeddings: o } = await super.forward(e), i = {};
    return t || (i.text_embeddings = n, i.l2norm_text_embeddings = a), r || (i.image_embeddings = s, i.l2norm_image_embeddings = o), i;
  }
}, dw = class extends Ba {
  /** @type {typeof PreTrainedModel.from_pretrained} */
  static async from_pretrained(e, t = {}) {
    return super.from_pretrained(e, {
      ...t,
      // Update default model file name if not provided
      model_file_name: t.model_file_name ?? "text_model"
    });
  }
}, yI = class extends Ba {
  /** @type {typeof PreTrainedModel.from_pretrained} */
  static async from_pretrained(e, t = {}) {
    return super.from_pretrained(e, {
      ...t,
      // Update default model file name if not provided
      model_file_name: t.model_file_name ?? "vision_model"
    });
  }
}, kc = class extends I {
}, bI = class extends kc {
}, MI = class extends kc {
}, xI = class extends nr {
}, Tc = class extends I {
}, kI = class extends Tc {
}, TI = class extends Tc {
}, EI = class extends nr {
  forward_params = [
    "input_ids",
    "attention_mask",
    "pixel_values",
    "pixel_attention_mask",
    "spatial_shapes",
    "position_ids",
    "past_key_values"
  ];
}, Ec = class extends I {
}, AI = class extends Ec {
}, CI = class extends Ec {
}, hw = class extends I {
}, SI = class extends hw {
}, Ac = class extends I {
}, PI = class extends Ac {
}, FI = class extends Ac {
}, Cc = class extends I {
}, II = class extends Cc {
}, LI = class extends Cc {
}, Sc = class extends I {
}, OI = class extends Sc {
}, NI = class extends Sc {
}, Pc = class extends I {
}, DI = class extends Pc {
}, zI = class extends Pc {
}, Ms = class extends I {
}, BI = class extends Ms {
}, RI = class extends Ms {
}, $I = class extends Ms {
  /**
   * Calls the model on new inputs.
   *
   * @param {Object} model_inputs The inputs to the model.
   * @returns {Promise<SequenceClassifierOutput>} An object containing the model's output logits for sequence classification.
   */
  async _call(e) {
    return new ae(await super._call(e));
  }
}, GI = class extends Ms {
}, fw = class extends I {
}, VI = class extends fw {
}, _w = class extends I {
}, UI = class extends _w {
}, pw = class extends Ve {
  constructor({ char_logits: e, bpe_logits: t, wp_logits: r }) {
    super(), this.char_logits = e, this.bpe_logits = t, this.wp_logits = r;
  }
  get logits() {
    return [this.char_logits, this.bpe_logits, this.wp_logits];
  }
}, mw = class extends I {
}, jI = class extends mw {
  /**
   * @param {any} model_inputs
   */
  async _call(e) {
    return new pw(await super._call(e));
  }
}, gw = class extends Ve {
  /**
   * @param {Object} output The output of the model.
   * @param {Tensor} output.audio_codes Discrete code embeddings, of shape `(batch_size, num_quantizers, codes_length)`.
   */
  constructor({ audio_codes: e }) {
    super(), this.audio_codes = e;
  }
}, ww = class extends Ve {
  /**
   * @param {Object} output The output of the model.
   * @param {Tensor} output.audio_values Decoded audio values, of shape `(batch_size, num_channels, sequence_length)`.
   */
  constructor({ audio_values: e }) {
    super(), this.audio_values = e;
  }
}, Ra = class extends I {
  main_input_name = "input_values";
  forward_params = ["input_values"];
}, WI = class extends Ra {
  /**
   * Encodes the input audio waveform into discrete codes.
   * @param {Object} inputs Model inputs
   * @param {Tensor} [inputs.input_values] Float values of the input audio waveform, of shape `(batch_size, channels, sequence_length)`).
   * @returns {Promise<MimiEncoderOutput>} The output tensor of shape `(batch_size, num_codebooks, sequence_length)`.
   */
  async encode(e) {
    return new gw(await ve(this.sessions.encoder_model, e));
  }
  /**
   * Decodes the given frames into an output audio waveform.
   * @param {MimiEncoderOutput} inputs The encoded audio codes.
   * @returns {Promise<MimiDecoderOutput>} The output tensor of shape `(batch_size, num_channels, sequence_length)`.
   */
  async decode(e) {
    return new ww(await ve(this.sessions.decoder_model, e));
  }
}, vw = class extends Ra {
  /** @type {typeof PreTrainedModel.from_pretrained} */
  static async from_pretrained(e, t = {}) {
    return super.from_pretrained(e, {
      ...t,
      // Update default model file name if not provided
      model_file_name: t.model_file_name ?? "encoder_model"
    });
  }
}, yw = class extends Ra {
  /** @type {typeof PreTrainedModel.from_pretrained} */
  static async from_pretrained(e, t = {}) {
    return super.from_pretrained(e, {
      ...t,
      // Update default model file name if not provided
      model_file_name: t.model_file_name ?? "decoder_model"
    });
  }
}, Fc = class extends I {
}, qI = class extends Fc {
}, HI = class extends Fc {
}, Ic = class extends I {
}, QI = class extends Ic {
}, XI = class extends Ic {
}, Lc = class extends I {
}, YI = class extends Lc {
}, KI = class extends Lc {
}, JI = class extends nr {
}, Oc = class extends I {
}, ZI = class extends Oc {
}, eL = class extends Oc {
}, xs = class extends I {
}, tL = class extends xs {
}, rL = class extends xs {
  /**
   * Calls the model on new inputs.
   *
   * @param {Object} model_inputs The inputs to the model.
   * @returns {Promise<MaskedLMOutput>} returned object
   */
  async _call(e) {
    return new Xe(await super._call(e));
  }
}, nL = class extends xs {
  /**
   * Calls the model on new inputs.
   *
   * @param {Object} model_inputs The inputs to the model.
   * @returns {Promise<SequenceClassifierOutput>} returned object
   */
  async _call(e) {
    return new ae(await super._call(e));
  }
}, sL = class extends xs {
  /**
   * Calls the model on new inputs.
   *
   * @param {Object} model_inputs The inputs to the model.
   * @returns {Promise<QuestionAnsweringModelOutput>} returned object
   */
  async _call(e) {
    return new it(await super._call(e));
  }
}, Nc = class extends I {
}, aL = class extends Nc {
}, oL = class extends Nc {
}, $a = class extends I {
}, iL = class extends $a {
}, lL = class extends $a {
  /**
   * @param {any} model_inputs
   */
  async _call(e) {
    return new ae(await super._call(e));
  }
}, cL = class extends $a {
}, Ga = class extends I {
}, uL = class extends Ga {
}, dL = class extends Ga {
  /**
   * @param {any} model_inputs
   */
  async _call(e) {
    return new ae(await super._call(e));
  }
}, hL = class extends Ga {
}, Va = class extends I {
}, fL = class extends Va {
}, _L = class extends Va {
  /**
   * @param {any} model_inputs
   */
  async _call(e) {
    return new ae(await super._call(e));
  }
}, pL = class extends Va {
}, Ua = class extends I {
}, mL = class extends Ua {
}, gL = class extends Ua {
  /**
   * @param {any} model_inputs
   */
  async _call(e) {
    return new ae(await super._call(e));
  }
}, wL = class extends Ua {
}, Dc = class extends I {
}, vL = class extends Dc {
}, yL = class extends Dc {
  /**
   * @param {any} model_inputs
   */
  async _call(e) {
    return new ae(await super._call(e));
  }
}, zc = class extends I {
}, bL = class extends zc {
}, ML = class extends zc {
  /**
   * @param {any} model_inputs
   */
  async _call(e) {
    return new ae(await super._call(e));
  }
}, ks = class extends I {
}, xL = class extends ks {
}, kL = class extends ks {
  /**
   * Calls the model on new inputs.
   *
   * @param {Object} model_inputs The inputs to the model.
   * @returns {Promise<MaskedLMOutput>} An object containing the model's output logits for masked language modeling.
   */
  async _call(e) {
    return new Xe(await super._call(e));
  }
}, TL = class extends ks {
  /**
   * Calls the model on new inputs.
   *
   * @param {Object} model_inputs The inputs to the model.
   * @returns {Promise<SequenceClassifierOutput>} An object containing the model's output logits for sequence classification.
   */
  async _call(e) {
    return new ae(await super._call(e));
  }
}, EL = class extends ks {
  /**
   * Calls the model on new inputs.
   *
   * @param {Object} model_inputs The inputs to the model.
   * @returns {Promise<TokenClassifierOutput>} An object containing the model's output logits for token classification.
   */
  async _call(e) {
    return new He(await super._call(e));
  }
}, Bc = class extends I {
}, AL = class extends Bc {
}, CL = class extends Bc {
}, Rc = class extends I {
  requires_attention_mask = !1;
  main_input_name = "input_values";
  forward_params = ["input_values", "decoder_input_ids", "past_key_values"];
}, SL = class extends Rc {
}, PL = class extends Rc {
}, Bn = class extends I {
}, FL = class extends Bn {
}, IL = class extends Bn {
  /**
   * Calls the model on new inputs.
   *
   * @param {Object} model_inputs The inputs to the model.
   * @returns {Promise<MaskedLMOutput>} An object containing the model's output logits for masked language modeling.
   */
  async _call(e) {
    return new Xe(await super._call(e));
  }
}, LL = class extends Bn {
  /**
   * Calls the model on new inputs.
   *
   * @param {Object} model_inputs The inputs to the model.
   * @returns {Promise<SequenceClassifierOutput>} An object containing the model's output logits for sequence classification.
   */
  async _call(e) {
    return new ae(await super._call(e));
  }
}, OL = class extends Bn {
  /**
   * Calls the model on new inputs.
   *
   * @param {Object} model_inputs The inputs to the model.
   * @returns {Promise<TokenClassifierOutput>} An object containing the model's output logits for token classification.
   */
  async _call(e) {
    return new He(await super._call(e));
  }
}, NL = class extends Bn {
  /**
   * Calls the model on new inputs.
   *
   * @param {Object} model_inputs The inputs to the model.
   * @returns {Promise<QuestionAnsweringModelOutput>} An object containing the model's output logits for question answering.
   */
  async _call(e) {
    return new it(await super._call(e));
  }
}, $c = class extends I {
}, DL = class extends $c {
}, zL = class extends $c {
}, Gc = class extends I {
}, BL = class extends Gc {
}, RL = class extends Gc {
}, bw = class extends I {
}, $L = class extends bw {
  forward_params = [
    // prepare_inputs_embeds
    "input_ids",
    "pixel_values",
    "images_seq_mask",
    "images_emb_mask",
    // language_model
    "attention_mask",
    "position_ids",
    "past_key_values"
  ];
  /**
   * @param {ConstructorParameters<typeof MultiModalityPreTrainedModel>} args
   */
  constructor(...e) {
    super(...e), this._generation_mode = "text";
  }
  async forward(e) {
    let t = this._generation_mode ?? "text", r;
    if (t === "text" || !e.past_key_values) {
      let i = this.sessions.prepare_inputs_embeds, l = et(e, i.inputNames);
      r = await ve(i, l);
    } else {
      let i = this.sessions.gen_img_embeds, l = et(
        {
          image_ids: e.input_ids
        },
        i.inputNames
      );
      r = await ve(i, l);
    }
    let n = { ...e, ...r }, s = await _r(this, n), a = this.sessions[t === "text" ? "lm_head" : "gen_head"];
    if (!a)
      throw new Error(`Unable to find "${a}" generation head`);
    let o = await ve(a, et(s, a.inputNames));
    return {
      ...r,
      ...s,
      ...o
    };
  }
  prepare_inputs_for_generation(e, t, r) {
    let n = !!t.past_key_values;
    return gs(this, t, 1n), r.guidance_scale !== null && r.guidance_scale > 1 && (n ? t.input_ids = De([t.input_ids, t.input_ids], 0) : (t.input_ids = De(
      [t.input_ids, Ri(t.input_ids, BigInt(r.pad_token_id))],
      0
    ), t.attention_mask = De(
      [t.attention_mask, Ri(t.attention_mask, 0n)],
      0
    ))), (n || !t.pixel_values) && (t.pixel_values = ut([0, 0, 3, 384, 384], 1)), n && (t.images_seq_mask = new V(
      "bool",
      new Array(1).fill(!0).fill(!1, 0, 1),
      [1, 1]
    ), t.images_emb_mask = new V("bool", new Array(0).fill(!1), [
      1,
      1,
      0
    ])), t;
  }
  /**
   * @param {import('../../generation/parameters.js').GenerationFunctionParameters} options
   */
  async generate(e) {
    return this._generation_mode = "text", super.generate(e);
  }
  /**
   * @param {import('../../generation/parameters.js').GenerationFunctionParameters} options
   */
  async generate_images(e) {
    this._generation_mode = "image";
    let t = (
      /** @type {Tensor} */
      (e.inputs ?? e[this.main_input_name]).dims[1]
    ), n = (
      /** @type {Tensor} */
      (await super.generate(e)).slice(null, [t, null])
    ), s = this.sessions.image_decode, { decoded_image: a } = await ve(s, {
      generated_tokens: n
    }), o = a.add_(1).mul_(255 / 2).clamp_(0, 255).to("uint8"), i = [];
    for (let l of o) {
      let c = kt.fromTensor(l);
      i.push(c);
    }
    return i;
  }
}, Vc = class extends I {
}, GL = class extends Vc {
}, VL = class extends Vc {
}, Mw = class extends I {
  // NOTE: not MusicgenPreTrainedModel
  forward_params = [
    "input_ids",
    "attention_mask",
    "encoder_outputs",
    "decoder_input_ids",
    "decoder_attention_mask",
    "past_key_values"
  ];
  /**
   * Apply the pattern mask to the final ids,
   * then revert the pattern delay mask by filtering the pad token id in a single step.
   * @param {Tensor} outputs The output tensor from the model.
   * @returns {Tensor} The filtered output tensor.
   */
  _apply_and_filter_by_delay_pattern_mask(e) {
    let [t, r] = e.dims, n = this.config.decoder.num_codebooks, s = r - n, a = 0;
    for (let l = 0; l < e.size; ++l) {
      if (e.data[l] == this.config.decoder.pad_token_id)
        continue;
      let c = l % r, d = Math.floor(l / r) % n, h = c - d;
      h > 0 && h <= s && (e.data[a++] = e.data[l]);
    }
    let o = Math.floor(t / n), i = a / (o * n);
    return new V(e.type, e.data.slice(0, a), [o, n, i]);
  }
  prepare_inputs_for_generation(e, t, r) {
    let n = BigInt(this.config.decoder.pad_token_id), s = structuredClone(e);
    for (let a = 0; a < s.length; ++a)
      for (let o = 0; o < s[a].length; ++o)
        a % this.config.decoder.num_codebooks >= o && (s[a][o] = n);
    return r.guidance_scale !== null && r.guidance_scale > 1 && (s = s.concat(s)), ba(this, s, t, r);
  }
  /**
   * Generates sequences of token ids for models with a language modeling head.
   * @param {import('../../generation/parameters.js').GenerationFunctionParameters} options
   * @returns {Promise<ModelOutput|Tensor>} The output of the model, which can contain the generated token ids, attentions, and scores.
   */
  async generate(e) {
    let t = await super.generate(e), r = this._apply_and_filter_by_delay_pattern_mask(
      /** @type {Tensor} */
      t
    ).unsqueeze_(
      0
    ), { audio_values: n } = await ve(this.sessions.encodec_decode, { audio_codes: r });
    return n;
  }
}, Uc = class extends I {
}, UL = class extends Uc {
}, jL = class extends Uc {
}, jc = class extends I {
}, WL = class extends jc {
}, qL = class extends jc {
}, Rn = class extends I {
}, HL = class extends Rn {
}, QL = class extends Rn {
  /**
   * Calls the model on new inputs.
   *
   * @param {Object} model_inputs The inputs to the model.
   * @returns {Promise<MaskedLMOutput>} An object containing the model's output logits for masked language modeling.
   */
  async _call(e) {
    return new Xe(await super._call(e));
  }
}, XL = class extends Rn {
  /**
   * Calls the model on new inputs.
   *
   * @param {Object} model_inputs The inputs to the model.
   * @returns {Promise<SequenceClassifierOutput>} An object containing the model's output logits for sequence classification.
   */
  async _call(e) {
    return new ae(await super._call(e));
  }
}, YL = class extends Rn {
  /**
   * Calls the model on new inputs.
   *
   * @param {Object} model_inputs The inputs to the model.
   * @returns {Promise<TokenClassifierOutput>} An object containing the model's output logits for token classification.
   */
  async _call(e) {
    return new He(await super._call(e));
  }
}, KL = class extends Rn {
  /**
   * Calls the model on new inputs.
   *
   * @param {Object} model_inputs The inputs to the model.
   * @returns {Promise<QuestionAnsweringModelOutput>} An object containing the model's output logits for question answering.
   */
  async _call(e) {
    return new it(await super._call(e));
  }
}, xw = class extends I {
}, JL = class extends xw {
}, Wc = class extends I {
}, ZL = class extends Wc {
}, eO = class extends Wc {
}, qc = class extends I {
}, tO = class extends qc {
}, rO = class extends qc {
}, Hc = class extends I {
}, nO = class extends Hc {
}, sO = class extends Hc {
}, Qc = class extends I {
}, aO = class extends Qc {
}, oO = class extends Qc {
}, Xc = class extends I {
}, iO = class extends Xc {
}, lO = class extends Xc {
  /**
   * Calls the model on new inputs.
   *
   * @param {Object} model_inputs The inputs to the model.
   * @returns {Promise<SequenceClassifierOutput>} An object containing the model's output logits for sequence classification.
   */
  async _call(e) {
    return new ae(await super._call(e));
  }
}, Yc = class extends I {
}, cO = class extends Yc {
}, uO = class extends Yc {
}, Kc = class extends I {
}, dO = class extends Kc {
}, hO = class extends Kc {
}, Jc = class extends I {
}, fO = class extends Jc {
}, _O = class extends Jc {
}, Zc = class extends I {
}, pO = class extends Zc {
}, mO = class extends Zc {
}, gO = class extends nr {
}, kw = class extends I {
}, wO = class extends kw {
  /**
   * @param {Object} model_inputs
   * @param {Tensor} model_inputs.input_values Float values of input raw speech waveform.
   * @param {Tensor} model_inputs.attention_mask Mask to avoid performing convolution and attention on padding token indices. Mask values selected in [0, 1]
   */
  async _call(e) {
    return new Lr(await super._call(e));
  }
}, eu = class extends I {
}, vO = class extends eu {
}, yO = class extends eu {
}, tu = class extends I {
}, bO = class extends tu {
}, MO = class extends tu {
}, ru = class extends I {
}, xO = class extends ru {
}, kO = class extends ru {
}, nu = class extends I {
}, TO = class extends nu {
}, EO = class extends nu {
}, Tw = class extends I {
  forward_params = [
    "input_ids",
    "inputs_embeds",
    "attention_mask",
    "position_ids",
    "pixel_values",
    "image_sizes",
    "past_key_values"
  ];
}, Ew = class extends Tw {
  async forward({
    // Produced by the tokenizer/processor:
    input_ids: e = null,
    attention_mask: t = null,
    pixel_values: r = null,
    image_sizes: n = null,
    // Used during generation:
    position_ids: s = null,
    inputs_embeds: a = null,
    past_key_values: o = null,
    // Generic generation parameters
    generation_config: i = null,
    logits_processor: l = null,
    num_logits_to_keep: c = null,
    // TODO: needed?
    ...d
  }) {
    if (!a) {
      let _;
      if (r && e.dims[1] !== 1) {
        if (!n)
          throw new Error("`image_sizes` must be provided when `pixel_values` is provided.");
        ({ image_features: _ } = await ve(this.sessions.vision_encoder, {
          pixel_values: r,
          image_sizes: n
        }));
      } else {
        let p = this.config.normalized_config.hidden_size;
        _ = new V("float32", [], [0, p]);
      }
      ({ inputs_embeds: a } = await ve(this.sessions.prepare_inputs_embeds, {
        input_ids: e,
        image_features: _
      }));
    }
    return await _r(
      this,
      {
        inputs_embeds: a,
        past_key_values: o,
        attention_mask: t,
        position_ids: s,
        generation_config: i,
        logits_processor: l,
        num_logits_to_keep: c
      },
      !1
    );
  }
}, su = class extends I {
}, AO = class extends su {
}, CO = class extends su {
  /**
   * @param {any} model_inputs
   */
  async _call(e) {
    return new ae(await super._call(e));
  }
}, au = class extends I {
}, SO = class extends au {
}, PO = class extends au {
  /**
   * Calls the model on new inputs.
   * @param {Object} model_inputs The inputs to the model.
   * @returns {Promise<TokenClassifierOutput>} An object containing the model's output logits for sequence classification.
   */
  async _call(e) {
    return new He(await super._call(e));
  }
}, ou = class extends I {
}, FO = class extends ou {
}, IO = class extends ou {
}, iu = class extends I {
}, LO = class extends iu {
}, OO = class extends iu {
}, lu = class extends I {
}, NO = class extends lu {
}, DO = class extends lu {
}, cu = class extends I {
}, zO = class extends cu {
}, BO = class extends cu {
}, uu = class extends I {
}, RO = class extends uu {
}, $O = class extends uu {
}, du = class extends ic {
}, Aw = class extends ow {
}, GO = class extends du {
}, VO = class extends Aw {
}, hu = class extends du {
}, Cw = class extends hu {
}, UO = class extends hu {
}, jO = class extends Cw {
}, fu = class extends I {
}, WO = class extends fu {
}, qO = class extends fu {
  /**
   * @param {any} model_inputs
   */
  async _call(e) {
    return new ae(await super._call(e));
  }
}, _u = class extends I {
}, HO = class extends _u {
}, QO = class extends _u {
  /**
   * @param {any} model_inputs
   */
  async _call(e) {
    return new Sw(await super._call(e));
  }
}, Sw = class extends vs {
}, $n = class extends I {
}, XO = class extends $n {
}, YO = class extends $n {
  /**
   * Calls the model on new inputs.
   *
   * @param {Object} model_inputs The inputs to the model.
   * @returns {Promise<MaskedLMOutput>} returned object
   */
  async _call(e) {
    return new Xe(await super._call(e));
  }
}, KO = class extends $n {
  /**
   * Calls the model on new inputs.
   *
   * @param {Object} model_inputs The inputs to the model.
   * @returns {Promise<SequenceClassifierOutput>} returned object
   */
  async _call(e) {
    return new ae(await super._call(e));
  }
}, JO = class extends $n {
  /**
   * Calls the model on new inputs.
   *
   * @param {Object} model_inputs The inputs to the model.
   * @returns {Promise<TokenClassifierOutput>} An object containing the model's output logits for token classification.
   */
  async _call(e) {
    return new He(await super._call(e));
  }
}, ZO = class extends $n {
  /**
   * Calls the model on new inputs.
   *
   * @param {Object} model_inputs The inputs to the model.
   * @returns {Promise<QuestionAnsweringModelOutput>} returned object
   */
  async _call(e) {
    return new it(await super._call(e));
  }
}, Gn = class extends I {
}, eN = class extends Gn {
}, tN = class extends Gn {
  /**
   * Calls the model on new inputs.
   *
   * @param {Object} model_inputs The inputs to the model.
   * @returns {Promise<MaskedLMOutput>} An object containing the model's output logits for masked language modeling.
   */
  async _call(e) {
    return new Xe(await super._call(e));
  }
}, rN = class extends Gn {
  /**
   * Calls the model on new inputs.
   *
   * @param {Object} model_inputs The inputs to the model.
   * @returns {Promise<SequenceClassifierOutput>} An object containing the model's output logits for sequence classification.
   */
  async _call(e) {
    return new ae(await super._call(e));
  }
}, nN = class extends Gn {
  /**
   * Calls the model on new inputs.
   *
   * @param {Object} model_inputs The inputs to the model.
   * @returns {Promise<TokenClassifierOutput>} An object containing the model's output logits for token classification.
   */
  async _call(e) {
    return new He(await super._call(e));
  }
}, sN = class extends Gn {
  /**
   * Calls the model on new inputs.
   *
   * @param {Object} model_inputs The inputs to the model.
   * @returns {Promise<QuestionAnsweringModelOutput>} An object containing the model's output logits for question answering.
   */
  async _call(e) {
    return new it(await super._call(e));
  }
}, pu = class extends I {
}, aN = class extends pu {
}, oN = class extends pu {
  /**
   * @param {any} model_inputs
   */
  async _call(e) {
    return new Pw(await super._call(e));
  }
}, Pw = class extends vs {
}, Fw = class extends Ve {
  /**
   * @param {Object} output The output of the model.
   * @param {Tensor} output.iou_scores The output logits of the model.
   * @param {Tensor} output.pred_masks Predicted boxes.
   */
  constructor({ iou_scores: e, pred_masks: t }) {
    super(), this.iou_scores = e, this.pred_masks = t;
  }
}, Iw = class extends I {
}, iN = class extends Iw {
  /**
   * Compute image embeddings and positional image embeddings, given the pixel values of an image.
   * @param {Object} model_inputs Object containing the model inputs.
   * @param {Tensor} model_inputs.pixel_values Pixel values obtained using a `SamProcessor`.
   * @returns {Promise<{ image_embeddings: Tensor, image_positional_embeddings: Tensor }>} The image embeddings and positional image embeddings.
   */
  async get_image_embeddings({ pixel_values: e }) {
    return await Ir(this, { pixel_values: e });
  }
  /**
   * @typedef {Object} SamModelInputs Object containing the model inputs.
   * @property {Tensor} pixel_values Pixel values as a Tensor with shape `(batch_size, num_channels, height, width)`.
   * These can be obtained using a `SamProcessor`.
   * @property {Tensor} [input_points] Input 2D spatial points with shape `(batch_size, num_points, 2)`.
   * This is used by the prompt encoder to encode the prompt.
   * @property {Tensor} [input_labels] Input labels for the points, as a Tensor of shape `(batch_size, point_batch_size, num_points)`.
   * This is used by the prompt encoder to encode the prompt. There are 4 types of labels:
   *  - `1`: the point is a point that contains the object of interest
   *  - `0`: the point is a point that does not contain the object of interest
   *  - `-1`: the point corresponds to the background
   *  - `-10`: the point is a padding point, thus should be ignored by the prompt encoder
   * @property {Tensor} [input_boxes] Input bounding boxes with shape `(batch_size, num_boxes, 4)`.
   * @property {Tensor} [image_embeddings] Image embeddings used by the mask decoder.
   * @property {Tensor} [image_positional_embeddings] Image positional embeddings used by the mask decoder.
   */
  /**
   * @param {SamModelInputs} model_inputs Object containing the model inputs.
   * @returns {Promise<Object>} The output of the model.
   */
  async forward(e) {
    !e.image_embeddings || !e.image_positional_embeddings ? e = {
      ...e,
      ...await this.get_image_embeddings(e)
    } : e = { ...e }, e.input_labels ??= gt(e.input_points.dims.slice(0, -1));
    let t = {
      image_embeddings: e.image_embeddings,
      image_positional_embeddings: e.image_positional_embeddings
    };
    return e.input_points && (t.input_points = e.input_points), e.input_labels && (t.input_labels = e.input_labels), e.input_boxes && (t.input_boxes = e.input_boxes), await ve(this.sessions.prompt_encoder_mask_decoder, t);
  }
  /**
   * Runs the model with the provided inputs
   * @param {Object} model_inputs Model inputs
   * @returns {Promise<SamImageSegmentationOutput>} Object containing segmentation outputs
   */
  async _call(e) {
    return new Fw(await super._call(e));
  }
}, Lw = class extends Ve {
  /**
   * @param {Object} output The output of the model.
   * @param {Tensor} output.iou_scores The output logits of the model.
   * @param {Tensor} output.pred_masks Predicted boxes.
   * @param {Tensor} output.object_score_logits Logits for the object score, indicating if an object is present.
   */
  constructor({ iou_scores: e, pred_masks: t, object_score_logits: r }) {
    super(), this.iou_scores = e, this.pred_masks = t, this.object_score_logits = r;
  }
}, Ow = class extends I {
}, mu = class extends Ow {
  /**
   * Compute image embeddings and positional image embeddings, given the pixel values of an image.
   * @param {Object} model_inputs Object containing the model inputs.
   * @param {Tensor} model_inputs.pixel_values Pixel values obtained using a `Sam2Processor`.
   * @returns {Promise<Record<String, Tensor>>} The image embeddings.
   */
  async get_image_embeddings({ pixel_values: e }) {
    return await Ir(this, { pixel_values: e });
  }
  async forward(e) {
    let { num_feature_levels: t } = this.config.vision_config;
    if (Array.from({ length: t }, (a, o) => `image_embeddings.${o}`).some((a) => !e[a]) ? e = {
      ...e,
      ...await this.get_image_embeddings(e)
    } : e = { ...e }, e.input_points) {
      if (e.input_boxes && e.input_boxes.dims[1] !== 1)
        throw new Error(
          "When both `input_points` and `input_boxes` are provided, the number of boxes per image must be 1."
        );
      let a = e.input_points.dims;
      e.input_labels ??= gt(a.slice(0, -1)), e.input_boxes ??= ut([a[0], 0, 4], 0);
    } else if (e.input_boxes) {
      let a = e.input_boxes.dims;
      e.input_labels = ut([a[0], a[1], 0], -1n), e.input_points = ut([a[0], 1, 0, 2], 0);
    } else
      throw new Error("At least one of `input_points` or `input_boxes` must be provided.");
    let n = this.sessions.prompt_encoder_mask_decoder, s = et(e, n.inputNames);
    return await ve(n, s);
  }
  /**
   * Runs the model with the provided inputs
   * @param {Object} model_inputs Model inputs
   * @returns {Promise<Sam2ImageSegmentationOutput>} Object containing segmentation outputs
   */
  async _call(e) {
    return new Lw(await super._call(e));
  }
}, lN = class extends mu {
}, cN = class extends mu {
}, ja = class extends I {
}, uN = class extends ja {
}, dN = class extends ja {
}, hN = class extends ja {
}, Wa = class extends I {
}, fN = class extends Wa {
}, _N = class extends Wa {
}, pN = class extends Wa {
}, gu = class extends I {
}, mN = class extends gu {
}, Nw = class extends gu {
  /** @type {typeof PreTrainedModel.from_pretrained} */
  static async from_pretrained(e, t = {}) {
    return super.from_pretrained(e, {
      ...t,
      // Update default model file name if not provided
      model_file_name: t.model_file_name ?? "text_model"
    });
  }
}, gN = class extends nn {
  /** @type {typeof PreTrainedModel.from_pretrained} */
  static async from_pretrained(e, t = {}) {
    return super.from_pretrained(e, {
      ...t,
      // Update default model file name if not provided
      model_file_name: t.model_file_name ?? "vision_model"
    });
  }
}, wu = class extends I {
}, wN = class extends wu {
}, vN = class extends wu {
}, yN = class extends uw {
}, qa = class extends I {
  main_input_name = "input_values";
  forward_params = ["input_values"];
}, bN = class extends qa {
  /**
   * Encodes the input audio waveform into discrete codes.
   * @param {Object} inputs Model inputs
   * @param {Tensor} [inputs.input_values] Float values of the input audio waveform, of shape `(batch_size, channels, sequence_length)`).
   * @returns {Promise<Record<string, Tensor>>} The output tensors of shape `(batch_size, num_codebooks, sequence_length)`.
   */
  async encode(e) {
    return await ve(this.sessions.encoder_model, e);
  }
  /**
   * Decodes the given frames into an output audio waveform.
   * @param {Record<string, Tensor>} inputs The encoded audio codes.
   * @returns {Promise<{audio_values: Tensor}>} The output tensor of shape `(batch_size, num_channels, sequence_length)`.
   */
  async decode(e) {
    return await ve(this.sessions.decoder_model, e);
  }
}, Dw = class extends qa {
  /** @type {typeof PreTrainedModel.from_pretrained} */
  static async from_pretrained(e, t = {}) {
    return super.from_pretrained(e, {
      ...t,
      // Update default model file name if not provided
      model_file_name: t.model_file_name ?? "encoder_model"
    });
  }
}, zw = class extends qa {
  /** @type {typeof PreTrainedModel.from_pretrained} */
  static async from_pretrained(e, t = {}) {
    return super.from_pretrained(e, {
      ...t,
      // Update default model file name if not provided
      model_file_name: t.model_file_name ?? "decoder_model"
    });
  }
}, vu = class extends I {
}, MN = class extends vu {
}, xN = class extends vu {
}, Ha = class extends I {
}, kN = class extends Ha {
}, TN = class extends Ha {
}, EN = class extends Ha {
  /**
   * @typedef {Object} SpeechOutput
   * @property {Tensor} [spectrogram] The predicted log-mel spectrogram of shape
   * `(output_sequence_length, config.num_mel_bins)`. Returned when no `vocoder` is provided
   * @property {Tensor} [waveform] The predicted waveform of shape `(num_frames,)`. Returned when a `vocoder` is provided.
   * @property {Tensor} [cross_attentions] The outputs of the decoder's cross-attention layers of shape
   * `(config.decoder_layers, config.decoder_attention_heads, output_sequence_length, input_sequence_length)`. returned when `output_cross_attentions` is `true`.
   */
  /**
   * Converts a sequence of input tokens into a sequence of mel spectrograms, which are subsequently turned into a speech waveform using a vocoder.
   * @param {Tensor} input_values Indices of input sequence tokens in the vocabulary.
   * @param {Tensor} speaker_embeddings Tensor containing the speaker embeddings.
   * @param {Object} options Optional parameters for generating speech.
   * @param {number} [options.threshold=0.5] The generated sequence ends when the predicted stop token probability exceeds this value.
   * @param {number} [options.minlenratio=0.0] Used to calculate the minimum required length for the output sequence.
   * @param {number} [options.maxlenratio=20.0] Used to calculate the maximum allowed length for the output sequence.
   * @param {Object} [options.vocoder=null] The vocoder that converts the mel spectrogram into a speech waveform. If `null`, the output is the mel spectrogram.
   * @param {boolean} [options.output_cross_attentions=false] Whether to return attention tensors from the decoder's cross-attention layers.
   * @returns {Promise<SpeechOutput>} A promise which resolves to an object containing the spectrogram, waveform, and cross-attention tensors.
   */
  async generate_speech(e, t, {
    threshold: r = 0.5,
    minlenratio: n = 0,
    maxlenratio: s = 20,
    vocoder: a = null
    // output_cross_attentions = false, // TODO add
  } = {}) {
    let o = {
      input_ids: e
    }, { encoder_outputs: i, encoder_attention_mask: l } = await Ir(this, o), c = i.dims[1] / this.config.reduction_factor, d = Math.floor(c * s), h = Math.floor(c * n), _ = this.config.num_mel_bins, p = [], w = null, v = null, y = 0;
    for (; ; ) {
      ++y;
      let A = Ag(!!v), E;
      v ? E = v.output_sequence_out : E = new V("float32", new Float32Array(_), [1, 1, _]);
      let C = {
        use_cache_branch: A,
        output_sequence: E,
        encoder_attention_mask: l,
        speaker_embeddings: t,
        encoder_hidden_states: i
      };
      Ml(this, C, w), v = await ve(this.sessions.decoder_model_merged, C), w = qi(v, w);
      let { prob: N, spectrum: M } = v;
      if (p.push(M), y >= h && // Finished when stop token or maximum length is reached.
      (Array.from(N.data).filter(($) => $ >= r).length > 0 || y >= d))
        break;
    }
    let b = De(p), { waveform: k } = await ve(a.sessions.model, { spectrogram: b });
    return {
      spectrogram: b,
      waveform: k
      // cross_attentions: null, // TODO add
    };
  }
}, AN = class extends I {
  main_input_name = "spectrogram";
}, Ts = class extends I {
}, CN = class extends Ts {
}, SN = class extends Ts {
  /**
   * Calls the model on new inputs.
   *
   * @param {Object} model_inputs The inputs to the model.
   * @returns {Promise<MaskedLMOutput>} returned object
   */
  async _call(e) {
    return new Xe(await super._call(e));
  }
}, PN = class extends Ts {
  /**
   * Calls the model on new inputs.
   *
   * @param {Object} model_inputs The inputs to the model.
   * @returns {Promise<SequenceClassifierOutput>} returned object
   */
  async _call(e) {
    return new ae(await super._call(e));
  }
}, FN = class extends Ts {
  /**
   * Calls the model on new inputs.
   *
   * @param {Object} model_inputs The inputs to the model.
   * @returns {Promise<QuestionAnsweringModelOutput>} returned object
   */
  async _call(e) {
    return new it(await super._call(e));
  }
}, yu = class extends I {
}, IN = class extends yu {
}, LN = class extends yu {
}, bu = class extends I {
}, ON = class extends bu {
}, NN = class extends bu {
}, Bw = class extends I {
}, DN = class extends Bw {
}, Rw = class extends I {
}, $w = class extends Rw {
  async generate_speech({
    // Required inputs
    input_ids: e,
    attention_mask: t,
    style: r,
    // Optional inputs
    num_inference_steps: n = 5,
    speed: s = 1.05
  }) {
    let { sampling_rate: a, chunk_compress_factor: o, base_chunk_size: i, latent_dim: l } = this.config, { last_hidden_state: c, durations: d } = await ve(this.sessions.text_encoder, {
      input_ids: e,
      attention_mask: t,
      style: r
    }), h = d.div(s).mul_(a), _ = i * o, p = (
      /** @type {Float32Array} */
      h.data
    ), w = Int32Array.from(p, (R) => Math.ceil(R / _)), v = Math.max(...w), y = e.dims[0], b = new BigInt64Array(y * v);
    for (let R = 0; R < y; ++R)
      b.fill(1n, R * v, R * v + w[R]);
    let k = new V("int64", b, [y, v]), A = l * o, E = A * v, C = XT([y, A, v]), N = (
      /** @type {Float32Array} */
      C.data
    );
    for (let R = 0; R < y; ++R)
      if (w[R] !== v)
        for (let W = 0; W < A; ++W)
          N.fill(
            0,
            R * E + W * v + w[R],
            R * E + (W + 1) * v
          );
    let M = ut([y], n);
    for (let R = 0; R < n; ++R) {
      let W = ut([y], R);
      ({ denoised_latents: C } = await ve(this.sessions.latent_denoiser, {
        style: r,
        noisy_latents: C,
        latent_mask: k,
        encoder_outputs: c,
        attention_mask: t,
        timestep: W,
        num_inference_steps: M
      }));
    }
    let { waveform: $ } = await ve(this.sessions.voice_decoder, {
      latents: C
    });
    return {
      waveform: $,
      durations: h
    };
  }
}, Qa = class extends I {
}, zN = class extends Qa {
}, BN = class extends Qa {
  /**
   * @param {any} model_inputs
   */
  async _call(e) {
    return new ae(await super._call(e));
  }
}, RN = class extends Qa {
}, Mu = class extends I {
}, $N = class extends Mu {
}, GN = class extends Mu {
}, xu = class extends I {
  forward_params = [
    "input_ids",
    "attention_mask",
    "encoder_outputs",
    "decoder_input_ids",
    "decoder_attention_mask",
    "past_key_values"
  ];
}, VN = class extends xu {
}, UN = class extends xu {
}, ku = class extends I {
}, jN = class extends ku {
}, WN = class extends ku {
  /**
   * @param {any} model_inputs
   */
  async _call(e) {
    return new Gw(await super._call(e));
  }
}, Gw = class extends Wl {
}, Vw = class extends I {
}, qN = class extends Vw {
}, Xa = class extends I {
}, HN = class extends Xa {
}, QN = class extends Xa {
  /**
   * @param {Object} model_inputs
   * @param {Tensor} model_inputs.input_values Float values of input raw speech waveform.
   * @param {Tensor} model_inputs.attention_mask Mask to avoid performing convolution and attention on padding token indices. Mask values selected in [0, 1]
   */
  async _call(e) {
    return new Lr(await super._call(e));
  }
}, XN = class extends Xa {
  /**
   * Calls the model on new inputs.
   * @param {Object} model_inputs The inputs to the model.
   * @returns {Promise<SequenceClassifierOutput>} An object containing the model's output logits for sequence classification.
   */
  async _call(e) {
    return new ae(await super._call(e));
  }
}, Es = class extends I {
}, YN = class extends Es {
}, KN = class extends Es {
  /**
   * @param {Object} model_inputs
   * @param {Tensor} model_inputs.input_values Float values of input raw speech waveform.
   * @param {Tensor} model_inputs.attention_mask Mask to avoid performing convolution and attention on padding token indices. Mask values selected in [0, 1]
   */
  async _call(e) {
    return new Lr(await super._call(e));
  }
}, JN = class extends Es {
  /**
   * Calls the model on new inputs.
   * @param {Object} model_inputs The inputs to the model.
   * @returns {Promise<SequenceClassifierOutput>} An object containing the model's output logits for sequence classification.
   */
  async _call(e) {
    return new ae(await super._call(e));
  }
}, ZN = class extends Es {
  /**
   * Calls the model on new inputs.
   * @param {Object} model_inputs The inputs to the model.
   * @returns {Promise<TokenClassifierOutput>} An object containing the model's output logits for sequence classification.
   */
  async _call(e) {
    return new He(await super._call(e));
  }
}, Tu = class extends I {
}, eD = class extends Tu {
}, tD = class extends Tu {
}, rD = class extends I {
  main_input_name = "pixel_values";
  forward_params = [
    // Encoder inputs
    "pixel_values",
    // Decoder inpputs
    "decoder_input_ids",
    "encoder_hidden_states",
    "past_key_values"
  ];
}, Eu = class extends I {
}, nD = class extends Eu {
}, sD = class extends Eu {
  /**
   * @param {any} model_inputs
   */
  async _call(e) {
    return new ae(await super._call(e));
  }
}, Uw = class extends I {
}, aD = class extends Uw {
}, Au = class extends I {
}, oD = class extends Au {
}, iD = class extends Au {
  /**
   * @param {any} model_inputs
   */
  async _call(e) {
    return new ae(await super._call(e));
  }
}, jw = class extends I {
}, lD = class extends jw {
  /**
   * @param {any} model_inputs
   */
  async _call(e) {
    return new vg(await super._call(e));
  }
}, Ww = class extends I {
}, cD = class extends Ww {
}, qw = class extends Ve {
  /**
   * @typedef {import('../../utils/tensor.js').Tensor} Tensor
   */
  /**
   * @param {Object} output The output of the model.
   * @param {Tensor} output.waveform The final audio waveform predicted by the model, of shape `(batch_size, sequence_length)`.
   * @param {Tensor} output.spectrogram The log-mel spectrogram predicted at the output of the flow model.
   * This spectrogram is passed to the Hi-Fi GAN decoder model to obtain the final audio waveform.
   */
  constructor({ waveform: e, spectrogram: t }) {
    super(), this.waveform = e, this.spectrogram = t;
  }
}, Hw = class extends I {
}, uD = class extends Hw {
  /**
   * Calls the model on new inputs.
   * @param {Object} model_inputs The inputs to the model.
   * @returns {Promise<VitsModelOutput>} The outputs for the VITS model.
   */
  async _call(e) {
    return new qw(await super._call(e));
  }
}, dD = class extends gc {
}, Cp = 2, hD = 1, Fi = /* @__PURE__ */ new WeakMap();
function fD(e, t) {
  let { text_config: r, audio_config: n } = (
    /** @type {any} */
    e.config
  ), s = e.sessions.audio_encoder, { num_mel_bins: a, hidden_size: o } = n, i = a + o, l = new yl(), c = Pa(n), d = { batch_size: 1 }, h = "float32";
  for (let v of s.inputMetadata) {
    if (v.name === "past_padding_cache") {
      h = v.type;
      continue;
    }
    if (!c.has(v.name)) continue;
    let y = Cg(v.shape, d), b = y.reduce((A, E) => A * E, 1), k = us[v.type];
    l[v.name] = new V(v.type, new k(b), y);
  }
  let _ = us[h], p = new V(h, new _(i * Cp), [
    1,
    i,
    Cp
  ]), w = t[Symbol.asyncIterator]?.() ?? t[Symbol.iterator]?.();
  if (!w)
    throw new Error("input_features must be iterable or async iterable");
  return {
    encoder_session: s,
    enc_kv_cache: l,
    enc_padding_cache: p,
    enc_past_seq_len: 0,
    audio_embed_queue: [],
    audio_embed_total_tokens: 0,
    audio_queue_offset: 0,
    audio_consumed: 0,
    stream_exhausted: !1,
    chunks_iter: w,
    text_hidden_size: r.hidden_size
  };
}
async function _D(e, t) {
  let r = t.dims[2], n = Math.floor((hD + r - 3) / 2) + 1, s = new V(
    "int64",
    BigInt64Array.from({ length: n }, (d, h) => BigInt(e.enc_past_seq_len + h)),
    [1, n]
  ), a = e.enc_past_seq_len + n, o = gt([1, a]), { audio_embeds: i, present_padding_cache: l, ...c } = await ve(e.encoder_session, {
    input_features: t,
    attention_mask: o,
    position_ids: s,
    past_padding_cache: e.enc_padding_cache,
    ...e.enc_kv_cache
  });
  e.enc_padding_cache.location === "gpu-buffer" && e.enc_padding_cache.dispose(), e.enc_padding_cache = l;
  for (let d in c)
    if (d.startsWith("present.")) {
      let h = d.replace("present", "past_key_values"), _ = e.enc_kv_cache[h];
      _?.location === "gpu-buffer" && _.dispose(), e.enc_kv_cache[h] = c[d];
    }
  return e.enc_past_seq_len = a, i;
}
async function pD(e, t) {
  for (; e.audio_embed_total_tokens < t && !e.stream_exhausted; ) {
    let r = await e.chunks_iter.next();
    if (r.done) {
      e.stream_exhausted = !0;
      break;
    }
    let n = await _D(e, r.value);
    e.audio_embed_queue.push({ data: n.data, tokens: n.dims[1] }), e.audio_embed_total_tokens += n.dims[1];
  }
}
function mD(e, t, r) {
  if (e.audio_embed_queue.length === 0) return;
  let n = t.data, s = 0, a = r;
  for (; a > 0 && e.audio_embed_queue.length > 0; ) {
    let o = e.audio_embed_queue[0], i = o.tokens - e.audio_queue_offset, l = Math.min(a, i), c = e.audio_queue_offset * e.text_hidden_size;
    for (let d = 0; d < l * e.text_hidden_size; ++d)
      n[s * e.text_hidden_size + d] += o.data[c + d];
    s += l, a -= l, e.audio_queue_offset += l, e.audio_queue_offset >= o.tokens && (e.audio_embed_queue.shift(), e.audio_queue_offset = 0);
  }
  e.audio_consumed += r - a;
}
var gD = class extends Fa {
  constructor(e) {
    super(), this._s = e;
  }
  _call(e) {
    let t = this._s.stream_exhausted && this._s.audio_embed_queue.length === 0;
    return e.map(() => t);
  }
}, Qw = class extends I {
  forward_params = ["input_ids", "attention_mask", "position_ids", "past_key_values"];
}, Xw = class extends Qw {
  async forward({ input_ids: e, past_key_values: t, ...r }) {
    let n = e.dims[1], s = Fi.get(this);
    s && await pD(s, s.audio_consumed + n);
    let { inputs_embeds: a } = await ve(this.sessions.embed_tokens, { input_ids: e });
    s && mD(s, a, n);
    let o = { inputs_embeds: a, ...r };
    Ml(this, o, t);
    let i = this.sessions.decoder_model_merged, l = et(o, i.inputNames);
    return await ve(i, l);
  }
  async generate({ input_features: e, stopping_criteria: t, ...r }) {
    if (!e)
      throw new Error("input_features (generator/iterable) must be provided");
    let n = fD(this, e);
    Fi.set(this, n);
    let s = new Mg();
    s.push(new gD(n)), t && s.extend(t);
    try {
      return await super.generate({ ...r, stopping_criteria: s });
    } finally {
      n.enc_kv_cache.dispose(), Fi.delete(this);
    }
  }
}, Ya = class extends I {
}, wD = class extends Ya {
}, vD = class extends Ya {
  /**
   * @param {Object} model_inputs
   * @param {Tensor} model_inputs.input_features Float values of input mel-spectrogram.
   * @param {Tensor} model_inputs.attention_mask Mask to avoid performing convolution and attention on padding token indices. Mask values selected in [0, 1]
   */
  async _call(e) {
    return new Lr(await super._call(e));
  }
}, yD = class extends Ya {
  /**
   * Calls the model on new inputs.
   * @param {Object} model_inputs The inputs to the model.
   * @returns {Promise<SequenceClassifierOutput>} An object containing the model's output logits for sequence classification.
   */
  async _call(e) {
    return new ae(await super._call(e));
  }
}, Yw = class extends Ve {
  /**
   * @param {Object} output The output of the model.
   * @param {Tensor} output.logits Classification hidden states before AMSoftmax, of shape `(batch_size, config.xvector_output_dim)`.
   * @param {Tensor} output.embeddings Utterance embeddings used for vector similarity-based retrieval, of shape `(batch_size, config.xvector_output_dim)`.
   */
  constructor({ logits: e, embeddings: t }) {
    super(), this.logits = e, this.embeddings = t;
  }
}, Vn = class extends I {
}, bD = class extends Vn {
}, MD = class extends Vn {
  /**
   * @param {Object} model_inputs
   * @param {Tensor} model_inputs.input_values Float values of input raw speech waveform.
   * @param {Tensor} model_inputs.attention_mask Mask to avoid performing convolution and attention on padding token indices. Mask values selected in [0, 1]
   */
  async _call(e) {
    return new Lr(await super._call(e));
  }
}, xD = class extends Vn {
  /**
   * Calls the model on new inputs.
   * @param {Object} model_inputs The inputs to the model.
   * @returns {Promise<SequenceClassifierOutput>} An object containing the model's output logits for sequence classification.
   */
  async _call(e) {
    return new ae(await super._call(e));
  }
}, kD = class extends Vn {
  /**
   * Calls the model on new inputs.
   * @param {Object} model_inputs The inputs to the model.
   * @returns {Promise<XVectorOutput>} An object containing the model's output logits and speaker embeddings.
   */
  async _call(e) {
    return new Yw(await super._call(e));
  }
}, TD = class extends Vn {
  /**
   * Calls the model on new inputs.
   * @param {Object} model_inputs The inputs to the model.
   * @returns {Promise<TokenClassifierOutput>} An object containing the model's output logits for sequence classification.
   */
  async _call(e) {
    return new He(await super._call(e));
  }
}, Kw = class extends I {
}, ED = class extends Kw {
}, AD = class extends bg {
  /**
   * Whether to return the timestamps with the text. This enables the `\u0057hisperTimestampsLogitsProcessor`.
   * @type {boolean}
   */
  return_timestamps = null;
  /**
   * Whether to return token-level timestamps
   * with the text. This can be used with or without the `return_timestamps` option. To get word-level
   * timestamps, use the tokenizer to group the tokens into words.
   * @type {boolean}
   */
  return_token_timestamps = null;
  /**
   * The number of audio frames available in this chunk. This is only used generating word-level timestamps.
   * @type {number}
   */
  num_frames = null;
  /**
   * Alignment heads to predict word-level timestamps. This is a list of [layer, head] pairs that
   * select the cross-attention heads that are highly correlated to word-level timing.
   * @type {[number, number][]}
   */
  alignment_heads = null;
  /**
   * Task to use for generation, either "translate" or "transcribe".
   * @type {string}
   */
  task = null;
  /**
   * Language token to use for generation, can be either in the form of `<|en|>`, `en` or `english`.
   * You can find all the possible language tokens in the `model.generation_config.lang_to_id` dictionary.
   * @type {string}
   */
  language = null;
  /**
   * The id of the `"<|notimestamps|>"` token.
   * @type {number}
   */
  no_timestamps_token_id = null;
  /**
   * Rank-1 list of token IDs created by passing text to [`~WhisperProcessor.get_prompt_ids`] that is
   * provided as a prompt to each chunk. This can be used to provide or "prompt-engineer" a context for
   * transcription, e.g. custom vocabularies or proper nouns to make it more likely to predict those words
   * correctly. It cannot be used in conjunction with `decoder_start_token_id` as it overwrites this value.
   * @type {number[]}
   */
  prompt_ids = null;
  /**
   * Whether the model is multilingual or not.
   * @type {boolean}
   */
  is_multilingual = null;
  /**
   * (Optional) A mapping from language tokens to their corresponding IDs.
   * Only required if the model is multilingual.
   * @type {Record<string, number>|null}
   */
  lang_to_id = null;
  /**
   * (Optional) A mapping from task tokens to their corresponding IDs.
   * @type {Record<string, number>|null}
   */
  task_to_id = null;
  /**
   * Used to set the maximum value of the initial timestamp. This is used to prevent the model from
   * predicting timestamps that are too far in the future.
   * @type {number}
   */
  max_initial_timestamp_index = 1;
}, Cu = class extends I {
  requires_attention_mask = !1;
  main_input_name = "input_features";
  forward_params = [
    "input_features",
    "attention_mask",
    "decoder_input_ids",
    "decoder_attention_mask",
    "past_key_values"
  ];
}, CD = class extends Cu {
}, Jw = class extends Cu {
  _prepare_generation_config(e, t) {
    return (
      /** @type {WhisperGenerationConfig} */
      super._prepare_generation_config(e, t, AD)
    );
  }
  /**
   *
   * @param {WhisperGenerationConfig} generation_config
   */
  _retrieve_init_tokens(e) {
    let t = [e.decoder_start_token_id], r = e.language, n = e.task;
    if (e.is_multilingual) {
      r || (le.warn("No language specified - defaulting to English (en)."), r = "en");
      let a = `<|${jE(r)}|>`;
      t.push(e.lang_to_id[a]), t.push(e.task_to_id[n ?? "transcribe"]);
    } else if (r || n)
      throw new Error(
        "Cannot specify `task` or `language` for an English-only model. If the model is intended to be multilingual, pass `is_multilingual=true` to generate, or update the generation config."
      );
    return !e.return_timestamps && e.no_timestamps_token_id && t.at(-1) !== e.no_timestamps_token_id ? t.push(e.no_timestamps_token_id) : e.return_timestamps && t.at(-1) === e.no_timestamps_token_id && (le.warn(
      "<|notimestamps|> prompt token is removed from generation_config since `return_timestamps` is set to `true`."
    ), t.pop()), t.filter((s) => s != null);
  }
  /**
   * Transcribes or translates log-mel input features to a sequence of auto-regressively generated token ids.
   * @param {import('./generation_whisper.js').WhisperGenerationFunctionParameters} options
   * @returns {Promise<ModelOutput|Tensor>} The output of the model, which can contain the generated token ids, attentions, and scores.
   */
  async generate({
    inputs: e = null,
    generation_config: t = null,
    logits_processor: r = null,
    stopping_criteria: n = null,
    // Whisper-specific options (passed to kwargs)
    // prompt_ids = null,
    // language = null,
    // task = null,
    ...s
  }) {
    t = this._prepare_generation_config(t, s);
    let a = s.decoder_input_ids instanceof V ? dl(s.decoder_input_ids) : s.decoder_input_ids ?? this._retrieve_init_tokens(t);
    if (t.return_timestamps && (r ??= new ji(), r.push(new SC(t, a))), t.begin_suppress_tokens && (r ??= new ji(), r.push(
      new yg(t.begin_suppress_tokens, a.length)
    )), t.return_token_timestamps) {
      if (!t.alignment_heads)
        throw new Error(
          "Model generation config has no `alignment_heads`, token-level timestamps not available. See https://gist.github.com/hollance/\u00342e32852f24243b748ae6bc1f985b13a on how to add this property to the generation config."
        );
      t.task === "translate" && le.warn("Token-level timestamps may not be reliable for task 'translate'."), t.output_attentions = !0, t.return_dict_in_generate = !0;
    }
    if (t.return_timestamps && !s.max_new_tokens)
      return this._generate_with_seek({
        inputs: e,
        generation_config: t,
        logits_processor: r,
        init_tokens: a,
        kwargs: s
      });
    let o = await super.generate({
      inputs: e,
      generation_config: t,
      logits_processor: r,
      decoder_input_ids: a,
      ...s
    });
    return t.return_token_timestamps && (o.token_timestamps = this._extract_token_timestamps(
      // @ts-expect-error TS2345
      o,
      t.alignment_heads,
      t.num_frames,
      0.02,
      a.length
    )), o;
  }
  /**
   * Generates with a seek loop for timestamp mode, re-encoding and generating
   * for each segment until all audio frames are consumed.
   * This matches Python's WhisperForConditionalGeneration.generate() behavior.
   * @private
   */
  async _generate_with_seek({ inputs: e, generation_config: t, logits_processor: r, init_tokens: n, kwargs: s }) {
    let a = t.no_timestamps_token_id + 1, o = Array.isArray(t.eos_token_id) ? t.eos_token_id[0] : t.eos_token_id, i = t.return_token_timestamps, l = e, c = l.dims[2], d = 2, h = (
      /** @type {number} */
      this.config.max_source_positions
    ), _ = d * h, p = 0, w = [], v = [];
    for (; p < c; ) {
      let b = Math.min(p + _, c), k = l.slice(null, null, [p, b]), A, E = k.dims[2];
      if (E < _) {
        let X = l.dims[1], ce = new Float32Array(X * _), J = (
          /** @type {Float32Array} */
          k.data
        );
        for (let ne = 0; ne < X; ++ne)
          ce.set(J.subarray(ne * E, (ne + 1) * E), ne * _);
        A = new V("float32", ce, [1, X, _]);
      } else
        A = k;
      if (r)
        for (let X of r)
          "begin_index" in X && (X.begin_index = n.length);
      let C = (
        /** @type {any} */
        await super.generate({
          inputs: A,
          generation_config: t,
          logits_processor: r,
          decoder_input_ids: n,
          ...s
        })
      ), M = (i ? C.sequences : (
        /** @type {Tensor} */
        C
      ))[0].tolist().map(Number).slice(n.length), $;
      if (i) {
        C.token_timestamps = this._extract_token_timestamps(
          C,
          t.alignment_heads,
          Math.floor((b - p) / d),
          0.02,
          n.length
        );
        let X = p / d * 0.02;
        $ = C.token_timestamps[0].tolist().slice(n.length).map((ce) => ce + X);
      }
      if (M.length > 0 && M.at(-1) === o && M.pop(), M.length === 0)
        break;
      let R = M.map((X) => X >= a), W = M.length >= 2 && R[M.length - 1] && !R[M.length - 2], Q = [];
      for (let X = 0; X < M.length - 1; ++X)
        R[X] && R[X + 1] && Q.push(X + 1);
      let H, q = M.length;
      if (Q.length > 0)
        if (W)
          H = b - p;
        else {
          let X = Q.at(-1);
          H = (M[X - 1] - a) * d, q = X;
        }
      else
        H = b - p;
      let B = Math.floor(p / d), P = a + 1500;
      for (let X = 0; X < q; ++X)
        M[X] >= a && (M[X] = Math.min(M[X] + B, P));
      w.push(...M.slice(0, q)), $ && v.push(...$.slice(0, q)), p += H;
    }
    w.push(o);
    let y = [...n, ...w];
    if (i) {
      let b = new V("int64", y.map(BigInt), [1, y.length]), k = [...new Array(n.length).fill(0), ...v, 0], A = new V("float32", new Float32Array(k), [
        1,
        k.length
      ]);
      return { sequences: b, token_timestamps: A };
    }
    return new V("int64", y.map(BigInt), [1, y.length]);
  }
  /**
   * Calculates token-level timestamps using the encoder-decoder cross-attentions and
   * dynamic time-warping (DTW) to map each output token to a position in the input audio.
   * If `num_frames` is specified, the encoder-decoder cross-attentions will be cropped before applying DTW.
   * @param {Object} generate_outputs Outputs generated by the model
   * @param {Tensor[][]} generate_outputs.cross_attentions The cross attentions output by the model
   * @param {Tensor} generate_outputs.sequences The sequences output by the model
   * @param {number[][]} alignment_heads Alignment heads of the model
   * @param {number} [num_frames=null] Number of frames in the input audio.
   * @param {number} [time_precision=0.02] Precision of the timestamps in seconds
   * @param {number} [num_input_ids=0] Number of decoder input ids (prefix tokens) to skip in DTW
   * @returns {Tensor} tensor containing the timestamps in seconds for each predicted token
   */
  _extract_token_timestamps(e, t, r = null, n = 0.02, s = 0) {
    if (!e.cross_attentions)
      throw new Error(
        "Model outputs must contain cross attentions to extract timestamps. This is most likely because the model was not exported with `output_attentions=True`."
      );
    r == null && le.warn(
      "`num_frames` has not been set, meaning the entire audio will be analyzed. This may lead to inaccurate token-level timestamps for short audios (< 30 seconds)."
    );
    let a = this.config.median_filter_width;
    a === void 0 && (le.warn("Model config has no `median_filter_width`, using default value of 7."), a = 7);
    let o = e.cross_attentions, i = Array.from(
      // @ts-expect-error TS2339
      { length: this.config.decoder_layers },
      // Concatenate the cross attentions for each layer across sequence length dimension.
      (y, b) => De(
        o.map((k) => k[b]),
        2
      )
    ), l = fr(
      t.map(([y, b]) => {
        if (y >= i.length)
          throw new Error(
            `Layer index ${y} is out of bounds for cross attentions (length ${i.length}).`
          );
        return r ? i[y].slice(null, b, null, [0, r]) : i[y].slice(null, b);
      })
    ).permute(1, 0, 2, 3), [c, d] = QT(l, -2, 0, !0), h = l.clone();
    for (let y = 0; y < h.dims[0]; ++y) {
      let b = h[y];
      for (let k = 0; k < b.dims[0]; ++k) {
        let A = b[k], E = c[y][k][0].data, C = d[y][k][0].data;
        for (let N = 0; N < A.dims[0]; ++N) {
          let M = A[N].data;
          for (let $ = 0; $ < M.length; ++$)
            M[$] = (M[$] - C[$]) / E[$];
          M.set(PT(M, a));
        }
      }
    }
    let _ = s > 0 ? h.slice(null, null, [s, h.dims[2]], null) : h, p = [il(_, 1)], w = e.sequences.dims, v = new V(
      "float32",
      new Float32Array(w[0] * w[1]),
      w
    );
    for (let y = 0; y < w[0]; ++y) {
      let b = p[y].neg().squeeze_(0), [k, A] = IT(b.tolist()), E = Array.from(
        { length: k.length - 1 },
        ($, R) => k[R + 1] - k[R]
      ), C = er([1], E).map(($) => !!$), N = [];
      for (let $ = 0; $ < C.length; ++$)
        C[$] && N.push(A[$] * n);
      let M = new Array(s).fill(0);
      M.push(...N), N.length > 0 && M.push(N.at(-1)), v[y].data.set(M);
    }
    return v;
  }
}, SD = class extends Jw {
}, Un = class extends I {
}, PD = class extends Un {
}, FD = class extends Un {
  /**
   * Calls the model on new inputs.
   *
   * @param {Object} model_inputs The inputs to the model.
   * @returns {Promise<MaskedLMOutput>} returned object
   */
  async _call(e) {
    return new Xe(await super._call(e));
  }
}, ID = class extends Un {
  /**
   * Calls the model on new inputs.
   *
   * @param {Object} model_inputs The inputs to the model.
   * @returns {Promise<SequenceClassifierOutput>} returned object
   */
  async _call(e) {
    return new ae(await super._call(e));
  }
}, LD = class extends Un {
  /**
   * Calls the model on new inputs.
   *
   * @param {Object} model_inputs The inputs to the model.
   * @returns {Promise<TokenClassifierOutput>} An object containing the model's output logits for token classification.
   */
  async _call(e) {
    return new He(await super._call(e));
  }
}, OD = class extends Un {
  /**
   * Calls the model on new inputs.
   *
   * @param {Object} model_inputs The inputs to the model.
   * @returns {Promise<QuestionAnsweringModelOutput>} returned object
   */
  async _call(e) {
    return new it(await super._call(e));
  }
}, jn = class extends I {
}, ND = class extends jn {
}, DD = class extends jn {
  /**
   * Calls the model on new inputs.
   *
   * @param {Object} model_inputs The inputs to the model.
   * @returns {Promise<MaskedLMOutput>} returned object
   */
  async _call(e) {
    return new Xe(await super._call(e));
  }
}, zD = class extends jn {
  /**
   * Calls the model on new inputs.
   *
   * @param {Object} model_inputs The inputs to the model.
   * @returns {Promise<SequenceClassifierOutput>} returned object
   */
  async _call(e) {
    return new ae(await super._call(e));
  }
}, BD = class extends jn {
  /**
   * Calls the model on new inputs.
   *
   * @param {Object} model_inputs The inputs to the model.
   * @returns {Promise<TokenClassifierOutput>} An object containing the model's output logits for token classification.
   */
  async _call(e) {
    return new He(await super._call(e));
  }
}, RD = class extends jn {
  /**
   * Calls the model on new inputs.
   *
   * @param {Object} model_inputs The inputs to the model.
   * @returns {Promise<QuestionAnsweringModelOutput>} returned object
   */
  async _call(e) {
    return new it(await super._call(e));
  }
}, Su = class extends I {
}, $D = class extends Su {
}, GD = class extends Su {
  /**
   * @param {any} model_inputs
   */
  async _call(e) {
    return new Zw(await super._call(e));
  }
}, Zw = class extends Ve {
  /**
   * @param {Object} output The output of the model.
   * @param {Tensor} output.logits Classification logits (including no-object) for all queries.
   * @param {Tensor} output.pred_boxes Normalized boxes coordinates for all queries, represented as (center_x, center_y, width, height).
   * These values are normalized in [0, 1], relative to the size of each individual image in the batch (disregarding possible padding).
   */
  constructor({ logits: e, pred_boxes: t }) {
    super(), this.logits = e, this.pred_boxes = t;
  }
}, Pu = class extends I {
}, VD = class extends Pu {
}, UD = class extends Pu {
}, Fu = class extends I {
}, jD = class extends Fu {
}, WD = class extends Fu {
}, qD = /* @__PURE__ */ new Map([
  ["bert", "BertModel"],
  ["eurobert", "EuroBertModel"],
  ["neobert", "NeoBertModel"],
  ["modernbert", "ModernBertModel"],
  ["nomic_bert", "NomicBertModel"],
  ["roformer", "RoFormerModel"],
  ["electra", "ElectraModel"],
  ["esm", "EsmModel"],
  ["convbert", "ConvBertModel"],
  ["camembert", "CamembertModel"],
  ["deberta", "DebertaModel"],
  ["deberta-v2", "DebertaV2Model"],
  ["mpnet", "MPNetModel"],
  ["albert", "AlbertModel"],
  ["distilbert", "DistilBertModel"],
  ["roberta", "RobertaModel"],
  ["xlm", "XLMModel"],
  ["xlm-roberta", "XLMRobertaModel"],
  ["clap", "ClapModel"],
  ["clip", "CLIPModel"],
  ["clipseg", "CLIPSegModel"],
  ["chinese_clip", "ChineseCLIPModel"],
  ["siglip", "SiglipModel"],
  ["jina_clip", "JinaCLIPModel"],
  ["mobilebert", "MobileBertModel"],
  ["squeezebert", "SqueezeBertModel"],
  ["wav2vec2", "Wav2Vec2Model"],
  ["wav2vec2-bert", "Wav2Vec2BertModel"],
  ["unispeech", "UniSpeechModel"],
  ["unispeech-sat", "UniSpeechSatModel"],
  ["hubert", "HubertModel"],
  ["wavlm", "WavLMModel"],
  ["audio-spectrogram-transformer", "ASTModel"],
  ["vits", "VitsModel"],
  ["pyannote", "PyAnnoteModel"],
  ["wespeaker-resnet", "WeSpeakerResNetModel"],
  ["detr", "DetrModel"],
  ["rt_detr", "RTDetrModel"],
  ["rt_detr_v2", "RTDetrV2Model"],
  ["rf_detr", "RFDetrModel"],
  ["d_fine", "DFineModel"],
  ["table-transformer", "TableTransformerModel"],
  ["vit", "ViTModel"],
  ["ijepa", "IJepaModel"],
  ["pvt", "PvtModel"],
  ["vit_msn", "ViTMSNModel"],
  ["vit_mae", "ViTMAEModel"],
  ["groupvit", "GroupViTModel"],
  ["fastvit", "FastViTModel"],
  ["mobilevit", "MobileViTModel"],
  ["mobilevitv2", "MobileViTV2Model"],
  ["owlvit", "OwlViTModel"],
  ["owlv2", "Owlv2Model"],
  ["beit", "BeitModel"],
  ["deit", "DeiTModel"],
  ["hiera", "HieraModel"],
  ["convnext", "ConvNextModel"],
  ["convnextv2", "ConvNextV2Model"],
  ["dinov2", "Dinov2Model"],
  ["dinov2_with_registers", "Dinov2WithRegistersModel"],
  ["dinov3_vit", "DINOv3ViTModel"],
  ["dinov3_convnext", "DINOv3ConvNextModel"],
  ["resnet", "ResNetModel"],
  ["swin", "SwinModel"],
  ["swin2sr", "Swin2SRModel"],
  ["donut-swin", "DonutSwinModel"],
  ["yolos", "YolosModel"],
  ["dpt", "DPTModel"],
  ["glpn", "GLPNModel"],
  ["hifigan", "SpeechT5HifiGan"],
  ["efficientnet", "EfficientNetModel"],
  ["decision_transformer", "DecisionTransformerModel"],
  ["patchtst", "PatchTSTModel"],
  ["patchtsmixer", "PatchTSMixerModel"],
  ["mobilenet_v1", "MobileNetV1Model"],
  ["mobilenet_v2", "MobileNetV2Model"],
  ["mobilenet_v3", "MobileNetV3Model"],
  ["mobilenet_v4", "MobileNetV4Model"],
  ["maskformer", "MaskFormerModel"],
  ["mgp-str", "MgpstrForSceneTextRecognition"],
  ["style_text_to_speech_2", "StyleTextToSpeech2Model"],
  ["openai_privacy_filter", "OpenAIPrivacyFilterModel"],
  ["embedding_gemma2", "EmbeddingGemma2Model"]
]), HD = /* @__PURE__ */ new Map([
  ["t5", "T5Model"],
  ["longt5", "LongT5Model"],
  ["mt5", "MT5Model"],
  ["bart", "BartModel"],
  ["mbart", "MBartModel"],
  ["marian", "MarianModel"],
  ["whisper", "WhisperModel"],
  ["cohere_asr", "CohereAsrModel"],
  ["m2m_100", "M2M100Model"],
  ["blenderbot", "BlenderbotModel"],
  ["blenderbot-small", "BlenderbotSmallModel"]
]), QD = /* @__PURE__ */ new Map([
  ["mimi", "MimiModel"],
  ["dac", "DacModel"],
  ["snac", "SnacModel"]
]), XD = /* @__PURE__ */ new Map([
  ["bloom", "BloomModel"],
  ["jais", "JAISModel"],
  ["gpt2", "GPT2Model"],
  ["gpt_oss", "GptOssModel"],
  ["gptj", "GPTJModel"],
  ["gpt_bigcode", "GPTBigCodeModel"],
  ["gpt_neo", "GPTNeoModel"],
  ["gpt_neox", "GPTNeoXModel"],
  ["codegen", "CodeGenModel"],
  ["llama", "LlamaModel"],
  ["apertus", "ApertusModel"],
  ["nanochat", "NanoChatModel"],
  ["arcee", "ArceeModel"],
  ["afmoe", "AfmoeModel"],
  ["lfm2", "Lfm2Model"],
  ["lfm2_moe", "Lfm2MoeModel"],
  ["smollm3", "SmolLM3Model"],
  ["exaone", "ExaoneModel"],
  ["olmo", "OlmoModel"],
  ["olmo2", "Olmo2Model"],
  ["olmo3", "Olmo3Model"],
  ["olmo_hybrid", "OlmoHybridModel"],
  ["mobilellm", "MobileLLMModel"],
  ["granite", "GraniteModel"],
  ["granitemoehybrid", "GraniteMoeHybridModel"],
  ["cohere", "CohereModel"],
  ["cohere2", "Cohere2Model"],
  ["gemma", "GemmaModel"],
  ["gemma2", "Gemma2Model"],
  ["vaultgemma", "VaultGemmaModel"],
  ["gemma3_text", "Gemma3Model"],
  ["helium", "HeliumModel"],
  ["glm", "GlmModel"],
  ["glm_moe_dsa", "GlmMoeDsaModel"],
  ["openelm", "OpenELMModel"],
  ["qwen2", "Qwen2Model"],
  ["qwen2_moe", "Qwen2MoeModel"],
  ["qwen3", "Qwen3Model"],
  ["qwen3_moe", "Qwen3MoeModel"],
  ["qwen3_next", "Qwen3NextModel"],
  ["phi", "PhiModel"],
  ["phi3", "Phi3Model"],
  ["mpt", "MptModel"],
  ["opt", "OPTModel"],
  ["mistral", "MistralModel"],
  ["mistral4", "Mistral4Model"],
  ["ministral", "MinistralModel"],
  ["ministral3", "Ministral3Model"],
  ["ernie4_5", "Ernie4_5ForCausalLM"],
  ["starcoder2", "Starcoder2Model"],
  ["deepseek_v3", "DeepseekV3Model"],
  ["deepseek_v4", "DeepseekV4Model"],
  ["falcon", "FalconModel"],
  ["falcon_h1", "FalconH1Model"],
  ["nemotron_h", "NemotronHModel"],
  ["solar_open", "SolarOpenModel"],
  ["stablelm", "StableLmModel"],
  ["modernbert-decoder", "ModernBertDecoderModel"],
  ["hunyuan_v1_dense", "HunYuanDenseV1Model"],
  ["youtu", "YoutuModel"],
  ["zaya", "ZayaModel"],
  ["hrm_text", "HrmTextModel"]
]), ev = /* @__PURE__ */ new Map([
  ["speecht5", "SpeechT5ForSpeechToText"],
  ["whisper", "WhisperForConditionalGeneration"],
  ["lite-whisper", "LiteWhisperForConditionalGeneration"],
  ["moonshine", "MoonshineForConditionalGeneration"],
  ["cohere_asr", "CohereAsrForConditionalGeneration"]
]), tv = /* @__PURE__ */ new Map([["speecht5", "SpeechT5ForTextToSpeech"]]), rv = /* @__PURE__ */ new Map([
  ["vits", "VitsModel"],
  ["musicgen", "\u004dusicgenForConditionalGeneration"],
  ["supertonic", "SupertonicForConditionalGeneration"]
]), nv = /* @__PURE__ */ new Map([
  ["bert", "BertForSequenceClassification"],
  ["eurobert", "EuroBertForSequenceClassification"],
  ["neobert", "\u004eeoBertForSequenceClassification"],
  ["modernbert", "ModernBertForSequenceClassification"],
  ["roformer", "RoFormerForSequenceClassification"],
  ["electra", "\u0045lectraForSequenceClassification"],
  ["esm", "EsmForSequenceClassification"],
  ["convbert", "ConvBertForSequenceClassification"],
  ["camembert", "CamembertForSequenceClassification"],
  ["deberta", "\u0044ebertaForSequenceClassification"],
  ["deberta-v2", "DebertaV2ForSequenceClassification"],
  ["mpnet", "MPNetForSequenceClassification"],
  ["albert", "AlbertForSequenceClassification"],
  ["distilbert", "DistilBertForSequenceClassification"],
  ["roberta", "\u0052obertaForSequenceClassification"],
  ["xlm", "XLMForSequenceClassification"],
  ["xlm-roberta", "XLMRobertaForSequenceClassification"],
  ["bart", "BartForSequenceClassification"],
  ["mbart", "MBartForSequenceClassification"],
  ["mobilebert", "MobileBertForSequenceClassification"],
  ["squeezebert", "SqueezeBertForSequenceClassification"]
]), sv = /* @__PURE__ */ new Map([
  ["bert", "BertForTokenClassification"],
  ["eurobert", "EuroBertForTokenClassification"],
  ["neobert", "NeoBertForTokenClassification"],
  ["modernbert", "\u004dodernBertForTokenClassification"],
  ["roformer", "RoFormerForTokenClassification"],
  ["electra", "ElectraForTokenClassification"],
  ["esm", "EsmForTokenClassification"],
  ["convbert", "ConvBertForTokenClassification"],
  ["camembert", "CamembertForTokenClassification"],
  ["deberta", "DebertaForTokenClassification"],
  ["deberta-v2", "DebertaV2ForTokenClassification"],
  ["mpnet", "MPNetForTokenClassification"],
  ["distilbert", "\u0044istilBertForTokenClassification"],
  ["roberta", "RobertaForTokenClassification"],
  ["xlm", "XLMForTokenClassification"],
  ["xlm-roberta", "\u0058LMRobertaForTokenClassification"],
  ["openai_privacy_filter", "OpenAIPrivacyFilterForTokenClassification"]
]), av = /* @__PURE__ */ new Map([
  ["t5", "T5ForConditionalGeneration"],
  ["longt5", "LongT5ForConditionalGeneration"],
  ["mt5", "MT5ForConditionalGeneration"],
  ["bart", "BartForConditionalGeneration"],
  ["mbart", "MBartForConditionalGeneration"],
  ["marian", "MarianMTModel"],
  ["m2m_100", "M2M100ForConditionalGeneration"],
  ["blenderbot", "BlenderbotForConditionalGeneration"],
  ["blenderbot-small", "BlenderbotSmallForConditionalGeneration"]
]), ov = /* @__PURE__ */ new Map([
  ["bloom", "BloomForCausalLM"],
  ["gpt2", "GPT2LMHeadModel"],
  ["gpt_oss", "GptOssForCausalLM"],
  ["jais", "JAISLMHeadModel"],
  ["gptj", "GPTJForCausalLM"],
  ["gpt_bigcode", "GPTBigCodeForCausalLM"],
  ["gpt_neo", "GPTNeoForCausalLM"],
  ["gpt_neox", "GPTNeoXForCausalLM"],
  ["codegen", "CodeGenForCausalLM"],
  ["llama", "LlamaForCausalLM"],
  ["nanochat", "NanoChatForCausalLM"],
  ["apertus", "ApertusForCausalLM"],
  ["llama4_text", "Llama4ForCausalLM"],
  ["arcee", "ArceeForCausalLM"],
  ["afmoe", "AfmoeForCausalLM"],
  ["lfm2", "Lfm2ForCausalLM"],
  ["lfm2_moe", "Lfm2MoeForCausalLM"],
  ["smollm3", "SmolLM3ForCausalLM"],
  ["exaone", "ExaoneForCausalLM"],
  ["olmo", "OlmoForCausalLM"],
  ["olmo2", "Olmo2ForCausalLM"],
  ["olmo3", "Olmo3ForCausalLM"],
  ["olmo_hybrid", "OlmoHybridForCausalLM"],
  ["mobilellm", "MobileLLMForCausalLM"],
  ["granite", "GraniteForCausalLM"],
  ["granitemoehybrid", "GraniteMoeHybridForCausalLM"],
  ["cohere", "CohereForCausalLM"],
  ["cohere2", "Cohere2ForCausalLM"],
  ["gemma", "GemmaForCausalLM"],
  ["gemma2", "Gemma2ForCausalLM"],
  ["vaultgemma", "VaultGemmaForCausalLM"],
  ["gemma3_text", "Gemma3ForCausalLM"],
  ["gemma3", "Gemma3ForCausalLM"],
  ["helium", "HeliumForCausalLM"],
  ["glm", "GlmForCausalLM"],
  ["glm_moe_dsa", "GlmMoeDsaForCausalLM"],
  ["openelm", "OpenELMForCausalLM"],
  ["qwen2", "Qwen2ForCausalLM"],
  ["qwen2_moe", "Qwen2MoeForCausalLM"],
  ["qwen3", "Qwen3ForCausalLM"],
  ["qwen3_moe", "Qwen3MoeForCausalLM"],
  ["qwen3_next", "Qwen3NextForCausalLM"],
  ["qwen2_vl", "Qwen2VLForCausalLM"],
  ["qwen2_5_vl", "Qwen2_5_VLForCausalLM"],
  ["qwen3_vl", "Qwen3VLForCausalLM"],
  ["qwen3_vl_moe", "Qwen3VLMoeForCausalLM"],
  ["qwen3_5", "Qwen3_5ForCausalLM"],
  ["qwen3_5_text", "Qwen3_5ForCausalLM"],
  ["qwen3_5_moe", "Qwen3_5MoeForCausalLM"],
  ["gemma3n", "Gemma3nForCausalLM"],
  ["gemma4", "Gemma4ForCausalLM"],
  ["phi", "PhiForCausalLM"],
  ["phi3", "Phi3ForCausalLM"],
  ["mpt", "MptForCausalLM"],
  ["opt", "OPTForCausalLM"],
  ["mbart", "MBartForCausalLM"],
  ["mistral", "MistralForCausalLM"],
  ["mistral4", "Mistral4ForCausalLM"],
  ["ministral", "MinistralForCausalLM"],
  ["ministral3", "Ministral3ForCausalLM"],
  ["ernie4_5", "Ernie4_5ForCausalLM"],
  ["starcoder2", "Starcoder2ForCausalLM"],
  ["deepseek_v3", "DeepseekV3ForCausalLM"],
  ["deepseek_v4", "DeepseekV4ForCausalLM"],
  ["falcon", "FalconForCausalLM"],
  ["falcon_h1", "FalconH1ForCausalLM"],
  ["nemotron_h", "NemotronHForCausalLM"],
  ["trocr", "TrOCRForCausalLM"],
  ["solar_open", "SolarOpenForCausalLM"],
  ["stablelm", "StableLmForCausalLM"],
  ["modernbert-decoder", "ModernBertDecoderForCausalLM"],
  ["hunyuan_v1_dense", "HunYuanDenseV1ForCausalLM"],
  ["youtu", "YoutuForCausalLM"],
  ["zaya", "ZayaForCausalLM"],
  ["hrm_text", "HrmTextForCausalLM"],
  // Also image-text-to-text
  ["phi3_v", "Phi3VForCausalLM"]
]), YD = /* @__PURE__ */ new Map([["multi_modality", "MultiModalityCausalLM"]]), iv = /* @__PURE__ */ new Map([
  ["bert", "BertForMaskedLM"],
  ["eurobert", "EuroBertForMaskedLM"],
  ["neobert", "NeoBertForMaskedLM"],
  ["modernbert", "ModernBertForMaskedLM"],
  ["roformer", "RoFormerForMaskedLM"],
  ["electra", "ElectraForMaskedLM"],
  ["esm", "EsmForMaskedLM"],
  ["convbert", "ConvBertForMaskedLM"],
  ["camembert", "CamembertForMaskedLM"],
  ["deberta", "DebertaForMaskedLM"],
  ["deberta-v2", "DebertaV2ForMaskedLM"],
  ["mpnet", "MPNetForMaskedLM"],
  ["albert", "AlbertForMaskedLM"],
  ["distilbert", "DistilBertForMaskedLM"],
  ["roberta", "RobertaForMaskedLM"],
  ["xlm", "XLMWithLMHeadModel"],
  ["xlm-roberta", "XLMRobertaForMaskedLM"],
  ["mobilebert", "MobileBertForMaskedLM"],
  ["squeezebert", "SqueezeBertForMaskedLM"]
]), lv = /* @__PURE__ */ new Map([
  ["bert", "BertForQuestionAnswering"],
  ["neobert", "NeoBertForQuestionAnswering"],
  ["roformer", "RoFormerForQuestionAnswering"],
  ["electra", "ElectraForQuestionAnswering"],
  ["convbert", "ConvBertForQuestionAnswering"],
  ["camembert", "CamembertForQuestionAnswering"],
  ["deberta", "DebertaForQuestionAnswering"],
  ["deberta-v2", "DebertaV2ForQuestionAnswering"],
  ["mpnet", "MPNetForQuestionAnswering"],
  ["albert", "AlbertForQuestionAnswering"],
  ["distilbert", "DistilBertForQuestionAnswering"],
  ["roberta", "RobertaForQuestionAnswering"],
  ["xlm", "XLMForQuestionAnswering"],
  ["xlm-roberta", "XLMRobertaForQuestionAnswering"],
  ["mobilebert", "MobileBertForQuestionAnswering"],
  ["squeezebert", "SqueezeBertForQuestionAnswering"]
]), cv = /* @__PURE__ */ new Map([
  ["vision-encoder-decoder", "VisionEncoderDecoderModel"],
  ["idefics3", "\u0049defics3ForConditionalGeneration"],
  ["smolvlm", "SmolVLMForConditionalGeneration"]
]), uv = /* @__PURE__ */ new Map([
  ["llava", "LlavaForConditionalGeneration"],
  ["llava_onevision", "LlavaOnevisionForConditionalGeneration"],
  ["moondream1", "Moondream1ForConditionalGeneration"],
  ["florence2", "Florence2ForConditionalGeneration"],
  ["qwen2_vl", "Qwen2VLForConditionalGeneration"],
  ["qwen2_5_vl", "Qwen2_5_VLForConditionalGeneration"],
  ["qwen3_vl", "Qwen3VLForConditionalGeneration"],
  ["qwen3_vl_moe", "Qwen3VLMoeForConditionalGeneration"],
  ["qwen3_5", "Qwen3_5ForConditionalGeneration"],
  ["qwen3_5_moe", "Qwen3_5MoeForConditionalGeneration"],
  ["lfm2_vl", "Lfm2VlForConditionalGeneration"],
  ["idefics3", "\u0049defics3ForConditionalGeneration"],
  ["smolvlm", "SmolVLMForConditionalGeneration"],
  ["paligemma", "PaliGemmaForConditionalGeneration"],
  ["llava_qwen2", "LlavaQwen2ForCausalLM"],
  ["gemma3", "Gemma3ForConditionalGeneration"],
  ["gemma3n", "Gemma3nForConditionalGeneration"],
  ["gemma4", "Gemma4ForConditionalGeneration"],
  ["mistral3", "\u004distral3ForConditionalGeneration"],
  ["lighton_ocr", "LightOnOcrForConditionalGeneration"],
  ["glm_ocr", "GlmOcrForConditionalGeneration"]
]), dv = /* @__PURE__ */ new Map([
  ["granite_speech", "GraniteSpeechForConditionalGeneration"],
  ["ultravox", "UltravoxModel"],
  ["voxtral", "VoxtralForConditionalGeneration"],
  ["voxtral_realtime", "VoxtralRealtimeForConditionalGeneration"]
]), KD = /* @__PURE__ */ new Map([
  ["vision-encoder-decoder", "VisionEncoderDecoderModel"]
]), hv = /* @__PURE__ */ new Map([
  ["vit", "ViTForImageClassification"],
  ["ijepa", "IJepaForImageClassification"],
  ["pvt", "PvtForImageClassification"],
  ["vit_msn", "ViTMSNForImageClassification"],
  ["fastvit", "FastViTForImageClassification"],
  ["mobilevit", "MobileViTForImageClassification"],
  ["mobilevitv2", "MobileViTV2ForImageClassification"],
  ["beit", "BeitForImageClassification"],
  ["deit", "DeiTForImageClassification"],
  ["hiera", "HieraForImageClassification"],
  ["convnext", "ConvNextForImageClassification"],
  ["convnextv2", "\u0043onvNextV2ForImageClassification"],
  ["dinov2", "Dinov2ForImageClassification"],
  ["dinov2_with_registers", "Dinov2WithRegistersForImageClassification"],
  ["resnet", "ResNetForImageClassification"],
  ["swin", "SwinForImageClassification"],
  ["segformer", "SegformerForImageClassification"],
  ["efficientnet", "EfficientNetForImageClassification"],
  ["mobilenet_v1", "MobileNetV1ForImageClassification"],
  ["mobilenet_v2", "MobileNetV2ForImageClassification"],
  ["mobilenet_v3", "MobileNetV3ForImageClassification"],
  ["mobilenet_v4", "MobileNetV4ForImageClassification"]
]), fv = /* @__PURE__ */ new Map([
  ["detr", "DetrForObjectDetection"],
  ["rt_detr", "RTDetrForObjectDetection"],
  ["rt_detr_v2", "RTDetrV2ForObjectDetection"],
  ["rf_detr", "RFDetrForObjectDetection"],
  ["d_fine", "DFineForObjectDetection"],
  ["table-transformer", "TableTransformerForObjectDetection"],
  ["yolos", "YolosForObjectDetection"]
]), _v = /* @__PURE__ */ new Map([
  ["owlvit", "OwlViTForObjectDetection"],
  ["owlv2", "Owlv2ForObjectDetection"],
  ["grounding-dino", "GroundingDinoForObjectDetection"]
]), bn = /* @__PURE__ */ new Map([
  // TODO: Do not add new models here
  ["detr", "DetrForSegmentation"],
  ["clipseg", "CLIPSegForImageSegmentation"]
]), pv = /* @__PURE__ */ new Map([
  ["segformer", "\u0053egformerForSemanticSegmentation"],
  ["sapiens", "SapiensForSemanticSegmentation"],
  ["swin", "SwinForSemanticSegmentation"],
  ["mobilenet_v1", "MobileNetV1ForSemanticSegmentation"],
  ["mobilenet_v2", "MobileNetV2ForSemanticSegmentation"],
  ["mobilenet_v3", "MobileNetV3ForSemanticSegmentation"],
  ["mobilenet_v4", "MobileNetV4ForSemanticSegmentation"]
]), mv = /* @__PURE__ */ new Map([
  ["detr", "DetrForSegmentation"],
  ["maskformer", "MaskFormerForInstanceSegmentation"]
]), gv = /* @__PURE__ */ new Map([
  ["sam", "SamModel"],
  ["sam2", "Sam2Model"],
  ["edgetam", "EdgeTamModel"],
  ["sam3_tracker", "Sam3TrackerModel"]
]), wv = /* @__PURE__ */ new Map([
  ["wav2vec2", "Wav2Vec2ForCTC"],
  ["wav2vec2-bert", "Wav2Vec2BertForCTC"],
  ["unispeech", "UniSpeechForCTC"],
  ["unispeech-sat", "UniSpeechSatForCTC"],
  ["wavlm", "WavLMForCTC"],
  ["hubert", "HubertForCTC"],
  ["parakeet_ctc", "ParakeetForCTC"]
]), vv = /* @__PURE__ */ new Map([
  ["wav2vec2", "Wav2Vec2ForSequenceClassification"],
  ["wav2vec2-bert", "Wav2Vec2BertForSequenceClassification"],
  ["unispeech", "UniSpeechForSequenceClassification"],
  ["unispeech-sat", "UniSpeechSatForSequenceClassification"],
  ["wavlm", "WavLMForSequenceClassification"],
  ["hubert", "HubertForSequenceClassification"],
  ["audio-spectrogram-transformer", "ASTForAudioClassification"]
]), yv = /* @__PURE__ */ new Map([["wavlm", "WavLMForXVector"]]), bv = /* @__PURE__ */ new Map([
  ["unispeech-sat", "UniSpeechSatForAudioFrameClassification"],
  ["wavlm", "\u0057avLMForAudioFrameClassification"],
  ["wav2vec2", "Wav2Vec2ForAudioFrameClassification"],
  ["pyannote", "PyAnnoteForAudioFrameClassification"]
]), Mv = /* @__PURE__ */ new Map([["vitmatte", "VitMatteForImageMatting"]]), JD = /* @__PURE__ */ new Map([
  ["patchtst", "PatchTSTForPrediction"],
  ["patchtsmixer", "PatchTSMixerForPrediction"]
]), xv = /* @__PURE__ */ new Map([["swin2sr", "Swin2SRForImageSuperResolution"]]), kv = /* @__PURE__ */ new Map([
  ["chmv2", "CHMv2ForDepthEstimation"],
  ["dpt", "DPTForDepthEstimation"],
  ["depth_anything", "DepthAnythingForDepthEstimation"],
  ["glpn", "GLPNForDepthEstimation"],
  ["sapiens", "SapiensForDepthEstimation"],
  ["depth_pro", "DepthProForDepthEstimation"],
  ["metric3d", "Metric3DForDepthEstimation"],
  ["metric3dv2", "Metric3Dv2ForDepthEstimation"]
]), Tv = /* @__PURE__ */ new Map([["sapiens", "SapiensForNormalEstimation"]]), Ev = /* @__PURE__ */ new Map([["vitpose", "VitPoseForPoseEstimation"]]), Av = /* @__PURE__ */ new Map([
  ["clip", "CLIPVisionModelWithProjection"],
  ["siglip", "SiglipVisionModel"],
  ["jina_clip", "JinaCLIPVisionModel"]
]), Cv = [
  // MODEL_MAPPING_NAMES:
  [qD, j.EncoderOnly],
  [HD, j.EncoderDecoder],
  [XD, j.DecoderOnlyWithoutHead],
  [QD, j.AutoEncoder],
  [nv, j.EncoderOnly],
  [sv, j.EncoderOnly],
  [av, j.Seq2Seq],
  [ev, j.Seq2Seq],
  [ov, j.DecoderOnly],
  [YD, j.MultiModality],
  [iv, j.EncoderOnly],
  [lv, j.EncoderOnly],
  [cv, j.Vision2Seq],
  [uv, j.ImageTextToText],
  [dv, j.AudioTextToText],
  [hv, j.EncoderOnly],
  [bn, j.EncoderOnly],
  [mv, j.EncoderOnly],
  [pv, j.EncoderOnly],
  [Mv, j.EncoderOnly],
  [JD, j.EncoderOnly],
  [xv, j.EncoderOnly],
  [kv, j.EncoderOnly],
  [Tv, j.EncoderOnly],
  [Ev, j.EncoderOnly],
  [fv, j.EncoderOnly],
  [_v, j.EncoderOnly],
  [gv, j.MaskGeneration],
  [wv, j.EncoderOnly],
  [vv, j.EncoderOnly],
  [tv, j.Seq2Seq],
  [rv, j.EncoderOnly],
  [yv, j.EncoderOnly],
  [bv, j.EncoderOnly],
  // Custom:
  [Av, j.EncoderOnly]
];
for (let [e, t] of Cv)
  for (let r of e.values()) {
    hr.set(r, t);
    let n = kl[r];
    En.set(n, r), bl.set(r, n);
  }
var ZD = [
  // OVERRIDE:
  // TODO: Refactor to allow class to specify model
  ["\u004dusicgenForConditionalGeneration", Mw, j.Musicgen],
  ["Phi3VForCausalLM", Ew, j.Phi3V],
  ["CLIPTextModelWithProjection", Rg, j.EncoderOnly],
  ["SiglipTextModel", Nw, j.EncoderOnly],
  ["JinaCLIPTextModel", dw, j.EncoderOnly],
  ["ClapTextModelWithProjection", zg, j.EncoderOnly],
  ["ClapAudioModelWithProjection", Bg, j.EncoderOnly],
  ["DacEncoderModel", Vg, j.EncoderOnly],
  ["DacDecoderModel", Ug, j.EncoderOnly],
  ["MimiEncoderModel", vw, j.EncoderOnly],
  ["MimiDecoderModel", yw, j.EncoderOnly],
  ["SnacEncoderModel", Dw, j.EncoderOnly],
  ["SnacDecoderModel", zw, j.EncoderOnly],
  [
    "Gemma3nForConditionalGeneration",
    za,
    j.ImageAudioTextToText
  ],
  [
    "Gemma4ForConditionalGeneration",
    nc,
    j.ImageAudioTextToText
  ],
  ["SupertonicForConditionalGeneration", $w, j.Supertonic],
  ["ChatterboxModel", Og, j.Chatterbox],
  ["EmbeddingGemma2Model", Jg, j.MultimodalEncoder],
  [
    "VoxtralRealtimeForConditionalGeneration",
    Xw,
    j.VoxtralRealtime
  ]
];
for (let [e, t, r] of ZD)
  hr.set(e, r), En.set(t, e), bl.set(e, t);
var Sv = /* @__PURE__ */ new Map([
  ["modnet", bn],
  ["birefnet", bn],
  ["isnet", bn],
  ["ben", bn]
]);
for (let [e, t] of Sv.entries())
  t.set(e, "PreTrainedModel"), hr.set(e, j.EncoderOnly), bl.set(e, I);
var e3 = new Set(Sv.keys());
hr.set("PreTrainedModel", j.EncoderOnly);
En.set(I, "PreTrainedModel");
var Ce = {
  MODEL_FOR_SEQUENCE_CLASSIFICATION_MAPPING_NAMES: nv,
  MODEL_FOR_TOKEN_CLASSIFICATION_MAPPING_NAMES: sv,
  MODEL_FOR_TEXT_TO_SPECTROGRAM_MAPPING_NAMES: tv,
  MODEL_FOR_TEXT_TO_WAVEFORM_MAPPING_NAMES: rv,
  MODEL_FOR_MASKED_LM_MAPPING_NAMES: iv,
  MODEL_FOR_QUESTION_ANSWERING_MAPPING_NAMES: lv,
  MODEL_FOR_IMAGE_CLASSIFICATION_MAPPING_NAMES: hv,
  MODEL_FOR_IMAGE_SEGMENTATION_MAPPING_NAMES: bn,
  MODEL_FOR_SEMANTIC_SEGMENTATION_MAPPING_NAMES: pv,
  MODEL_FOR_UNIVERSAL_SEGMENTATION_MAPPING_NAMES: mv,
  MODEL_FOR_OBJECT_DETECTION_MAPPING_NAMES: fv,
  MODEL_FOR_ZERO_SHOT_OBJECT_DETECTION_MAPPING_NAMES: _v,
  MODEL_FOR_MASK_GENERATION_MAPPING_NAMES: gv,
  MODEL_FOR_CTC_MAPPING_NAMES: wv,
  MODEL_FOR_AUDIO_CLASSIFICATION_MAPPING_NAMES: vv,
  MODEL_FOR_AUDIO_XVECTOR_MAPPING_NAMES: yv,
  MODEL_FOR_AUDIO_FRAME_CLASSIFICATION_MAPPING_NAMES: bv,
  MODEL_FOR_DOCUMENT_QUESTION_ANSWERING_MAPPING_NAMES: KD,
  MODEL_FOR_IMAGE_MATTING_MAPPING_NAMES: Mv,
  MODEL_FOR_IMAGE_TO_IMAGE_MAPPING_NAMES: xv,
  MODEL_FOR_DEPTH_ESTIMATION_MAPPING_NAMES: kv,
  MODEL_FOR_NORMAL_ESTIMATION_MAPPING_NAMES: Tv,
  MODEL_FOR_POSE_ESTIMATION_MAPPING_NAMES: Ev,
  MODEL_FOR_IMAGE_FEATURE_EXTRACTION_MAPPING_NAMES: Av,
  MODEL_FOR_IMAGE_TEXT_TO_TEXT_MAPPING_NAMES: uv,
  MODEL_FOR_AUDIO_TEXT_TO_TEXT_MAPPING_NAMES: dv,
  MODEL_FOR_SEQ_TO_SEQ_CAUSAL_LM_MAPPING_NAMES: av,
  MODEL_FOR_SPEECH_SEQ_2_SEQ_MAPPING_NAMES: ev,
  MODEL_FOR_CAUSAL_LM_MAPPING_NAMES: ov,
  MODEL_FOR_VISION_2_SEQ_MAPPING_NAMES: cv
};
WC(Ce);
var Se = class {
  /**
   * Mapping from model type to model class.
   * @type {Map<string, Object>[]}
   */
  static MODEL_CLASS_MAPPINGS = null;
  /**
   * Whether to attempt to instantiate the base class (`PretrainedModel`) if
   * the model type is not found in the mapping.
   */
  static BASE_IF_FAIL = !1;
  /**
   * Check whether this AutoModel class supports a given model type.
   * @param {string} model_type The model type from config (e.g., 'bert', 'whisper').
   * @returns {boolean} Whether this class can handle the given model type.
   */
  static supports(e) {
    if (!this.MODEL_CLASS_MAPPINGS) return !1;
    for (let t of this.MODEL_CLASS_MAPPINGS)
      if (t.has(e)) return !0;
    return this.BASE_IF_FAIL;
  }
  /** @type {typeof PreTrainedModel.from_pretrained} */
  static async from_pretrained(e, {
    progress_callback: t = null,
    config: r = null,
    cache_dir: n = null,
    local_files_only: s = !1,
    revision: a = "main",
    model_file_name: o = null,
    subfolder: i = "onnx",
    device: l = null,
    dtype: c = null,
    use_external_data_format: d = null,
    session_options: h = {}
  } = {}) {
    let _ = {
      progress_callback: t,
      config: r,
      cache_dir: n,
      local_files_only: s,
      revision: a,
      model_file_name: o,
      subfolder: i,
      device: l,
      dtype: c,
      use_external_data_format: d,
      session_options: h
    };
    if (_.config = await hs.from_pretrained(e, _), !this.MODEL_CLASS_MAPPINGS)
      throw new Error("`MODEL_CLASS_MAPPINGS` not implemented for this type of `AutoClass`: " + this.name);
    let { model_type: p } = _.config;
    for (let w of this.MODEL_CLASS_MAPPINGS) {
      let v = w.get(p);
      if (!v) {
        for (let y of w.values())
          if (y[0] === p) {
            v = y;
            break;
          }
        if (!v) continue;
      }
      return await kl[v].from_pretrained(e, _);
    }
    if (this.BASE_IF_FAIL)
      return e3.has(p) || le.warn(`Unknown model class "${p}", attempting to construct from base class.`), await I.from_pretrained(e, _);
    throw Error(`Unsupported model type: ${p}`);
  }
}, os = class extends Se {
  /**
   * @internal
   * @type {Map<string, Object>[]}
   */
  // @ts-ignore
  static MODEL_CLASS_MAPPINGS = Cv.map((e) => e[0]);
  static BASE_IF_FAIL = !0;
}, Sp = class extends Se {
  static MODEL_CLASS_MAPPINGS = [Ce.MODEL_FOR_SEQUENCE_CLASSIFICATION_MAPPING_NAMES];
}, t3 = class extends Se {
  static MODEL_CLASS_MAPPINGS = [Ce.MODEL_FOR_TOKEN_CLASSIFICATION_MAPPING_NAMES];
}, Ii = class extends Se {
  static MODEL_CLASS_MAPPINGS = [Ce.MODEL_FOR_SEQ_TO_SEQ_CAUSAL_LM_MAPPING_NAMES];
}, r3 = class extends Se {
  static MODEL_CLASS_MAPPINGS = [Ce.MODEL_FOR_SPEECH_SEQ_2_SEQ_MAPPING_NAMES];
}, n3 = class extends Se {
  static MODEL_CLASS_MAPPINGS = [Ce.MODEL_FOR_TEXT_TO_SPECTROGRAM_MAPPING_NAMES];
}, s3 = class extends Se {
  static MODEL_CLASS_MAPPINGS = [Ce.MODEL_FOR_TEXT_TO_WAVEFORM_MAPPING_NAMES];
}, a3 = class extends Se {
  static MODEL_CLASS_MAPPINGS = [Ce.MODEL_FOR_CAUSAL_LM_MAPPING_NAMES];
}, o3 = class extends Se {
  static MODEL_CLASS_MAPPINGS = [Ce.MODEL_FOR_MASKED_LM_MAPPING_NAMES];
}, i3 = class extends Se {
  static MODEL_CLASS_MAPPINGS = [Ce.MODEL_FOR_QUESTION_ANSWERING_MAPPING_NAMES];
}, l3 = class extends Se {
  static MODEL_CLASS_MAPPINGS = [Ce.MODEL_FOR_VISION_2_SEQ_MAPPING_NAMES];
}, c3 = class extends Se {
  static MODEL_CLASS_MAPPINGS = [Ce.MODEL_FOR_IMAGE_CLASSIFICATION_MAPPING_NAMES];
}, Pp = class extends Se {
  static MODEL_CLASS_MAPPINGS = [Ce.MODEL_FOR_IMAGE_SEGMENTATION_MAPPING_NAMES];
}, Fp = class extends Se {
  static MODEL_CLASS_MAPPINGS = [Ce.MODEL_FOR_SEMANTIC_SEGMENTATION_MAPPING_NAMES];
}, Ip = class extends Se {
  static MODEL_CLASS_MAPPINGS = [Ce.MODEL_FOR_UNIVERSAL_SEGMENTATION_MAPPING_NAMES];
}, u3 = class extends Se {
  static MODEL_CLASS_MAPPINGS = [Ce.MODEL_FOR_OBJECT_DETECTION_MAPPING_NAMES];
}, d3 = class extends Se {
  static MODEL_CLASS_MAPPINGS = [Ce.MODEL_FOR_ZERO_SHOT_OBJECT_DETECTION_MAPPING_NAMES];
}, tB = class extends Se {
  static MODEL_CLASS_MAPPINGS = [Ce.MODEL_FOR_MASK_GENERATION_MAPPING_NAMES];
}, h3 = class extends Se {
  static MODEL_CLASS_MAPPINGS = [Ce.MODEL_FOR_CTC_MAPPING_NAMES];
}, f3 = class extends Se {
  static MODEL_CLASS_MAPPINGS = [Ce.MODEL_FOR_AUDIO_CLASSIFICATION_MAPPING_NAMES];
}, rB = class extends Se {
  static MODEL_CLASS_MAPPINGS = [Ce.MODEL_FOR_AUDIO_XVECTOR_MAPPING_NAMES];
}, nB = class extends Se {
  static MODEL_CLASS_MAPPINGS = [Ce.MODEL_FOR_AUDIO_FRAME_CLASSIFICATION_MAPPING_NAMES];
}, _3 = class extends Se {
  static MODEL_CLASS_MAPPINGS = [Ce.MODEL_FOR_DOCUMENT_QUESTION_ANSWERING_MAPPING_NAMES];
}, sB = class extends Se {
  static MODEL_CLASS_MAPPINGS = [Ce.MODEL_FOR_IMAGE_MATTING_MAPPING_NAMES];
}, p3 = class extends Se {
  static MODEL_CLASS_MAPPINGS = [Ce.MODEL_FOR_IMAGE_TO_IMAGE_MAPPING_NAMES];
}, m3 = class extends Se {
  static MODEL_CLASS_MAPPINGS = [Ce.MODEL_FOR_DEPTH_ESTIMATION_MAPPING_NAMES];
}, aB = class extends Se {
  static MODEL_CLASS_MAPPINGS = [Ce.MODEL_FOR_NORMAL_ESTIMATION_MAPPING_NAMES];
}, oB = class extends Se {
  static MODEL_CLASS_MAPPINGS = [Ce.MODEL_FOR_POSE_ESTIMATION_MAPPING_NAMES];
}, g3 = class extends Se {
  static MODEL_CLASS_MAPPINGS = [Ce.MODEL_FOR_IMAGE_FEATURE_EXTRACTION_MAPPING_NAMES];
}, iB = class extends Se {
  static MODEL_CLASS_MAPPINGS = [Ce.MODEL_FOR_IMAGE_TEXT_TO_TEXT_MAPPING_NAMES];
}, lB = class extends Se {
  static MODEL_CLASS_MAPPINGS = [Ce.MODEL_FOR_AUDIO_TEXT_TO_TEXT_MAPPING_NAMES];
};
async function jt(e) {
  return Array.isArray(e) || (e = [e]), await Promise.all(e.map((t) => kt.read(t)));
}
async function Mn(e, t) {
  return Array.isArray(e) || (e = [e]), await Promise.all(
    e.map((r) => typeof r == "string" || r instanceof URL ? t2(r, t) : r instanceof Float64Array ? new Float32Array(r) : r)
  );
}
function Hi(e, t) {
  t && (e = e.map((o) => o | 0));
  let [r, n, s, a] = e;
  return { xmin: r, ymin: n, xmax: s, ymax: a };
}
var je = class extends mt {
  /**
   * Create a new Pipeline.
   * @param {Object} options An object containing the following properties:
   * @param {string} [options.task] The task of the pipeline. Useful for specifying subtasks.
   * @param {PreTrainedModel} [options.model] The model used by the pipeline.
   * @param {PreTrainedTokenizer} [options.tokenizer=null] The tokenizer used by the pipeline (if any).
   * @param {Processor} [options.processor=null] The processor used by the pipeline (if any).
   */
  constructor({ task: e, model: t, tokenizer: r = null, processor: n = null }) {
    super(), this.task = e, this.model = t, this.tokenizer = r, this.processor = n;
  }
  /** @type {DisposeType} */
  async dispose() {
    await this.model.dispose();
  }
}, w3 = class extends /** @type {new (options: TextPipelineConstructorArgs) => TextClassificationPipelineType} */
je {
  async _call(e, { top_k: t = 1 } = {}) {
    let r = this.tokenizer(e, {
      padding: !0,
      truncation: !0
    }), n = await this.model(r), { problem_type: s, id2label: a } = this.model.config, o = s === "multi_label_classification" ? (l) => l.sigmoid() : (l) => new V("float32", at(l.data), l.dims), i = [];
    for (let l of n.logits) {
      let c = o(l), d = await Pn(c, t), h = d[0].tolist(), p = d[1].tolist().map((w, v) => ({
        label: a ? a[w] : `LABEL_${w}`,
        score: h[v]
      }));
      t === 1 ? i.push(...p) : i.push(p);
    }
    return Array.isArray(e) || t === 1 ? i : i[0];
  }
}, v3 = class extends /** @type {new (options: TextPipelineConstructorArgs) => TokenClassificationPipelineType} */
je {
  async _call(e, { ignore_labels: t = ["O"], aggregation_strategy: r = "none" } = {}) {
    if (r !== "none" && r !== "simple")
      throw new Error(
        `Invalid aggregation_strategy: "${r}". Must be one of "none" or "simple".`
      );
    let n = Array.isArray(e), s = this.tokenizer(n ? e : [e], {
      padding: !0,
      truncation: !0
    }), o = (await this.model(s)).logits, i = this.model.config.id2label, l = [];
    for (let c = 0; c < o.dims[0]; ++c) {
      let d = s.input_ids[c].tolist(), h = o[c], _ = [];
      for (let p = 0; p < h.dims[0]; ++p) {
        let w = h[p], v = qe(w.data)[1], y = i ? i[v] : `LABEL_${v}`;
        if (t.includes(y)) continue;
        let b = this.tokenizer.decode([d[p]], { skip_special_tokens: !0 });
        if (b === "") continue;
        let k = at(w.data);
        _.push({
          entity: y,
          score: k[v],
          index: p,
          word: b
          // TODO: Add support for start and end
        });
      }
      l.push(r === "simple" ? b3(_, d, this.tokenizer) : _);
    }
    return n ? l : l[0];
  }
};
function y3(e) {
  let t = e[0];
  return e[1] === "-" && (t === "B" || t === "I" || t === "E" || t === "S") ? [t, e.slice(2)] : ["I", e];
}
function b3(e, t, r) {
  let n = [], s = null;
  for (let a = 0; a < e.length; ++a) {
    let [o, i] = y3(e[a].entity);
    s === i && o !== "B" && o !== "S" ? (n[n.length - 1].end = a + 1, o === "E" && (s = null)) : (n.push({ tag: i, start: a, end: a + 1 }), s = o === "S" ? null : i);
  }
  return n.map(({ tag: a, start: o, end: i }) => {
    let l = 0, c = [];
    for (let d = o; d < i; ++d)
      l += e[d].score, c.push(t[e[d].index]);
    return {
      entity_group: a,
      score: l / (i - o),
      word: r.decode(c, { skip_special_tokens: !0 })
    };
  });
}
var M3 = class extends /** @type {new (options: TextPipelineConstructorArgs) => QuestionAnsweringPipelineType} */
je {
  async _call(e, t, { top_k: r = 1 } = {}) {
    let n = this.tokenizer(e, {
      text_pair: t,
      padding: !0,
      truncation: !0
    }), s = Array.isArray(e), { start_logits: a, end_logits: o } = await this.model(n), i = n.input_ids.tolist(), l = n.attention_mask.tolist(), { all_special_ids: c, sep_token_id: d } = this.tokenizer, h = [];
    for (let _ = 0; _ < a.dims[0]; ++_) {
      let p = i[_], w = p.findIndex(
        (C) => (
          // We use == to match bigint with number
          // @ts-ignore
          C == d
        )
      ), v = a[_].tolist(), y = o[_].tolist();
      for (let C = 1; C < v.length; ++C)
        (l[_] == 0 || // is part of padding
        C <= w || // is before the sep_token
        c.findIndex((N) => N == p[C]) !== -1) && (v[C] = -1 / 0, y[C] = -1 / 0);
      let b = at(v).map((C, N) => [C, N]), k = at(y).map((C, N) => [C, N]);
      b[0][0] = 0, k[0][0] = 0;
      let A = DM(b, k).filter((C) => C[0][1] <= C[1][1]).map((C) => [C[0][1], C[1][1], C[0][0] * C[1][0]]).sort((C, N) => N[2] - C[2]), E = [];
      for (let C = 0; C < Math.min(A.length, r); ++C) {
        let [N, M, $] = A[C], R = p.slice(N, M + 1), W = this.tokenizer.decode(R, {
          skip_special_tokens: !0
        });
        E.push({
          answer: W,
          score: $
        });
      }
      r === 1 ? h.push(...E) : h.push(E);
    }
    return s ? h : h[0];
  }
}, x3 = class extends /** @type {new (options: TextPipelineConstructorArgs) => FillMaskPipelineType} */
je {
  async _call(e, { top_k: t = 5 } = {}) {
    let { mask_token_id: r, mask_token: n } = this.tokenizer, s = this.tokenizer(e, {
      padding: !0,
      truncation: !0
    }), { logits: a } = await this.model(s), o = [], i = s.input_ids.tolist();
    for (let l = 0; l < i.length; ++l) {
      let c = i[l], d = c.findIndex(
        (v) => (
          // We use == to match bigint with number
          // @ts-ignore - TS2367: Intentional loose equality for bigint/number comparison
          v == r
        )
      );
      if (d === -1)
        throw Error(`Mask token (${n}) not found in text.`);
      let h = a[l][d], _ = await Pn(new V("float32", at(h.data), h.dims), t), p = _[0].tolist(), w = _[1].tolist();
      o.push(
        w.map((v, y) => {
          let b = c.slice();
          return b[d] = v, {
            score: p[y],
            token: Number(v),
            token_str: this.tokenizer.decode([v]),
            sequence: this.tokenizer.decode(b, {
              skip_special_tokens: !0
            })
          };
        })
      );
    }
    return Array.isArray(e) ? o : o[0];
  }
}, Iu = class extends /** @type {new (options: TextPipelineConstructorArgs) => Text2TextGenerationPipelineType} */
je {
  _default_generation_config = {
    max_new_tokens: 256
    // do_sample: true,
    // temperature: 0.7,
  };
  /** @type {'generated_text'} */
  _key = "generated_text";
  /** @type {Text2TextGenerationPipelineCallback} */
  async _call(e, t = {}) {
    Array.isArray(e) || (e = [e]), this.model.config.prefix && (e = e.map((i) => this.model.config.prefix + i));
    let r = this.model.config.task_specific_params;
    r && r[this.task] && r[this.task].prefix && (e = e.map((i) => r[this.task].prefix + i));
    let n = this.tokenizer, s = {
      padding: !0,
      truncation: !0
    }, a;
    this.task === "translation" && "_build_translation_inputs" in n ? a = n._build_translation_inputs(e, s, t) : a = n(e, s);
    let o = await this.model.generate({
      ...a,
      ...this._default_generation_config,
      ...t
    });
    return n.batch_decode(
      /** @type {Tensor} */
      o,
      {
        skip_special_tokens: !0
      }
    ).map((i) => ({ [this._key]: i }));
  }
}, k3 = class extends /** @type {new (options: TextPipelineConstructorArgs) => SummarizationPipelineType} */
/** @type {any} */
Iu {
  /** @type {'summary_text'} */
  _key = "summary_text";
}, T3 = class extends /** @type {new (options: TextPipelineConstructorArgs) => TranslationPipelineType} */
/** @type {any} */
Iu {
  /** @type {'translation_text'} */
  _key = "translation_text";
};
function Lp(e) {
  return Array.isArray(e) && e.every((t) => "role" in t && "content" in t);
}
var E3 = class extends /** @type {new (options: TextPipelineConstructorArgs) => TextGenerationPipelineType} */
je {
  _default_generation_config = {
    max_new_tokens: 256
    // do_sample: true,
    // temperature: 0.7,
  };
  /**
   * @param {string | string[] | import('../tokenization_utils.js').Message[] | import('../tokenization_utils.js').Message[][]} texts
   * @param {Partial<TextGenerationConfig>} generate_kwargs
   */
  async _call(e, t = {}) {
    let {
      add_special_tokens: r,
      return_full_text: n,
      tools: s,
      documents: a,
      chat_template: o,
      tokenizer_encode_kwargs: i,
      ...l
    } = t, c = !1, d = !1, h = r ?? (this.tokenizer.add_bos_token || this.tokenizer.add_eos_token) ?? !1, _ = i, p;
    if (typeof e == "string")
      p = e = [e];
    else if (Array.isArray(e) && e.every((E) => typeof E == "string"))
      c = !0, p = /** @type {string[]} */
      e;
    else {
      if (Lp(e))
        e = [
          /** @type {Chat} */
          e
        ];
      else if (Array.isArray(e) && e.every(Lp))
        c = !0;
      else
        throw new Error("Input must be a string, an array of strings, a Chat, or an array of Chats");
      d = !0;
      let E = {
        tokenize: !1,
        add_generation_prompt: !0,
        ...et({ tools: s, documents: a, chat_template: o }, ["tools", "documents", "chat_template"]),
        ..._
      };
      p = /** @type {string[]} */
      /** @type {Chat[]} */
      e.map(
        (C) => (
          /** @type {string} */
          /** @type {unknown} */
          this.tokenizer.apply_chat_template(C, E)
        )
      ), h = !1, _ = void 0;
    }
    let w = d ? !1 : n ?? !0;
    this.tokenizer.padding_side = "left";
    let v = this.tokenizer(p, {
      add_special_tokens: h,
      padding: !0,
      truncation: !0,
      ..._
    }), y = (
      /** @type {Tensor} */
      await this.model.generate({
        ...v,
        ...this._default_generation_config,
        ...l
      })
    ), b = this.tokenizer.batch_decode(y, {
      skip_special_tokens: !0
    }), k;
    !w && v.input_ids.dims.at(-1) > 0 && (k = this.tokenizer.batch_decode(v.input_ids, {
      skip_special_tokens: !0
    }).map((E) => E.length));
    let A = Array.from({ length: e.length }, (E) => []);
    for (let E = 0; E < b.length; ++E) {
      let C = Math.floor(E / y.dims[0] * e.length);
      k && (b[E] = b[E].slice(k[C])), A[C].push(
        /** @type {TextGenerationSingle} */
        {
          generated_text: d ? [.../** @type {Chat[]} */
          e[C], { role: "assistant", content: b[E] }] : b[E]
        }
      );
    }
    return !c && A.length === 1 ? A[0] : A;
  }
}, A3 = class extends /** @type {new (options: TextPipelineConstructorArgs) => ZeroShotClassificationPipelineType} */
je {
  /**
   * Create a new ZeroShotClassificationPipeline.
   * @param {TextPipelineConstructorArgs} options An object used to instantiate the pipeline.
   */
  constructor(e) {
    super(e), this.label2id = Object.fromEntries(
      Object.entries(
        /** @type {any} */
        this.model.config.label2id
      ).map(([t, r]) => [t.toLowerCase(), r])
    ), this.entailment_id = this.label2id.entailment, this.entailment_id === void 0 && (le.warn("Could not find 'entailment' in label2id mapping. Using 2 as entailment_id."), this.entailment_id = 2), this.contradiction_id = this.label2id.contradiction ?? this.label2id.not_entailment, this.contradiction_id === void 0 && (le.warn("Could not find 'contradiction' in label2id mapping. Using 0 as contradiction_id."), this.contradiction_id = 0);
  }
  async _call(e, t, { hypothesis_template: r = "This example is {}.", multi_label: n = !1 } = {}) {
    let s = Array.isArray(e);
    s || (e = [
      /** @type {string} */
      e
    ]), Array.isArray(t) || (t = [t]);
    let a = t.map((l) => r.replace("{}", l)), o = n || t.length === 1, i = [];
    for (let l of e) {
      let c = [];
      for (let _ of a) {
        let p = this.tokenizer(l, {
          text_pair: _,
          padding: !0,
          truncation: !0
        }), w = await this.model(p);
        o ? c.push([
          w.logits.data[this.contradiction_id],
          w.logits.data[this.entailment_id]
        ]) : c.push(w.logits.data[this.entailment_id]);
      }
      let h = (o ? c.map((_) => at(_)[1]) : at(c)).map((_, p) => [_, p]).sort((_, p) => p[0] - _[0]);
      i.push({
        sequence: l,
        labels: h.map((_) => t[_[1]]),
        scores: h.map((_) => _[0])
      });
    }
    return s ? i : i[0];
  }
}, C3 = class extends /** @type {new (options: AudioPipelineConstructorArgs) => AudioClassificationPipelineType} */
je {
  async _call(e, { top_k: t = 5 } = {}) {
    let r = this.processor.feature_extractor.config.sampling_rate, n = await Mn(e, r), s = this.model.config.id2label, a = [];
    for (let o of n) {
      let i = await this.processor(o), c = (await this.model(i)).logits[0], d = await Pn(new V("float32", at(c.data), c.dims), t), h = d[0].tolist(), p = d[1].tolist().map((w, v) => ({
        label: (
          /** @type {string} */
          s ? s[w] : `LABEL_${w}`
        ),
        score: (
          /** @type {number} */
          h[v]
        )
      }));
      a.push(p);
    }
    return Array.isArray(e) ? a : a[0];
  }
}, S3 = class extends /** @type {new (options: \u0054extAudioPipelineConstructorArgs) => ZeroShotAudioClassificationPipelineType} */
je {
  async _call(e, t, { hypothesis_template: r = "This is a sound of {}." } = {}) {
    let n = !Array.isArray(e);
    n && (e = [
      /** @type {AudioInput} */
      e
    ]);
    let s = t.map((c) => r.replace("{}", c)), a = this.tokenizer(s, {
      padding: !0,
      truncation: !0
    }), o = this.processor.feature_extractor.config.sampling_rate, i = await Mn(e, o), l = [];
    for (let c of i) {
      let d = await this.processor(c), h = await this.model({ ...a, ...d }), _ = at(h.logits_per_audio.data);
      l.push(
        [..._].map((p, w) => ({
          score: p,
          label: t[w]
        }))
      );
    }
    return n ? l[0] : l;
  }
}, P3 = class extends /** @type {new (options: \u0054extAudioPipelineConstructorArgs) => AutomaticSpeechRecognitionPipelineType} */
je {
  _default_generation_config = {
    // TODO: figure out good defaults for ASR generation parameters
    // max_new_tokens: 256,
    // num_beams: 5,
  };
  async _call(e, t = {}) {
    switch (t = {
      ...this._default_generation_config,
      ...t
    }, this.model.config.model_type) {
      case "whisper":
      case "lite-whisper":
        return this._call_whisper(e, t);
      case "wav2vec2":
      case "wav2vec2-bert":
      case "unispeech":
      case "unispeech-sat":
      case "hubert":
      case "parakeet_ctc":
        return this._call_wav2vec2(e, t);
      case "moonshine":
        return this._call_moonshine(e, t);
      case "cohere_asr":
        return this._call_cohere_asr(e, t);
      default:
        throw new Error(
          `AutomaticSpeechRecognitionPipeline does not support model type '${this.model.config.model_type}'.`
        );
    }
  }
  async _call_wav2vec2(e, t) {
    t.language && le.warn('`language` parameter is not yet supported for `wav2vec2` models, defaulting to "English".'), t.task && le.warn('`task` parameter is not yet supported for `wav2vec2` models, defaulting to "transcribe".');
    let r = !Array.isArray(e), n = r ? [e] : e, s = this.processor.feature_extractor.config.sampling_rate, a = await Mn(n, s), o = [];
    for (let i of a) {
      let l = await this.processor(i), d = (await this.model(l)).logits[0], h = [];
      for (let p of d)
        h.push(qe(p.data)[1]);
      let _ = this.tokenizer.decode(h, { skip_special_tokens: !0 }).trim();
      o.push({ text: _ });
    }
    return r ? o[0] : o;
  }
  async _call_whisper(e, t) {
    let r = t.return_timestamps ?? !1, n = t.chunk_length_s ?? 0, s = t.force_full_sequences ?? !1, a = t.stride_length_s ?? null, o = { ...t };
    r === "word" && (o.return_token_timestamps = !0, o.return_timestamps = !0);
    let i = !Array.isArray(e), l = i ? [e] : e, c = this.processor.feature_extractor.config, d = c.chunk_length / this.model.config.max_source_positions, h = c.hop_length, _ = c.sampling_rate, p = await Mn(l, _), w = [];
    for (let v of p) {
      let y = [];
      if (n > 0) {
        if (a === null)
          a = n / 6;
        else if (n <= a)
          throw Error("`chunk_length_s` must be larger than `stride_length_s`.");
        let A = _ * n, E = _ * a, C = A - 2 * E, N = 0;
        for (; ; ) {
          let M = N + A, $ = v.subarray(N, M), R = await this.processor($), W = N === 0, Q = M >= v.length;
          if (y.push({
            stride: [$.length, W ? 0 : E, Q ? 0 : E],
            input_features: R.input_features,
            is_last: Q
          }), Q) break;
          N += C;
        }
      } else
        y = [
          {
            stride: [v.length, 0, 0],
            input_features: (await this.processor(v)).input_features,
            is_last: !0
          }
        ];
      for (let A of y) {
        o.num_frames = Math.floor(A.stride[0] / h);
        let E = await this.model.generate({
          inputs: A.input_features,
          ...o
        });
        if (r === "word") {
          let C = E.sequences.tolist()[0], N = E.token_timestamps.tolist()[0], M = this.tokenizer.timestamp_begin, $ = Math.max(
            C.findIndex((R) => Number(R) >= M),
            0
          );
          A.tokens = C.slice($), A.token_timestamps = N.slice($).map((R) => as(R, 2));
        } else
          A.tokens = /** @type {Tensor} */
          E[0].tolist();
        A.stride = A.stride.map((C) => C / _);
      }
      let [b, k] = this.tokenizer._decode_asr(y, {
        time_precision: d,
        return_timestamps: r,
        force_full_sequences: s
      });
      w.push({ text: b, ...k });
    }
    return i ? w[0] : w;
  }
  async _call_moonshine(e, t) {
    let r = !Array.isArray(e), n = r ? [e] : e, s = this.processor.feature_extractor.config.sampling_rate, a = await Mn(n, s), o = [];
    for (let i of a) {
      let l = await this.processor(i), c = Math.floor(i.length / s) * 6, d = await this.model.generate({ max_new_tokens: c, ...t, ...l }), h = this.tokenizer.batch_decode(
        /** @type {Tensor} */
        d,
        { skip_special_tokens: !0 }
      )[0];
      o.push({ text: h });
    }
    return r ? o[0] : o;
  }
  async _call_cohere_asr(e, t) {
    let r = !Array.isArray(e), n = r ? [e] : e, s = this.processor.feature_extractor, a = s.config.sampling_rate, o = await Mn(n, a), i = t.language ?? "en", l = this.processor.get_decoder_prompt_ids(i), c = [];
    for (let d of o) {
      let h = s.split_audio(d), _ = [];
      for (let w of h) {
        let v = await this.processor(w), y = await this.model.generate({
          ...v,
          decoder_input_ids: l,
          ...t
        }), b = this.tokenizer.decode(
          /** @type {Tensor} */
          y[0].tolist(),
          { skip_special_tokens: !0 }
        ).trim();
        _.push(b);
      }
      let p = this.processor.constructor.join_chunks(_, i);
      c.push({ text: p });
    }
    return r ? c[0] : c;
  }
}, F3 = class extends /** @type {new (options: TextToAudioPipelineConstructorArgs) => TextToAudioPipelineType} */
je {
  DEFAULT_VOCODER_ID = "Xenova/speecht5_hifigan";
  /**
   * Create a new TextToAudioPipeline.
   * @param {TextToAudioPipelineConstructorArgs} options An object used to instantiate the pipeline.
   */
  constructor(e) {
    super(e), this.vocoder = e.vocoder ?? null;
  }
  async _prepare_speaker_embeddings(e, t) {
    if ((typeof e == "string" || e instanceof URL) && (e = new Float32Array(await (await ge.fetch(e)).arrayBuffer())), e instanceof Float32Array)
      e = new V("float32", e, [e.length]);
    else if (!(e instanceof V))
      throw new Error("Speaker embeddings must be a `Tensor`, `Float32Array`, `string`, or `URL`.");
    if (t > 1) {
      if (e.dims[0] === 1)
        e = e.repeat(t, 1);
      else if (e.dims[0] !== t)
        throw new Error(
          `Expected speaker embeddings batch size to be 1 or ${t}, but got ${e.dims[0]}.`
        );
    }
    return e;
  }
  /**
   * Helper to convert batched waveform tensor to RawAudio output(s).
   * @param {string|string[]} text_inputs Original text input(s) to determine return type.
   * @param {Tensor} waveform The waveform tensor of shape [batch_size, waveform_length].
   * @param {number} sampling_rate The audio sampling rate.
   * @param {Tensor} [durations] Optional durations tensor for trimming (used by Supertonic).
   * @returns {RawAudio|RawAudio[]} Single RawAudio or array based on input type.
   * @private
   */
  _postprocess_waveform(e, t, r, n = null) {
    let s = (
      /** @type {Float32Array} */
      t.data
    ), [a, o] = t.dims, i = n ? (
      /** @type {Float32Array} */
      n.data
    ) : null, l = [];
    for (let c = 0; c < a; ++c) {
      let d = i ? Math.min(Math.ceil(i[c]), o) : o, h = c * o;
      l.push(new d2(s.slice(h, h + d), r));
    }
    return Array.isArray(e) ? l : l[0];
  }
  async _call(e, t) {
    return this.processor ? this._call_text_to_spectrogram(e, t) : this.model.config.model_type === "supertonic" ? this._call_supertonic(e, t) : this._call_text_to_waveform(e);
  }
  async _call_supertonic(e, { speaker_embeddings: t, num_inference_steps: r, speed: n }) {
    if (!t)
      throw new Error("Speaker embeddings must be provided for Supertonic models.");
    let { sampling_rate: s, style_dim: a } = this.model.config, o = this.tokenizer(e, {
      padding: !0,
      truncation: !0
    }), i = o.input_ids.dims[0];
    t = await this._prepare_speaker_embeddings(t, i), t = /** @type {Tensor} */
    t.view(i, -1, a);
    let { waveform: l, durations: c } = await this.model.generate_speech({
      ...o,
      style: t,
      num_inference_steps: r,
      speed: n
    });
    return this._postprocess_waveform(e, l, s, c);
  }
  async _call_text_to_waveform(e) {
    let t = this.tokenizer(e, {
      padding: !0,
      truncation: !0
    }), { waveform: r } = await this.model(t), n = this.model.config.sampling_rate;
    return this._postprocess_waveform(e, r, n);
  }
  async _call_text_to_spectrogram(e, { speaker_embeddings: t }) {
    this.vocoder || (le.info("No vocoder specified, using default HifiGan vocoder."), this.vocoder = await os.from_pretrained(this.DEFAULT_VOCODER_ID, { dtype: "fp32" }));
    let { input_ids: r } = this.tokenizer(e, {
      padding: !0,
      truncation: !0
    }), n = r.dims[0];
    t = await this._prepare_speaker_embeddings(t, n), t = t.view(n, -1);
    let { waveform: s } = await this.model.generate_speech(r, t, { vocoder: this.vocoder }), a = this.processor.feature_extractor.config.sampling_rate;
    return this._postprocess_waveform(e, s, a);
  }
}, I3 = class extends /** @type {new (options: \u0054extImagePipelineConstructorArgs) => ImageToTextPipelineType} */
je {
  async _call(e, t = {}) {
    let r = Array.isArray(e), n = await jt(e), { pixel_values: s } = await this.processor(n), a = [];
    for (let o of s) {
      o.dims = [1, ...o.dims];
      let i = await this.model.generate({ inputs: o, ...t }), l = this.tokenizer.batch_decode(
        /** @type {Tensor} */
        i,
        {
          skip_special_tokens: !0
        }
      ).map((c) => ({ generated_text: c.trim() }));
      a.push(l);
    }
    return r ? a : a[0];
  }
}, L3 = class extends /** @type {new (options: ImagePipelineConstructorArgs) => ImageClassificationPipelineType} */
je {
  async _call(e, { top_k: t = 5 } = {}) {
    let r = await jt(e), { pixel_values: n } = await this.processor(r), s = await this.model({ pixel_values: n }), { id2label: a } = this.model.config, o = [];
    for (let i of s.logits) {
      let l = await Pn(new V("float32", at(i.data), i.dims), t), c = l[0].tolist(), h = l[1].tolist().map((_, p) => ({
        label: (
          /** @type {string} */
          a ? a[_] : `LABEL_${_}`
        ),
        score: (
          /** @type {number} */
          c[p]
        )
      }));
      o.push(h);
    }
    return Array.isArray(e) ? o : o[0];
  }
}, Op = {
  // Mapping of subtasks to their corresponding post-processing function names.
  panoptic: "post_process_panoptic_segmentation",
  instance: "post_process_instance_segmentation",
  semantic: "post_process_semantic_segmentation"
}, Pv = class extends /** @type {new (options: ImagePipelineConstructorArgs) => ImageSegmentationPipelineType} */
je {
  /** @type {ImageSegmentationPipelineCallback} */
  async _call(e, {
    threshold: t = 0.5,
    mask_threshold: r = 0.5,
    overlap_mask_area_threshold: n = 0.8,
    label_ids_to_fuse: s = null,
    target_sizes: a = null,
    subtask: o = null
  } = {}) {
    if (Array.isArray(e) && e.length !== 1)
      throw Error("Image segmentation pipeline currently only supports a batch size of 1.");
    let l = await jt(e), c = l.map((b) => [b.height, b.width]), d = await this.processor(l), { inputNames: h, outputNames: _ } = this.model.sessions.model;
    if (!h.includes("pixel_values")) {
      if (h.length !== 1)
        throw Error(`Expected a single input name, but got ${h.length} inputs: ${h}.`);
      let b = h[0];
      if (b in d)
        throw Error(`Input name ${b} already exists in the inputs.`);
      d[b] = d.pixel_values;
    }
    let p = await this.model(d), w = null;
    if (o !== null)
      w = Op[o];
    else if (this.processor.image_processor) {
      for (let [b, k] of Object.entries(Op))
        if (k in this.processor.image_processor) {
          w = this.processor.image_processor[k].bind(this.processor.image_processor), o = b;
          break;
        }
    }
    let v = this.model.config.id2label, y = [];
    if (o)
      if (o === "panoptic" || o === "instance") {
        let b = w(
          p,
          t,
          r,
          n,
          s,
          a ?? c
          // TODO FIX?
        )[0], k = b.segmentation;
        for (let A of b.segments_info) {
          let E = new Uint8ClampedArray(k.data.length);
          for (let N = 0; N < k.data.length; ++N)
            k.data[N] === A.id && (E[N] = 255);
          let C = new kt(E, k.dims[1], k.dims[0], 1);
          y.push({
            score: A.score,
            label: v[A.label_id],
            mask: C
          });
        }
      } else if (o === "semantic") {
        let { segmentation: b, labels: k } = w(p, a ?? c)[0];
        for (let A of k) {
          let E = new Uint8ClampedArray(b.data.length);
          for (let N = 0; N < b.data.length; ++N)
            b.data[N] === A && (E[N] = 255);
          let C = new kt(E, b.dims[1], b.dims[0], 1);
          y.push({
            score: null,
            label: v[A],
            mask: C
          });
        }
      } else
        throw Error(`Subtask ${o} not supported.`);
    else {
      let k = p[_[0]];
      for (let A = 0; A < c.length; ++A) {
        let E = c[A], C = k[A];
        C.data.some((M) => M < -1e-5 || M > 1 + 1e-5) && C.sigmoid_();
        let N = await kt.fromTensor(C.mul_(255).to("uint8")).resize(E[1], E[0]);
        y.push({
          label: null,
          score: null,
          mask: N
        });
      }
    }
    return y;
  }
}, O3 = class extends /** @type {new (options: ImagePipelineConstructorArgs) => BackgroundRemovalPipelineType} */
/** @type {any} */
Pv {
  async _call(e, t = {}) {
    let r = await jt(e), n = await super._call(e, t), s = r.map((a, o) => {
      let i = a.clone();
      return i.putAlpha(n[o].mask), i;
    });
    return Array.isArray(e) ? s : s[0];
  }
}, N3 = class extends /** @type {new (options: \u0054extImagePipelineConstructorArgs) => ZeroShotImageClassificationPipelineType} */
je {
  async _call(e, t, { hypothesis_template: r = "This is a photo of {}" } = {}) {
    let n = Array.isArray(e), s = await jt(e), a = t.map((h) => r.replace("{}", h)), o = this.tokenizer(a, {
      padding: this.model.config.model_type === "siglip" ? "max_length" : !0,
      truncation: !0
    }), { pixel_values: i } = await this.processor(s), l = await this.model({ ...o, pixel_values: i }), c = this.model.config.model_type === "siglip" ? (h) => h.sigmoid().data : (h) => at(h.data), d = [];
    for (let h of l.logits_per_image) {
      let p = [...c(h)].map((w, v) => ({
        score: w,
        label: t[v]
      }));
      p.sort((w, v) => v.score - w.score), d.push(p);
    }
    return n ? d : d[0];
  }
}, D3 = class extends /** @type {new (options: ImagePipelineConstructorArgs) => ObjectDetectionPipelineType} */
je {
  async _call(e, { threshold: t = 0.9, percentage: r = !1 } = {}) {
    let n = Array.isArray(e);
    if (n && e.length !== 1)
      throw Error("Object detection pipeline currently only supports a batch size of 1.");
    let s = await jt(e), a = r ? null : s.map((_) => [_.height, _.width]), { pixel_values: o, pixel_mask: i } = await this.processor(s), l = await this.model({ pixel_values: o, pixel_mask: i }), c = this.processor.image_processor.post_process_object_detection(l, t, a), { id2label: d } = this.model.config, h = c.map(
      (_) => _.boxes.map((p, w) => ({
        score: _.scores[w],
        label: d[_.classes[w]],
        box: Hi(p, !r)
      }))
    );
    return n ? h : h[0];
  }
}, z3 = class extends /** @type {new (options: \u0054extImagePipelineConstructorArgs) => ZeroShotObjectDetectionPipelineType} */
je {
  async _call(e, t, { threshold: r = 0.1, top_k: n = null, percentage: s = !1 } = {}) {
    let a = Array.isArray(e), o = await jt(e), i = this.tokenizer(t, {
      padding: !0,
      truncation: !0
    }), l = await this.processor(o), c = [];
    for (let d = 0; d < o.length; ++d) {
      let h = o[d], _ = s ? null : [[h.height, h.width]], p = l.pixel_values[d].unsqueeze_(0), w = await this.model({ ...i, pixel_values: p }), v;
      if ("post_process_grounded_object_detection" in this.processor) {
        let y = this.processor.post_process_grounded_object_detection(w, i.input_ids, {
          // TODO: support separate threshold values
          box_threshold: r,
          text_threshold: r,
          target_sizes: _
        })[0];
        v = y.boxes.map((b, k) => ({
          score: y.scores[k],
          label: y.labels[k],
          box: Hi(b, !s)
        }));
      } else {
        let y = this.processor.image_processor.post_process_object_detection(
          w,
          r,
          _,
          !0
        )[0];
        v = y.boxes.map((b, k) => ({
          score: y.scores[k],
          label: t[y.classes[k]],
          box: Hi(b, !s)
        }));
      }
      v.sort((y, b) => b.score - y.score), n !== null && (v = v.slice(0, n)), c.push(v);
    }
    return a ? c : c[0];
  }
}, B3 = class extends /** @type {new (options: \u0054extImagePipelineConstructorArgs) => DocumentQuestionAnsweringPipelineType} */
je {
  _default_generation_config = {
    max_new_tokens: 256
  };
  async _call(e, t, r = {}) {
    if (Array.isArray(e)) {
      if (e.length !== 1)
        throw Error("Document Question Answering pipeline currently only supports a batch size of 1.");
      e = e[0];
    }
    let n = (await jt(e))[0], { pixel_values: s } = await this.processor(n), a = `<s_docvqa><s_question>${t}</s_question><s_answer>`, o = this.tokenizer(a, {
      add_special_tokens: !1,
      padding: !0,
      truncation: !0
    }).input_ids, i = await this.model.generate({
      inputs: s,
      // @ts-expect-error Ts2339
      max_length: this.model.config.decoder.max_position_embeddings,
      decoder_input_ids: o,
      ...this._default_generation_config,
      ...r
    }), c = this.tokenizer.batch_decode(
      /** @type {Tensor} */
      i
    )[0].match(/<s_answer>(.*?)<\/s_answer>/), d = null;
    return c && c.length >= 2 && (d = c[1].trim()), [{ answer: d }];
  }
}, R3 = class extends /** @type {new (options: ImagePipelineConstructorArgs) => ImageToImagePipelineType} */
je {
  async _call(e) {
    let t = await jt(e), r = await this.processor(t), n = await this.model(r), s = [];
    for (let a of n.reconstruction) {
      let o = a.squeeze().clamp_(0, 1).mul_(255).round_().to("uint8");
      s.push(kt.fromTensor(o));
    }
    return Array.isArray(e) ? s : s[0];
  }
}, $3 = class extends /** @type {new (options: ImagePipelineConstructorArgs) => DepthEstimationPipelineType} */
je {
  async _call(e) {
    let t = await jt(e), r = await this.processor(t), { predicted_depth: n } = await this.model(r), s = [];
    for (let a = 0; a < t.length; ++a) {
      let o = n[a], [i, l] = o.dims.slice(-2), [c, d] = t[a].size, h = (await Rt(o.view(1, 1, i, l), {
        size: [d, c],
        mode: "bilinear"
      })).view(d, c), _ = (
        /** @type {number} */
        h.min().item()
      ), p = (
        /** @type {number} */
        h.max().item()
      ), w = h.sub(_).div_(p - _).mul_(255).to("uint8").unsqueeze(0), v = kt.fromTensor(w);
      s.push({
        predicted_depth: h,
        depth: v
      });
    }
    return Array.isArray(e) ? s : s[0];
  }
}, G3 = class extends /** @type {new (options: TextPipelineConstructorArgs) => FeatureExtractionPipelineType} */
je {
  /** @type {FeatureExtractionPipelineCallback} */
  async _call(e, {
    pooling: t = (
      /** @type {'none'} */
      "none"
    ),
    normalize: r = !1,
    quantize: n = !1,
    precision: s = (
      /** @type {'binary'} */
      "binary"
    )
  } = {}) {
    let a = this.tokenizer(e, {
      padding: !0,
      truncation: !0
    }), o = await this.model(a), i = o.last_hidden_state ?? o.logits ?? o.token_embeddings;
    switch (t) {
      case "none":
        break;
      case "mean":
        i = HT(i, a.attention_mask);
        break;
      case "first_token":
      case "cls":
        i = i.slice(null, 0);
        break;
      case "last_token":
      case "eos":
        i = i.slice(null, -1);
        break;
      default:
        throw Error(`Pooling method '${t}' not supported.`);
    }
    return r && (i = i.normalize(2, -1)), n && (i = YT(i, s)), i;
  }
}, V3 = class extends /** @type {new (options: ImagePipelineConstructorArgs) => ImageFeatureExtractionPipelineType} */
je {
  /** @type {ImageFeatureExtractionPipelineCallback} */
  async _call(e, { pool: t = null } = {}) {
    let r = await jt(e), { pixel_values: n } = await this.processor(r), s = await this.model({ pixel_values: n }), a;
    if (t) {
      if (!("pooler_output" in s))
        throw Error(
          "No pooled output was returned. Make sure the model has a 'pooler' layer when using the 'pool' option."
        );
      a = s.pooler_output;
    } else
      a = s.last_hidden_state ?? s.logits ?? s.image_embeds;
    return a;
  }
}, Ma = Object.freeze({
  "text-classification": {
    pipeline: w3,
    model: Sp,
    default: {
      model: "Xenova/distilbert-base-uncased-finetuned-sst-2-english"
    },
    type: "text"
  },
  "token-classification": {
    pipeline: v3,
    model: t3,
    default: {
      model: "Xenova/bert-base-multilingual-cased-ner-hrl"
    },
    type: "text"
  },
  "question-answering": {
    pipeline: M3,
    model: i3,
    default: {
      model: "Xenova/distilbert-base-cased-distilled-squad"
    },
    type: "text"
  },
  "fill-mask": {
    pipeline: x3,
    model: o3,
    default: {
      model: "onnx-community/ettin-encoder-32m-ONNX",
      dtype: "fp32"
    },
    type: "text"
  },
  summarization: {
    pipeline: k3,
    model: Ii,
    default: {
      model: "Xenova/distilbart-cnn-6-6"
    },
    type: "text"
  },
  translation: {
    pipeline: T3,
    model: Ii,
    default: {
      model: "Xenova/t5-small"
    },
    type: "text"
  },
  "text2text-generation": {
    pipeline: Iu,
    model: Ii,
    default: {
      model: "Xenova/flan-t5-small"
    },
    type: "text"
  },
  "text-generation": {
    pipeline: E3,
    model: a3,
    default: {
      model: "onnx-community/Qwen3-0.6B-ONNX",
      dtype: "q4"
    },
    type: "text"
  },
  "zero-shot-classification": {
    pipeline: A3,
    model: Sp,
    default: {
      model: "Xenova/distilbert-base-uncased-mnli"
    },
    type: "text"
  },
  "audio-classification": {
    pipeline: C3,
    model: f3,
    default: {
      model: "Xenova/wav2vec2-base-superb-ks"
    },
    type: "audio"
  },
  "zero-shot-audio-classification": {
    pipeline: S3,
    model: os,
    default: {
      model: "Xenova/clap-htsat-unfused"
    },
    type: "multimodal"
  },
  "automatic-speech-recognition": {
    pipeline: P3,
    model: [r3, h3],
    default: {
      model: "Xenova/whisper-tiny.en"
    },
    type: "multimodal"
  },
  "text-to-audio": {
    pipeline: F3,
    model: [s3, n3],
    default: {
      model: "onnx-community/Supertonic-TTS-ONNX",
      dtype: "fp32"
    },
    type: "text"
  },
  "image-to-text": {
    pipeline: I3,
    model: l3,
    default: {
      model: "Xenova/vit-gpt2-image-captioning"
    },
    type: "multimodal"
  },
  "image-classification": {
    pipeline: L3,
    model: c3,
    default: {
      model: "Xenova/vit-base-patch16-224"
    },
    type: "multimodal"
  },
  "image-segmentation": {
    pipeline: Pv,
    model: [Pp, Fp, Ip],
    default: {
      model: "Xenova/detr-resnet-50-panoptic"
    },
    type: "multimodal"
  },
  "background-removal": {
    pipeline: O3,
    model: [Pp, Fp, Ip],
    default: {
      model: "Xenova/modnet"
    },
    type: "image"
  },
  "zero-shot-image-classification": {
    pipeline: N3,
    model: os,
    default: {
      model: "Xenova/clip-vit-base-patch32"
    },
    type: "multimodal"
  },
  "object-detection": {
    pipeline: D3,
    model: u3,
    default: {
      model: "Xenova/detr-resnet-50"
    },
    type: "multimodal"
  },
  "zero-shot-object-detection": {
    pipeline: z3,
    model: d3,
    default: {
      model: "Xenova/owlvit-base-patch32"
    },
    type: "multimodal"
  },
  "document-question-answering": {
    pipeline: B3,
    model: _3,
    default: {
      model: "Xenova/donut-base-finetuned-docvqa"
    },
    type: "multimodal"
  },
  "image-to-image": {
    pipeline: R3,
    model: p3,
    default: {
      model: "Xenova/swin2SR-classical-sr-x2-64"
    },
    type: "image"
  },
  "depth-estimation": {
    pipeline: $3,
    model: m3,
    default: {
      model: "onnx-community/depth-anything-v2-small"
    },
    type: "image"
  },
  "feature-extraction": {
    pipeline: G3,
    model: os,
    default: {
      model: "onnx-community/all-MiniLM-L6-v2-ONNX",
      dtype: "fp32"
    },
    type: "text"
  },
  "image-feature-extraction": {
    pipeline: V3,
    model: [g3, os],
    default: {
      model: "onnx-community/dinov3-vits16-pretrain-lvd1689m-ONNX",
      dtype: "fp32"
    },
    type: "image"
  }
}), Fv = Object.freeze({
  "sentiment-analysis": "text-classification",
  ner: "token-classification",
  // "vqa": "visual-question-answering", // TODO: Add
  asr: "automatic-speech-recognition",
  "text-to-speech": "text-to-audio",
  // Add for backwards compatibility
  embeddings: "feature-extraction"
});
async function U3(e) {
  if (!e)
    throw new Error("modelId is required");
  return (await ms(e, ds, {})).exists ? [ds] : [];
}
async function j3(e, {
  config: t = null,
  dtype: r = null,
  device: n = null,
  model_file_name: s = null,
  include_tokenizer: a = !0,
  include_processor: o = !0
} = {}) {
  let i = await Eg(e, { config: t, dtype: r, device: n, model_file_name: s });
  if (a) {
    let l = await Cm(e);
    i.push(...l);
  }
  if (o) {
    let l = await U3(e);
    i.push(...l);
  }
  return i;
}
async function W3(e, t, r = {}) {
  e = Fv[e] ?? e;
  let n = Ma[e];
  if (!n)
    throw new Error(
      `Unsupported pipeline task: ${e}. Must be one of [${Object.keys(Ma).join(", ")}]`
    );
  let { type: s } = n, i = await j3(t, {
    ...r,
    include_tokenizer: s !== "audio" && s !== "image",
    include_processor: s !== "text"
  });
  if (e === "text-generation") {
    let l = await Tg(t, r), c = kg(l), d = UC(c);
    if (d) {
      let h = Object.values(d).map((_) => `onnx/${_}`);
      return i.filter((_) => !_.startsWith("onnx/") || h.some((p) => _.startsWith(p)));
    }
  }
  return i;
}
async function Lu(e, t = null, {
  progress_callback: r = null,
  config: n = null,
  cache_dir: s = null,
  local_files_only: a = !1,
  revision: o = "main",
  device: i = null,
  dtype: l = null,
  subfolder: c = "onnx",
  use_external_data_format: d = null,
  model_file_name: h = null,
  session_options: _ = {}
} = {}) {
  e = Fv[e] ?? e;
  let p = Ma[e.split("_", 1)[0]];
  if (!p)
    throw Error(`Unsupported pipeline: ${e}. Must be one of [${Object.keys(Ma)}]`);
  t || (t = p.default.model, le.info(`No model specified. Using default model: "${t}".`), !l && p.default.dtype && (l = p.default.dtype));
  let w = await W3(e, t, {
    device: i,
    dtype: l
  }), v = {};
  if (r)
    try {
      (await Promise.all(w.map(async (Q) => ms(t, Q)))).forEach((Q, H) => {
        Q.exists && (v[w[H]] = {
          loaded: 0,
          total: Q.size ?? 0
        });
      });
    } catch (W) {
      le.warn(`Unable to fetch model file metadata for total progress tracking: ${W}`);
    }
  let y = {
    progress_callback: r ? new ca(r, v) : void 0,
    config: n,
    cache_dir: s,
    local_files_only: a,
    revision: o,
    device: i,
    dtype: l,
    subfolder: c,
    use_external_data_format: d,
    model_file_name: h,
    session_options: _
  }, b = w.includes("tokenizer.json"), k = w.includes("preprocessor_config.json"), A = p.model, E;
  if (Array.isArray(A)) {
    let W = n ?? await hs.from_pretrained(t, y), { model_type: Q } = W, H = A.find((q) => q.supports(Q));
    if (!H)
      throw Error(
        `Unsupported model type "${Q}" for task "${e}". None of the candidate model classes support this type.`
      );
    E = H.from_pretrained(t, { ...y, config: W });
  } else
    E = A.from_pretrained(t, y);
  let [C, N, M] = await Promise.all([
    b ? Ee.from_pretrained(t, y) : null,
    k ? _C.from_pretrained(t, y) : null,
    E
  ]), $ = { task: e, model: M };
  C && ($.tokenizer = C), N && ($.processor = N), Sr(r, {
    status: "ready",
    task: e,
    model: t
  });
  let R = p.pipeline;
  return new R($);
}
var cB = me.IS_PROCESS_AVAILABLE ? (e) => process.stdout.write(e) : (e) => console.log(e);
var uB = Object.keys(va);

// src/offscreen.js
var Iv = "onnx-community/depth-anything-v2-small", q3 = 192;
ge.allowLocalModels = !1;
ge.useWasmCache = !1;
ge.backends.onnx.wasm.wasmPaths = {
  mjs: chrome.runtime.getURL("build/ort/ort-wasm-simd-threaded.asyncify.mjs"),
  wasm: chrome.runtime.getURL("build/ort/ort-wasm-simd-threaded.asyncify.wasm")
};
var Ka = null;
async function H3() {
  if (navigator.gpu)
    try {
      return await Lu("depth-estimation", Iv, { device: "webgpu", dtype: "fp16" });
    } catch (e) {
      console.warn("[Walk 3D] WebGPU \u304C\u4F7F\u3048\u306A\u3044\u306E\u3067 WASM \u3067\u63A8\u5B9A\u3057\u307E\u3059", e);
    }
  return Lu("depth-estimation", Iv, { device: "wasm", dtype: "q8" });
}
function Q3(e) {
  let { data: t, width: r, height: n, channels: s } = e, a = 0, o = 0, i = 0;
  for (let c = Math.floor(n * 0.3); c < n; c += 4)
    for (let d = Math.floor(r * 0.2); d < r * 0.8; d += 4) {
      let h = (c * r + d) * s, _ = t[h] + t[h + 1] + t[h + 2];
      o += _, i += _ * _, a += 1;
    }
  let l = o / a;
  return Math.sqrt(Math.max(0, i / a - l * l)) < 12;
}
async function X3(e) {
  Ka || (Ka = H3().catch((d) => {
    throw Ka = null, d;
  }));
  let t = await Ka, r = await kt.fromURL(e);
  if (Q3(r)) return { blank: !0 };
  r.width > 640 && (r = await r.resize(640, Math.round(640 * r.height / r.width)));
  let { predicted_depth: n } = await t(r), [s, a] = n.dims.slice(-2), o = n.data, i = Math.min(q3, a), l = Math.round(i * s / a), c = new Array(i * l);
  for (let d = 0; d < l; d++) {
    let h = Math.min(s - 1, Math.floor((d + 0.5) * s / l));
    for (let _ = 0; _ < i; _++) {
      let p = Math.min(a - 1, Math.floor((_ + 0.5) * a / i));
      c[d * i + _] = Math.round(o[h * a + p] * 1e3) / 1e3;
    }
  }
  return { width: i, height: l, data: c };
}
chrome.runtime.onMessage.addListener((e, t, r) => e?.target !== "offscreen" || e.type !== "depth" ? !1 : (X3(e.dataUrl).then((n) => r({ depth: n })).catch((n) => r({ error: String(n?.message || n) })), !0));
/*! Bundled license information:

onnxruntime-web/dist/ort.webgpu.bundle.min.mjs:
  (*!
   * ONNX Runtime Web v1.31.0-dev.20260914-8d85527a0
   * Copyright (c) Microsoft Corporation. All rights reserved.
   * Licensed under the MIT License.
   *)
*/
