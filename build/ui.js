(() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // node_modules/preact/dist/preact.module.js
  function d(n2, l3) {
    for (var u3 in l3) n2[u3] = l3[u3];
    return n2;
  }
  function g(n2) {
    n2 && n2.parentNode && n2.parentNode.removeChild(n2);
  }
  function _(l3, u3, t3) {
    var i3, r3, o3, e3 = {};
    for (o3 in u3) "key" == o3 ? i3 = u3[o3] : "ref" == o3 ? r3 = u3[o3] : e3[o3] = u3[o3];
    if (arguments.length > 2 && (e3.children = arguments.length > 3 ? n.call(arguments, 2) : t3), "function" == typeof l3 && null != l3.defaultProps) for (o3 in l3.defaultProps) void 0 === e3[o3] && (e3[o3] = l3.defaultProps[o3]);
    return m(l3, e3, i3, r3, null);
  }
  function m(n2, t3, i3, r3, o3) {
    var e3 = { type: n2, props: t3, key: i3, ref: r3, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: null == o3 ? ++u : o3, __i: -1, __u: 0 };
    return null == o3 && null != l.vnode && l.vnode(e3), e3;
  }
  function k(n2) {
    return n2.children;
  }
  function x(n2, l3) {
    this.props = n2, this.context = l3;
  }
  function S(n2, l3) {
    if (null == l3) return n2.__ ? S(n2.__, n2.__i + 1) : null;
    for (var u3; l3 < n2.__k.length; l3++) if (null != (u3 = n2.__k[l3]) && null != u3.__e) return u3.__e;
    return "function" == typeof n2.type ? S(n2) : null;
  }
  function C(n2) {
    var l3, u3;
    if (null != (n2 = n2.__) && null != n2.__c) {
      for (n2.__e = n2.__c.base = null, l3 = 0; l3 < n2.__k.length; l3++) if (null != (u3 = n2.__k[l3]) && null != u3.__e) {
        n2.__e = n2.__c.base = u3.__e;
        break;
      }
      return C(n2);
    }
  }
  function M(n2) {
    (!n2.__d && (n2.__d = true) && i.push(n2) && !$.__r++ || r != l.debounceRendering) && ((r = l.debounceRendering) || o)($);
  }
  function $() {
    for (var n2, u3, t3, r3, o3, f3, c3, s3 = 1; i.length; ) i.length > s3 && i.sort(e), n2 = i.shift(), s3 = i.length, n2.__d && (t3 = void 0, r3 = void 0, o3 = (r3 = (u3 = n2).__v).__e, f3 = [], c3 = [], u3.__P && ((t3 = d({}, r3)).__v = r3.__v + 1, l.vnode && l.vnode(t3), O(u3.__P, t3, r3, u3.__n, u3.__P.namespaceURI, 32 & r3.__u ? [o3] : null, f3, null == o3 ? S(r3) : o3, !!(32 & r3.__u), c3), t3.__v = r3.__v, t3.__.__k[t3.__i] = t3, N(f3, t3, c3), r3.__e = r3.__ = null, t3.__e != o3 && C(t3)));
    $.__r = 0;
  }
  function I(n2, l3, u3, t3, i3, r3, o3, e3, f3, c3, s3) {
    var a3, h3, y3, w3, d3, g2, _2, m3 = t3 && t3.__k || v, b = l3.length;
    for (f3 = P(u3, l3, m3, f3, b), a3 = 0; a3 < b; a3++) null != (y3 = u3.__k[a3]) && (h3 = -1 == y3.__i ? p : m3[y3.__i] || p, y3.__i = a3, g2 = O(n2, y3, h3, i3, r3, o3, e3, f3, c3, s3), w3 = y3.__e, y3.ref && h3.ref != y3.ref && (h3.ref && B(h3.ref, null, y3), s3.push(y3.ref, y3.__c || w3, y3)), null == d3 && null != w3 && (d3 = w3), (_2 = !!(4 & y3.__u)) || h3.__k === y3.__k ? f3 = A(y3, f3, n2, _2) : "function" == typeof y3.type && void 0 !== g2 ? f3 = g2 : w3 && (f3 = w3.nextSibling), y3.__u &= -7);
    return u3.__e = d3, f3;
  }
  function P(n2, l3, u3, t3, i3) {
    var r3, o3, e3, f3, c3, s3 = u3.length, a3 = s3, h3 = 0;
    for (n2.__k = new Array(i3), r3 = 0; r3 < i3; r3++) null != (o3 = l3[r3]) && "boolean" != typeof o3 && "function" != typeof o3 ? (f3 = r3 + h3, (o3 = n2.__k[r3] = "string" == typeof o3 || "number" == typeof o3 || "bigint" == typeof o3 || o3.constructor == String ? m(null, o3, null, null, null) : w(o3) ? m(k, { children: o3 }, null, null, null) : null == o3.constructor && o3.__b > 0 ? m(o3.type, o3.props, o3.key, o3.ref ? o3.ref : null, o3.__v) : o3).__ = n2, o3.__b = n2.__b + 1, e3 = null, -1 != (c3 = o3.__i = L(o3, u3, f3, a3)) && (a3--, (e3 = u3[c3]) && (e3.__u |= 2)), null == e3 || null == e3.__v ? (-1 == c3 && (i3 > s3 ? h3-- : i3 < s3 && h3++), "function" != typeof o3.type && (o3.__u |= 4)) : c3 != f3 && (c3 == f3 - 1 ? h3-- : c3 == f3 + 1 ? h3++ : (c3 > f3 ? h3-- : h3++, o3.__u |= 4))) : n2.__k[r3] = null;
    if (a3) for (r3 = 0; r3 < s3; r3++) null != (e3 = u3[r3]) && 0 == (2 & e3.__u) && (e3.__e == t3 && (t3 = S(e3)), D(e3, e3));
    return t3;
  }
  function A(n2, l3, u3, t3) {
    var i3, r3;
    if ("function" == typeof n2.type) {
      for (i3 = n2.__k, r3 = 0; i3 && r3 < i3.length; r3++) i3[r3] && (i3[r3].__ = n2, l3 = A(i3[r3], l3, u3, t3));
      return l3;
    }
    n2.__e != l3 && (t3 && (l3 && n2.type && !l3.parentNode && (l3 = S(n2)), u3.insertBefore(n2.__e, l3 || null)), l3 = n2.__e);
    do {
      l3 = l3 && l3.nextSibling;
    } while (null != l3 && 8 == l3.nodeType);
    return l3;
  }
  function L(n2, l3, u3, t3) {
    var i3, r3, o3, e3 = n2.key, f3 = n2.type, c3 = l3[u3], s3 = null != c3 && 0 == (2 & c3.__u);
    if (null === c3 && null == n2.key || s3 && e3 == c3.key && f3 == c3.type) return u3;
    if (t3 > (s3 ? 1 : 0)) {
      for (i3 = u3 - 1, r3 = u3 + 1; i3 >= 0 || r3 < l3.length; ) if (null != (c3 = l3[o3 = i3 >= 0 ? i3-- : r3++]) && 0 == (2 & c3.__u) && e3 == c3.key && f3 == c3.type) return o3;
    }
    return -1;
  }
  function T(n2, l3, u3) {
    "-" == l3[0] ? n2.setProperty(l3, null == u3 ? "" : u3) : n2[l3] = null == u3 ? "" : "number" != typeof u3 || y.test(l3) ? u3 : u3 + "px";
  }
  function j(n2, l3, u3, t3, i3) {
    var r3, o3;
    n: if ("style" == l3) if ("string" == typeof u3) n2.style.cssText = u3;
    else {
      if ("string" == typeof t3 && (n2.style.cssText = t3 = ""), t3) for (l3 in t3) u3 && l3 in u3 || T(n2.style, l3, "");
      if (u3) for (l3 in u3) t3 && u3[l3] == t3[l3] || T(n2.style, l3, u3[l3]);
    }
    else if ("o" == l3[0] && "n" == l3[1]) r3 = l3 != (l3 = l3.replace(f, "$1")), o3 = l3.toLowerCase(), l3 = o3 in n2 || "onFocusOut" == l3 || "onFocusIn" == l3 ? o3.slice(2) : l3.slice(2), n2.l || (n2.l = {}), n2.l[l3 + r3] = u3, u3 ? t3 ? u3.u = t3.u : (u3.u = c, n2.addEventListener(l3, r3 ? a : s, r3)) : n2.removeEventListener(l3, r3 ? a : s, r3);
    else {
      if ("http://www.w3.org/2000/svg" == i3) l3 = l3.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
      else if ("width" != l3 && "height" != l3 && "href" != l3 && "list" != l3 && "form" != l3 && "tabIndex" != l3 && "download" != l3 && "rowSpan" != l3 && "colSpan" != l3 && "role" != l3 && "popover" != l3 && l3 in n2) try {
        n2[l3] = null == u3 ? "" : u3;
        break n;
      } catch (n3) {
      }
      "function" == typeof u3 || (null == u3 || false === u3 && "-" != l3[4] ? n2.removeAttribute(l3) : n2.setAttribute(l3, "popover" == l3 && 1 == u3 ? "" : u3));
    }
  }
  function F(n2) {
    return function(u3) {
      if (this.l) {
        var t3 = this.l[u3.type + n2];
        if (null == u3.t) u3.t = c++;
        else if (u3.t < t3.u) return;
        return t3(l.event ? l.event(u3) : u3);
      }
    };
  }
  function O(n2, u3, t3, i3, r3, o3, e3, f3, c3, s3) {
    var a3, h3, p3, v3, y3, _2, m3, b, S2, C3, M2, $2, P2, A3, H, L2, T3, j3 = u3.type;
    if (null != u3.constructor) return null;
    128 & t3.__u && (c3 = !!(32 & t3.__u), o3 = [f3 = u3.__e = t3.__e]), (a3 = l.__b) && a3(u3);
    n: if ("function" == typeof j3) try {
      if (b = u3.props, S2 = "prototype" in j3 && j3.prototype.render, C3 = (a3 = j3.contextType) && i3[a3.__c], M2 = a3 ? C3 ? C3.props.value : a3.__ : i3, t3.__c ? m3 = (h3 = u3.__c = t3.__c).__ = h3.__E : (S2 ? u3.__c = h3 = new j3(b, M2) : (u3.__c = h3 = new x(b, M2), h3.constructor = j3, h3.render = E), C3 && C3.sub(h3), h3.props = b, h3.state || (h3.state = {}), h3.context = M2, h3.__n = i3, p3 = h3.__d = true, h3.__h = [], h3._sb = []), S2 && null == h3.__s && (h3.__s = h3.state), S2 && null != j3.getDerivedStateFromProps && (h3.__s == h3.state && (h3.__s = d({}, h3.__s)), d(h3.__s, j3.getDerivedStateFromProps(b, h3.__s))), v3 = h3.props, y3 = h3.state, h3.__v = u3, p3) S2 && null == j3.getDerivedStateFromProps && null != h3.componentWillMount && h3.componentWillMount(), S2 && null != h3.componentDidMount && h3.__h.push(h3.componentDidMount);
      else {
        if (S2 && null == j3.getDerivedStateFromProps && b !== v3 && null != h3.componentWillReceiveProps && h3.componentWillReceiveProps(b, M2), !h3.__e && null != h3.shouldComponentUpdate && false === h3.shouldComponentUpdate(b, h3.__s, M2) || u3.__v == t3.__v) {
          for (u3.__v != t3.__v && (h3.props = b, h3.state = h3.__s, h3.__d = false), u3.__e = t3.__e, u3.__k = t3.__k, u3.__k.some(function(n3) {
            n3 && (n3.__ = u3);
          }), $2 = 0; $2 < h3._sb.length; $2++) h3.__h.push(h3._sb[$2]);
          h3._sb = [], h3.__h.length && e3.push(h3);
          break n;
        }
        null != h3.componentWillUpdate && h3.componentWillUpdate(b, h3.__s, M2), S2 && null != h3.componentDidUpdate && h3.__h.push(function() {
          h3.componentDidUpdate(v3, y3, _2);
        });
      }
      if (h3.context = M2, h3.props = b, h3.__P = n2, h3.__e = false, P2 = l.__r, A3 = 0, S2) {
        for (h3.state = h3.__s, h3.__d = false, P2 && P2(u3), a3 = h3.render(h3.props, h3.state, h3.context), H = 0; H < h3._sb.length; H++) h3.__h.push(h3._sb[H]);
        h3._sb = [];
      } else do {
        h3.__d = false, P2 && P2(u3), a3 = h3.render(h3.props, h3.state, h3.context), h3.state = h3.__s;
      } while (h3.__d && ++A3 < 25);
      h3.state = h3.__s, null != h3.getChildContext && (i3 = d(d({}, i3), h3.getChildContext())), S2 && !p3 && null != h3.getSnapshotBeforeUpdate && (_2 = h3.getSnapshotBeforeUpdate(v3, y3)), L2 = a3, null != a3 && a3.type === k && null == a3.key && (L2 = V(a3.props.children)), f3 = I(n2, w(L2) ? L2 : [L2], u3, t3, i3, r3, o3, e3, f3, c3, s3), h3.base = u3.__e, u3.__u &= -161, h3.__h.length && e3.push(h3), m3 && (h3.__E = h3.__ = null);
    } catch (n3) {
      if (u3.__v = null, c3 || null != o3) if (n3.then) {
        for (u3.__u |= c3 ? 160 : 128; f3 && 8 == f3.nodeType && f3.nextSibling; ) f3 = f3.nextSibling;
        o3[o3.indexOf(f3)] = null, u3.__e = f3;
      } else {
        for (T3 = o3.length; T3--; ) g(o3[T3]);
        z(u3);
      }
      else u3.__e = t3.__e, u3.__k = t3.__k, n3.then || z(u3);
      l.__e(n3, u3, t3);
    }
    else null == o3 && u3.__v == t3.__v ? (u3.__k = t3.__k, u3.__e = t3.__e) : f3 = u3.__e = q(t3.__e, u3, t3, i3, r3, o3, e3, c3, s3);
    return (a3 = l.diffed) && a3(u3), 128 & u3.__u ? void 0 : f3;
  }
  function z(n2) {
    n2 && n2.__c && (n2.__c.__e = true), n2 && n2.__k && n2.__k.forEach(z);
  }
  function N(n2, u3, t3) {
    for (var i3 = 0; i3 < t3.length; i3++) B(t3[i3], t3[++i3], t3[++i3]);
    l.__c && l.__c(u3, n2), n2.some(function(u4) {
      try {
        n2 = u4.__h, u4.__h = [], n2.some(function(n3) {
          n3.call(u4);
        });
      } catch (n3) {
        l.__e(n3, u4.__v);
      }
    });
  }
  function V(n2) {
    return "object" != typeof n2 || null == n2 || n2.__b && n2.__b > 0 ? n2 : w(n2) ? n2.map(V) : d({}, n2);
  }
  function q(u3, t3, i3, r3, o3, e3, f3, c3, s3) {
    var a3, h3, v3, y3, d3, _2, m3, b = i3.props, k3 = t3.props, x2 = t3.type;
    if ("svg" == x2 ? o3 = "http://www.w3.org/2000/svg" : "math" == x2 ? o3 = "http://www.w3.org/1998/Math/MathML" : o3 || (o3 = "http://www.w3.org/1999/xhtml"), null != e3) {
      for (a3 = 0; a3 < e3.length; a3++) if ((d3 = e3[a3]) && "setAttribute" in d3 == !!x2 && (x2 ? d3.localName == x2 : 3 == d3.nodeType)) {
        u3 = d3, e3[a3] = null;
        break;
      }
    }
    if (null == u3) {
      if (null == x2) return document.createTextNode(k3);
      u3 = document.createElementNS(o3, x2, k3.is && k3), c3 && (l.__m && l.__m(t3, e3), c3 = false), e3 = null;
    }
    if (null == x2) b === k3 || c3 && u3.data == k3 || (u3.data = k3);
    else {
      if (e3 = e3 && n.call(u3.childNodes), b = i3.props || p, !c3 && null != e3) for (b = {}, a3 = 0; a3 < u3.attributes.length; a3++) b[(d3 = u3.attributes[a3]).name] = d3.value;
      for (a3 in b) if (d3 = b[a3], "children" == a3) ;
      else if ("dangerouslySetInnerHTML" == a3) v3 = d3;
      else if (!(a3 in k3)) {
        if ("value" == a3 && "defaultValue" in k3 || "checked" == a3 && "defaultChecked" in k3) continue;
        j(u3, a3, null, d3, o3);
      }
      for (a3 in k3) d3 = k3[a3], "children" == a3 ? y3 = d3 : "dangerouslySetInnerHTML" == a3 ? h3 = d3 : "value" == a3 ? _2 = d3 : "checked" == a3 ? m3 = d3 : c3 && "function" != typeof d3 || b[a3] === d3 || j(u3, a3, d3, b[a3], o3);
      if (h3) c3 || v3 && (h3.__html == v3.__html || h3.__html == u3.innerHTML) || (u3.innerHTML = h3.__html), t3.__k = [];
      else if (v3 && (u3.innerHTML = ""), I("template" == t3.type ? u3.content : u3, w(y3) ? y3 : [y3], t3, i3, r3, "foreignObject" == x2 ? "http://www.w3.org/1999/xhtml" : o3, e3, f3, e3 ? e3[0] : i3.__k && S(i3, 0), c3, s3), null != e3) for (a3 = e3.length; a3--; ) g(e3[a3]);
      c3 || (a3 = "value", "progress" == x2 && null == _2 ? u3.removeAttribute("value") : null != _2 && (_2 !== u3[a3] || "progress" == x2 && !_2 || "option" == x2 && _2 != b[a3]) && j(u3, a3, _2, b[a3], o3), a3 = "checked", null != m3 && m3 != u3[a3] && j(u3, a3, m3, b[a3], o3));
    }
    return u3;
  }
  function B(n2, u3, t3) {
    try {
      if ("function" == typeof n2) {
        var i3 = "function" == typeof n2.__u;
        i3 && n2.__u(), i3 && null == u3 || (n2.__u = n2(u3));
      } else n2.current = u3;
    } catch (n3) {
      l.__e(n3, t3);
    }
  }
  function D(n2, u3, t3) {
    var i3, r3;
    if (l.unmount && l.unmount(n2), (i3 = n2.ref) && (i3.current && i3.current != n2.__e || B(i3, null, u3)), null != (i3 = n2.__c)) {
      if (i3.componentWillUnmount) try {
        i3.componentWillUnmount();
      } catch (n3) {
        l.__e(n3, u3);
      }
      i3.base = i3.__P = null;
    }
    if (i3 = n2.__k) for (r3 = 0; r3 < i3.length; r3++) i3[r3] && D(i3[r3], u3, t3 || "function" != typeof n2.type);
    t3 || g(n2.__e), n2.__c = n2.__ = n2.__e = void 0;
  }
  function E(n2, l3, u3) {
    return this.constructor(n2, u3);
  }
  function G(u3, t3, i3) {
    var r3, o3, e3, f3;
    t3 == document && (t3 = document.documentElement), l.__ && l.__(u3, t3), o3 = (r3 = "function" == typeof i3) ? null : i3 && i3.__k || t3.__k, e3 = [], f3 = [], O(t3, u3 = (!r3 && i3 || t3).__k = _(k, null, [u3]), o3 || p, p, t3.namespaceURI, !r3 && i3 ? [i3] : o3 ? null : t3.firstChild ? n.call(t3.childNodes) : null, e3, !r3 && i3 ? i3 : o3 ? o3.__e : t3.firstChild, r3, f3), N(e3, u3, f3);
  }
  var n, l, u, t, i, r, o, e, f, c, s, a, h, p, v, y, w;
  var init_preact_module = __esm({
    "node_modules/preact/dist/preact.module.js"() {
      p = {};
      v = [];
      y = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;
      w = Array.isArray;
      n = v.slice, l = { __e: function(n2, l3, u3, t3) {
        for (var i3, r3, o3; l3 = l3.__; ) if ((i3 = l3.__c) && !i3.__) try {
          if ((r3 = i3.constructor) && null != r3.getDerivedStateFromError && (i3.setState(r3.getDerivedStateFromError(n2)), o3 = i3.__d), null != i3.componentDidCatch && (i3.componentDidCatch(n2, t3 || {}), o3 = i3.__d), o3) return i3.__E = i3;
        } catch (l4) {
          n2 = l4;
        }
        throw n2;
      } }, u = 0, t = function(n2) {
        return null != n2 && null == n2.constructor;
      }, x.prototype.setState = function(n2, l3) {
        var u3;
        u3 = null != this.__s && this.__s != this.state ? this.__s : this.__s = d({}, this.state), "function" == typeof n2 && (n2 = n2(d({}, u3), this.props)), n2 && d(u3, n2), null != n2 && this.__v && (l3 && this._sb.push(l3), M(this));
      }, x.prototype.forceUpdate = function(n2) {
        this.__v && (this.__e = true, n2 && this.__h.push(n2), M(this));
      }, x.prototype.render = k, i = [], o = "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, e = function(n2, l3) {
        return n2.__v.__b - l3.__v.__b;
      }, $.__r = 0, f = /(PointerCapture)$|Capture$/i, c = 0, s = F(false), a = F(true), h = 0;
    }
  });

  // node_modules/preact/hooks/dist/hooks.module.js
  function p2(n2, t3) {
    c2.__h && c2.__h(r2, n2, o2 || t3), o2 = 0;
    var u3 = r2.__H || (r2.__H = { __: [], __h: [] });
    return n2 >= u3.__.length && u3.__.push({}), u3.__[n2];
  }
  function d2(n2) {
    return o2 = 1, h2(D2, n2);
  }
  function h2(n2, u3, i3) {
    var o3 = p2(t2++, 2);
    if (o3.t = n2, !o3.__c && (o3.__ = [i3 ? i3(u3) : D2(void 0, u3), function(n3) {
      var t3 = o3.__N ? o3.__N[0] : o3.__[0], r3 = o3.t(t3, n3);
      t3 !== r3 && (o3.__N = [r3, o3.__[1]], o3.__c.setState({}));
    }], o3.__c = r2, !r2.__f)) {
      var f3 = function(n3, t3, r3) {
        if (!o3.__c.__H) return true;
        var u4 = o3.__c.__H.__.filter(function(n4) {
          return !!n4.__c;
        });
        if (u4.every(function(n4) {
          return !n4.__N;
        })) return !c3 || c3.call(this, n3, t3, r3);
        var i4 = o3.__c.props !== n3;
        return u4.forEach(function(n4) {
          if (n4.__N) {
            var t4 = n4.__[0];
            n4.__ = n4.__N, n4.__N = void 0, t4 !== n4.__[0] && (i4 = true);
          }
        }), c3 && c3.call(this, n3, t3, r3) || i4;
      };
      r2.__f = true;
      var c3 = r2.shouldComponentUpdate, e3 = r2.componentWillUpdate;
      r2.componentWillUpdate = function(n3, t3, r3) {
        if (this.__e) {
          var u4 = c3;
          c3 = void 0, f3(n3, t3, r3), c3 = u4;
        }
        e3 && e3.call(this, n3, t3, r3);
      }, r2.shouldComponentUpdate = f3;
    }
    return o3.__N || o3.__;
  }
  function y2(n2, u3) {
    var i3 = p2(t2++, 3);
    !c2.__s && C2(i3.__H, u3) && (i3.__ = n2, i3.u = u3, r2.__H.__h.push(i3));
  }
  function A2(n2) {
    return o2 = 5, T2(function() {
      return { current: n2 };
    }, []);
  }
  function T2(n2, r3) {
    var u3 = p2(t2++, 7);
    return C2(u3.__H, r3) && (u3.__ = n2(), u3.__H = r3, u3.__h = n2), u3.__;
  }
  function q2(n2, t3) {
    return o2 = 8, T2(function() {
      return n2;
    }, t3);
  }
  function j2() {
    for (var n2; n2 = f2.shift(); ) if (n2.__P && n2.__H) try {
      n2.__H.__h.forEach(z2), n2.__H.__h.forEach(B2), n2.__H.__h = [];
    } catch (t3) {
      n2.__H.__h = [], c2.__e(t3, n2.__v);
    }
  }
  function w2(n2) {
    var t3, r3 = function() {
      clearTimeout(u3), k2 && cancelAnimationFrame(t3), setTimeout(n2);
    }, u3 = setTimeout(r3, 35);
    k2 && (t3 = requestAnimationFrame(r3));
  }
  function z2(n2) {
    var t3 = r2, u3 = n2.__c;
    "function" == typeof u3 && (n2.__c = void 0, u3()), r2 = t3;
  }
  function B2(n2) {
    var t3 = r2;
    n2.__c = n2.__(), r2 = t3;
  }
  function C2(n2, t3) {
    return !n2 || n2.length !== t3.length || t3.some(function(t4, r3) {
      return t4 !== n2[r3];
    });
  }
  function D2(n2, t3) {
    return "function" == typeof t3 ? t3(n2) : t3;
  }
  var t2, r2, u2, i2, o2, f2, c2, e2, a2, v2, l2, m2, s2, k2;
  var init_hooks_module = __esm({
    "node_modules/preact/hooks/dist/hooks.module.js"() {
      init_preact_module();
      o2 = 0;
      f2 = [];
      c2 = l;
      e2 = c2.__b;
      a2 = c2.__r;
      v2 = c2.diffed;
      l2 = c2.__c;
      m2 = c2.unmount;
      s2 = c2.__;
      c2.__b = function(n2) {
        r2 = null, e2 && e2(n2);
      }, c2.__ = function(n2, t3) {
        n2 && t3.__k && t3.__k.__m && (n2.__m = t3.__k.__m), s2 && s2(n2, t3);
      }, c2.__r = function(n2) {
        a2 && a2(n2), t2 = 0;
        var i3 = (r2 = n2.__c).__H;
        i3 && (u2 === r2 ? (i3.__h = [], r2.__h = [], i3.__.forEach(function(n3) {
          n3.__N && (n3.__ = n3.__N), n3.u = n3.__N = void 0;
        })) : (i3.__h.forEach(z2), i3.__h.forEach(B2), i3.__h = [], t2 = 0)), u2 = r2;
      }, c2.diffed = function(n2) {
        v2 && v2(n2);
        var t3 = n2.__c;
        t3 && t3.__H && (t3.__H.__h.length && (1 !== f2.push(t3) && i2 === c2.requestAnimationFrame || ((i2 = c2.requestAnimationFrame) || w2)(j2)), t3.__H.__.forEach(function(n3) {
          n3.u && (n3.__H = n3.u), n3.u = void 0;
        })), u2 = r2 = null;
      }, c2.__c = function(n2, t3) {
        t3.some(function(n3) {
          try {
            n3.__h.forEach(z2), n3.__h = n3.__h.filter(function(n4) {
              return !n4.__ || B2(n4);
            });
          } catch (r3) {
            t3.some(function(n4) {
              n4.__h && (n4.__h = []);
            }), t3 = [], c2.__e(r3, n3.__v);
          }
        }), l2 && l2(n2, t3);
      }, c2.unmount = function(n2) {
        m2 && m2(n2);
        var t3, r3 = n2.__c;
        r3 && r3.__H && (r3.__H.__.forEach(function(n3) {
          try {
            z2(n3);
          } catch (n4) {
            t3 = n4;
          }
        }), r3.__H = void 0, t3 && c2.__e(t3, r3.__v));
      };
      k2 = "function" == typeof requestAnimationFrame;
    }
  });

  // node_modules/@create-figma-plugin/utilities/lib/events.js
  function on(name, handler) {
    const id = `${currentId}`;
    currentId += 1;
    eventHandlers[id] = { handler, name };
    return function() {
      delete eventHandlers[id];
    };
  }
  function invokeEventHandler(name, args) {
    let invoked = false;
    for (const id in eventHandlers) {
      if (eventHandlers[id].name === name) {
        eventHandlers[id].handler.apply(null, args);
        invoked = true;
      }
    }
    if (invoked === false) {
      throw new Error(`No event handler with name \`${name}\``);
    }
  }
  var eventHandlers, currentId, emit;
  var init_events = __esm({
    "node_modules/@create-figma-plugin/utilities/lib/events.js"() {
      eventHandlers = {};
      currentId = 0;
      emit = typeof window === "undefined" ? function(name, ...args) {
        figma.ui.postMessage([name, ...args]);
      } : function(name, ...args) {
        window.parent.postMessage({
          pluginMessage: [name, ...args]
        }, "*");
      };
      if (typeof window === "undefined") {
        figma.ui.onmessage = function(args) {
          if (!Array.isArray(args)) {
            return;
          }
          const [name, ...rest] = args;
          if (typeof name !== "string") {
            return;
          }
          invokeEventHandler(name, rest);
        };
      } else {
        window.onmessage = function(event) {
          if (typeof event.data.pluginMessage === "undefined") {
            return;
          }
          const args = event.data.pluginMessage;
          if (!Array.isArray(args)) {
            return;
          }
          const [name, ...rest] = event.data.pluginMessage;
          if (typeof name !== "string") {
            return;
          }
          invokeEventHandler(name, rest);
        };
      }
    }
  });

  // node_modules/@create-figma-plugin/utilities/lib/index.js
  var init_lib = __esm({
    "node_modules/@create-figma-plugin/utilities/lib/index.js"() {
      init_events();
    }
  });

  // src/components/Combobox.tsx
  function Combobox({ options, value, placeholder, onChange, disabled, className }) {
    const [isOpen, setIsOpen] = d2(false);
    const [searchQuery, setSearchQuery] = d2("");
    const [highlightedIndex, setHighlightedIndex] = d2(-1);
    const inputRef = A2(null);
    const dropdownRef = A2(null);
    const filteredOptions = options.filter(
      (option) => option.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const handleFocus = q2(() => {
      if (!disabled) {
        setIsOpen(true);
        setHighlightedIndex(-1);
      }
    }, [disabled]);
    const handleBlur = q2((e3) => {
      if (dropdownRef.current && dropdownRef.current.contains(e3.relatedTarget)) {
        return;
      }
      setIsOpen(false);
      setSearchQuery("");
    }, []);
    const handleSelect = q2((option) => {
      var _a;
      onChange(option);
      setIsOpen(false);
      setSearchQuery("");
      (_a = inputRef.current) == null ? void 0 : _a.blur();
    }, [onChange]);
    const handleKeyDown = q2((e3) => {
      var _a;
      if (!isOpen) {
        if (e3.key === "Enter" || e3.key === "ArrowDown") {
          e3.preventDefault();
          setIsOpen(true);
        }
        return;
      }
      switch (e3.key) {
        case "ArrowDown":
          e3.preventDefault();
          setHighlightedIndex(
            (prev) => prev < filteredOptions.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e3.preventDefault();
          setHighlightedIndex((prev) => prev > 0 ? prev - 1 : -1);
          break;
        case "Enter":
          e3.preventDefault();
          if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
            handleSelect(filteredOptions[highlightedIndex]);
          }
          break;
        case "Escape":
          e3.preventDefault();
          setIsOpen(false);
          setSearchQuery("");
          (_a = inputRef.current) == null ? void 0 : _a.blur();
          break;
      }
    }, [isOpen, filteredOptions, highlightedIndex, handleSelect]);
    y2(() => {
      if (highlightedIndex >= 0 && dropdownRef.current) {
        const highlightedElement = dropdownRef.current.children[highlightedIndex];
        if (highlightedElement) {
          highlightedElement.scrollIntoView({ block: "nearest" });
        }
      }
    }, [highlightedIndex]);
    const displayValue = isOpen ? searchQuery : value || "";
    return /* @__PURE__ */ _("div", { class: `combobox ${className || ""}` }, /* @__PURE__ */ _("div", { class: "combobox__input-wrapper" }, /* @__PURE__ */ _(
      "input",
      {
        ref: inputRef,
        type: "text",
        class: "combobox__input",
        value: displayValue,
        placeholder: placeholder || "Select...",
        onFocus: handleFocus,
        onBlur: handleBlur,
        onInput: (e3) => setSearchQuery(e3.target.value),
        onKeyDown: handleKeyDown,
        disabled,
        autocomplete: "off"
      }
    )), isOpen && /* @__PURE__ */ _("div", { ref: dropdownRef, class: "combobox__dropdown" }, filteredOptions.length === 0 ? /* @__PURE__ */ _("div", { class: "combobox__empty" }, "No options found") : filteredOptions.map((option, index) => /* @__PURE__ */ _(
      "div",
      {
        key: option,
        class: `combobox__option ${option === value ? "combobox__option--selected" : ""} ${index === highlightedIndex ? "combobox__option--highlighted" : ""}`,
        onMouseDown: (e3) => {
          e3.preventDefault();
          handleSelect(option);
        },
        onMouseEnter: () => setHighlightedIndex(index)
      },
      option
    ))));
  }
  var init_Combobox = __esm({
    "src/components/Combobox.tsx"() {
      "use strict";
      init_preact_module();
      init_hooks_module();
    }
  });

  // src/components/ReplaceModal.tsx
  function ReplaceModal({ fontMetadata, availableFonts, onClose }) {
    const [newFontFamily, setNewFontFamily] = d2("");
    const [newFontStyle, setNewFontStyle] = d2("");
    const [updateLineHeight, setUpdateLineHeight] = d2(false);
    const [newLineHeight, setNewLineHeight] = d2("");
    const [updateFontSize, setUpdateFontSize] = d2(false);
    const [newFontSize, setNewFontSize] = d2("");
    T2(() => {
      emit("REQUEST_AVAILABLE_FONTS");
    }, []);
    const fontFamilies = T2(() => {
      const families = new Set(availableFonts.map((font) => font.fontName.family));
      return Array.from(families).sort();
    }, [availableFonts]);
    const fontStyles = T2(() => {
      if (!newFontFamily) return [];
      return availableFonts.filter((font) => font.fontName.family === newFontFamily).map((font) => font.fontName.style).sort();
    }, [newFontFamily, availableFonts]);
    const handleFamilyChange = q2((value) => {
      setNewFontFamily(value);
      setNewFontStyle("");
    }, []);
    const handleStyleChange = q2((value) => {
      setNewFontStyle(value);
    }, []);
    const handleLineHeightChange = q2((event) => {
      const value = event.currentTarget.value;
      setNewLineHeight(value);
    }, []);
    const handleFontSizeChange = q2((event) => {
      const value = event.currentTarget.value;
      setNewFontSize(value);
    }, []);
    const handleApply = q2(() => {
      if (!newFontFamily || !newFontStyle) {
        return;
      }
      const spec = {
        targetFont: fontMetadata.font,
        newFont: {
          family: newFontFamily,
          style: newFontStyle
        },
        occurrences: fontMetadata.occurrences
      };
      if (updateLineHeight && newLineHeight) {
        spec.newLineHeight = parseFloat(newLineHeight);
      }
      if (updateFontSize && newFontSize) {
        spec.newFontSize = parseFloat(newFontSize);
      }
      emit("APPLY_REPLACEMENT", spec);
      onClose();
    }, [fontMetadata, newFontFamily, newFontStyle, updateLineHeight, newLineHeight, updateFontSize, newFontSize, onClose]);
    return /* @__PURE__ */ _("div", { class: "modal-overlay" }, /* @__PURE__ */ _("div", { class: "modal" }, /* @__PURE__ */ _("div", { class: "modal__header" }, /* @__PURE__ */ _("h3", { class: "modal__title" }, "Replace Font"), /* @__PURE__ */ _("p", { class: "modal__subtitle" }, fontMetadata.font.family, " \u2014 ", fontMetadata.font.style, " \xB7 ", fontMetadata.count, " ranges in ", fontMetadata.nodesCount, " layers")), /* @__PURE__ */ _("div", { class: "modal__body" }, /* @__PURE__ */ _("div", { class: "form-group" }, /* @__PURE__ */ _("label", { class: "form-label" }, "Current Font"), /* @__PURE__ */ _("div", { class: "card-row" }, /* @__PURE__ */ _("div", { class: "card-row__preview" }, "Aa"), /* @__PURE__ */ _("div", { class: "card-row__content" }, /* @__PURE__ */ _("div", { class: "card-row__title" }, fontMetadata.font.family, " \u2014 ", fontMetadata.font.style)))), /* @__PURE__ */ _("div", { class: "form-group" }, /* @__PURE__ */ _("label", { class: "form-label" }, "New Font Family"), /* @__PURE__ */ _(
      Combobox,
      {
        options: fontFamilies,
        value: newFontFamily,
        placeholder: "Search or select font family...",
        onChange: handleFamilyChange
      }
    )), /* @__PURE__ */ _("div", { class: "form-group" }, /* @__PURE__ */ _("label", { class: "form-label" }, "Font Style"), /* @__PURE__ */ _(
      Combobox,
      {
        options: fontStyles,
        value: newFontStyle,
        placeholder: newFontFamily ? "Search or select style..." : "Select a family first",
        onChange: handleStyleChange,
        disabled: !newFontFamily
      }
    )), /* @__PURE__ */ _("div", { class: "form-group" }, /* @__PURE__ */ _("label", { class: "form-checkbox" }, /* @__PURE__ */ _(
      "input",
      {
        type: "checkbox",
        checked: updateLineHeight,
        onChange: (e3) => setUpdateLineHeight(e3.target.checked)
      }
    ), /* @__PURE__ */ _("span", { class: "form-checkbox__label" }, "Update Line Height")), updateLineHeight && /* @__PURE__ */ _(
      "input",
      {
        type: "number",
        class: "form-input",
        placeholder: "Line height (px)",
        value: newLineHeight,
        onInput: handleLineHeightChange
      }
    )), /* @__PURE__ */ _("div", { class: "form-group" }, /* @__PURE__ */ _("label", { class: "form-checkbox" }, /* @__PURE__ */ _(
      "input",
      {
        type: "checkbox",
        checked: updateFontSize,
        onChange: (e3) => setUpdateFontSize(e3.target.checked)
      }
    ), /* @__PURE__ */ _("span", { class: "form-checkbox__label" }, "Update Font Size")), updateFontSize && /* @__PURE__ */ _(
      "input",
      {
        type: "number",
        class: "form-input",
        placeholder: "Font size (px)",
        value: newFontSize,
        onInput: handleFontSizeChange
      }
    ))), /* @__PURE__ */ _("div", { class: "modal__footer" }, /* @__PURE__ */ _("button", { class: "btn btn--ghost", onClick: onClose }, "Cancel"), /* @__PURE__ */ _(
      "button",
      {
        class: "btn btn--primary",
        onClick: handleApply,
        disabled: !newFontFamily || !newFontStyle
      },
      "Apply"
    ))));
  }
  var init_ReplaceModal = __esm({
    "src/components/ReplaceModal.tsx"() {
      "use strict";
      init_preact_module();
      init_hooks_module();
      init_lib();
      init_Combobox();
    }
  });

  // src/components/FontsTab.tsx
  function FontsTab({ scanResult, availableFonts }) {
    const [searchQuery, setSearchQuery] = d2("");
    const [selectedFont, setSelectedFont] = d2(null);
    const handleReplace = q2((font) => {
      setSelectedFont(font);
    }, []);
    const handleCloseModal = q2(() => {
      setSelectedFont(null);
    }, []);
    if (!scanResult || scanResult.fonts.length === 0) {
      return /* @__PURE__ */ _("div", { class: "empty-state" }, /* @__PURE__ */ _("svg", { class: "empty-state__icon", viewBox: "0 0 64 64", fill: "none" }, /* @__PURE__ */ _(
        "path",
        {
          d: "M12 18H52M12 32H52M12 46H38",
          stroke: "currentColor",
          "stroke-width": "3",
          "stroke-linecap": "round",
          opacity: "0.3"
        }
      )), /* @__PURE__ */ _("h3", { class: "empty-state__title" }, "No fonts found"), /* @__PURE__ */ _("p", { class: "empty-state__description" }, "Select text layers and click Scan to discover fonts"));
    }
    const filteredFonts = scanResult.fonts.filter((font) => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return `${font.font.family} ${font.font.style}`.toLowerCase().includes(query);
    });
    return /* @__PURE__ */ _("div", null, /* @__PURE__ */ _("div", { class: "search-box" }, /* @__PURE__ */ _("svg", { class: "search-box__icon", viewBox: "0 0 16 16", fill: "none" }, /* @__PURE__ */ _("circle", { cx: "7", cy: "7", r: "5", stroke: "currentColor", "stroke-width": "1.5" }), /* @__PURE__ */ _("path", { d: "M11 11L14 14", stroke: "currentColor", "stroke-width": "1.5", "stroke-linecap": "round" })), /* @__PURE__ */ _(
      "input",
      {
        type: "text",
        class: "search-box__input",
        placeholder: "Search fonts...",
        value: searchQuery,
        onInput: (e3) => setSearchQuery(e3.target.value)
      }
    )), filteredFonts.length === 0 ? /* @__PURE__ */ _("div", { class: "empty-state" }, /* @__PURE__ */ _("p", null, "No fonts found.")) : /* @__PURE__ */ _("div", { class: "card-list" }, filteredFonts.map((font) => /* @__PURE__ */ _("div", { key: `${font.font.family}-${font.font.style}`, class: "card-row" }, /* @__PURE__ */ _("div", { class: "card-row__preview" }, "Aa"), /* @__PURE__ */ _("div", { class: "card-row__content" }, /* @__PURE__ */ _("div", { class: "card-row__title" }, font.font.family, " \u2014 ", font.font.style), /* @__PURE__ */ _("div", { class: "card-row__meta" }, font.count, " ranges \xB7 ", font.nodesCount, " layers")), /* @__PURE__ */ _("div", { class: "card-row__badge" }, font.count), /* @__PURE__ */ _("div", { class: "card-row__actions" }, /* @__PURE__ */ _(
      "button",
      {
        class: "btn btn--ghost btn--small",
        onClick: (e3) => {
          e3.stopPropagation();
          handleReplace(font);
        }
      },
      "Replace"
    ))))), selectedFont && /* @__PURE__ */ _(
      ReplaceModal,
      {
        fontMetadata: selectedFont,
        availableFonts,
        onClose: handleCloseModal
      }
    ));
  }
  var init_FontsTab = __esm({
    "src/components/FontsTab.tsx"() {
      "use strict";
      init_preact_module();
      init_hooks_module();
      init_ReplaceModal();
    }
  });

  // src/components/GroupsTab.tsx
  function GroupsTab({ scanResult }) {
    const [groupBy, setGroupBy] = d2("lineHeight");
    const [activeUpdateGroup, setActiveUpdateGroup] = d2(null);
    const [updateValue, setUpdateValue] = d2("");
    const [expandedGroups, setExpandedGroups] = d2(/* @__PURE__ */ new Set());
    const handleSelectGroup = q2((group) => {
      emit("PREVIEW_SELECTION", group.occurrences);
    }, []);
    const handleUpdateGroup = q2((groupKey) => {
      if (activeUpdateGroup === groupKey) {
        setActiveUpdateGroup(null);
        setUpdateValue("");
      } else {
        setActiveUpdateGroup(groupKey);
        setUpdateValue("");
      }
    }, [activeUpdateGroup]);
    const handleApplyUpdate = q2((group, type) => {
      if (!updateValue) return;
      const parsedValue = type === "fontWeight" ? updateValue : parseFloat(updateValue);
      emit("BULK_UPDATE", {
        groupType: type,
        targetValue: parsedValue,
        occurrences: group.occurrences
      });
      setActiveUpdateGroup(null);
      setUpdateValue("");
    }, [updateValue]);
    const toggleExpand = q2((groupKey) => {
      setExpandedGroups((prev) => {
        const next = new Set(prev);
        if (next.has(groupKey)) {
          next.delete(groupKey);
        } else {
          next.add(groupKey);
        }
        return next;
      });
    }, []);
    if (!scanResult || scanResult.fonts.length === 0) {
      return /* @__PURE__ */ _("div", { class: "empty-state" }, /* @__PURE__ */ _("svg", { class: "empty-state__icon", viewBox: "0 0 64 64", fill: "none" }, /* @__PURE__ */ _("rect", { x: "16", y: "16", width: "32", height: "32", rx: "4", stroke: "currentColor", "stroke-width": "3", opacity: "0.3" }), /* @__PURE__ */ _("path", { d: "M28 28H36M28 36H40", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", opacity: "0.3" })), /* @__PURE__ */ _("h3", { class: "empty-state__title" }, "No groups available"), /* @__PURE__ */ _("p", { class: "empty-state__description" }, "Scan fonts first to see grouped typography"));
    }
    const groups = scanResult.groups[groupBy] || [];
    return /* @__PURE__ */ _("div", null, /* @__PURE__ */ _("div", { class: "group-controls" }, /* @__PURE__ */ _("label", { class: "group-controls__label" }, "Group by"), /* @__PURE__ */ _(
      "select",
      {
        class: "group-controls__select",
        value: groupBy,
        onChange: (e3) => setGroupBy(e3.target.value)
      },
      /* @__PURE__ */ _("option", { value: "lineHeight" }, "Line Height"),
      /* @__PURE__ */ _("option", { value: "fontSize" }, "Font Size"),
      /* @__PURE__ */ _("option", { value: "fontWeight" }, "Font Weight")
    )), groups.length === 0 ? /* @__PURE__ */ _("div", { class: "empty-state" }, /* @__PURE__ */ _("p", null, "No groups available.")) : /* @__PURE__ */ _("div", null, groups.map((group) => {
      const isExpanded = expandedGroups.has(group.key);
      const isUpdating = activeUpdateGroup === group.key;
      return /* @__PURE__ */ _("div", { key: group.key, class: isExpanded ? "group-item group-item--expanded" : "group-item" }, /* @__PURE__ */ _("div", { class: "group-item__header", onClick: () => toggleExpand(group.key) }, /* @__PURE__ */ _("div", { class: "group-item__title" }, group.label), /* @__PURE__ */ _("div", { class: "group-item__actions" }, /* @__PURE__ */ _("div", { class: "card-row__badge" }, group.count), /* @__PURE__ */ _(
        "button",
        {
          class: "btn btn--ghost btn--small",
          onClick: (e3) => {
            e3.stopPropagation();
            handleSelectGroup(group);
          }
        },
        "Select"
      ), /* @__PURE__ */ _(
        "button",
        {
          class: isUpdating ? "btn btn--primary btn--small" : "btn btn--ghost btn--small",
          onClick: (e3) => {
            e3.stopPropagation();
            handleUpdateGroup(group.key);
          }
        },
        isUpdating ? "Cancel" : "Update"
      ))), isUpdating && /* @__PURE__ */ _("div", { class: "group-item__update" }, /* @__PURE__ */ _("div", { class: "inline-update" }, /* @__PURE__ */ _("label", { class: "inline-update__label" }, groupBy === "fontWeight" && "New weight", groupBy === "fontSize" && "New size (px)", groupBy === "lineHeight" && "New line height (px)"), groupBy === "fontWeight" ? /* @__PURE__ */ _(
        "select",
        {
          class: "inline-update__select",
          value: updateValue,
          onChange: (e3) => setUpdateValue(e3.target.value)
        },
        /* @__PURE__ */ _("option", { value: "" }, "Select weight..."),
        /* @__PURE__ */ _("option", { value: "100" }, "100 - Thin"),
        /* @__PURE__ */ _("option", { value: "200" }, "200 - Extra Light"),
        /* @__PURE__ */ _("option", { value: "300" }, "300 - Light"),
        /* @__PURE__ */ _("option", { value: "400" }, "400 - Regular"),
        /* @__PURE__ */ _("option", { value: "500" }, "500 - Medium"),
        /* @__PURE__ */ _("option", { value: "600" }, "600 - Semi Bold"),
        /* @__PURE__ */ _("option", { value: "700" }, "700 - Bold"),
        /* @__PURE__ */ _("option", { value: "800" }, "800 - Extra Bold"),
        /* @__PURE__ */ _("option", { value: "900" }, "900 - Black")
      ) : /* @__PURE__ */ _(
        "input",
        {
          type: "number",
          class: "inline-update__input",
          placeholder: groupBy === "fontSize" ? "e.g. 16" : "e.g. 24",
          value: updateValue,
          onInput: (e3) => setUpdateValue(e3.target.value)
        }
      ), /* @__PURE__ */ _(
        "button",
        {
          class: "btn btn--primary btn--small",
          onClick: (e3) => {
            e3.stopPropagation();
            handleApplyUpdate(group, groupBy);
          },
          disabled: !updateValue
        },
        "Apply to ",
        group.count,
        " range",
        group.count === 1 ? "" : "s"
      ))), isExpanded && /* @__PURE__ */ _("div", { class: "group-item__content" }, group.occurrences.slice(0, 5).map((occ, index) => /* @__PURE__ */ _("div", { key: `${occ.nodeId}-${index}`, class: "group-occurrence" }, /* @__PURE__ */ _("div", { class: "group-occurrence__title" }, occ.font.family, " ", occ.font.style), /* @__PURE__ */ _("div", { class: "group-occurrence__meta" }, occ.nodeName))), group.count > 5 && /* @__PURE__ */ _("div", { class: "group-occurrence__meta mt-2" }, "+", group.count - 5, " more")));
    })));
  }
  var init_GroupsTab = __esm({
    "src/components/GroupsTab.tsx"() {
      "use strict";
      init_preact_module();
      init_hooks_module();
      init_lib();
    }
  });

  // src/components/TrimTab.tsx
  function TrimTab() {
    const [trimResult, setTrimResult] = d2(null);
    const [isProcessing, setIsProcessing] = d2(false);
    const handleTrimText = q2(() => {
      setIsProcessing(true);
      emit("TRIM_TEXT");
    }, []);
    y2(() => {
      const unsubscribe = on("TRIM_COMPLETE", (result) => {
        setTrimResult(result);
        setIsProcessing(false);
      });
      return () => {
        unsubscribe();
      };
    }, []);
    return /* @__PURE__ */ _("div", null, /* @__PURE__ */ _("div", { style: { padding: "12px", borderBottom: "1px solid var(--color-border)" } }, /* @__PURE__ */ _("h3", { style: { margin: "0 0 4px 0", fontSize: "13px", fontWeight: 600 } }, "Trim"), /* @__PURE__ */ _("p", { style: { margin: "0", fontSize: "10px", color: "var(--color-text-secondary)" } }, "Remove extra whitespace from text")), /* @__PURE__ */ _("div", { style: { padding: "12px" } }, /* @__PURE__ */ _(
      "button",
      {
        class: "btn btn--primary",
        onClick: handleTrimText,
        disabled: isProcessing,
        style: { width: "100%" }
      },
      isProcessing ? "Trimming..." : "Trim"
    )), trimResult && /* @__PURE__ */ _("div", { style: { borderTop: "1px solid var(--color-border)" } }, trimResult.success ? /* @__PURE__ */ _("div", null, /* @__PURE__ */ _("div", { style: { padding: "8px 12px", backgroundColor: "var(--color-bg-success-subtle)" } }, /* @__PURE__ */ _("div", { style: { fontSize: "11px", color: "var(--color-text-success)", fontWeight: 600 } }, "\u2713 Trimmed ", trimResult.trimmedNodes, " layer", trimResult.trimmedNodes !== 1 ? "s" : "")), trimResult.trimmedTexts.length > 0 && /* @__PURE__ */ _("div", { class: "card-list", style: { maxHeight: "320px", overflowY: "auto" } }, trimResult.trimmedTexts.map((text) => /* @__PURE__ */ _("div", { key: text.nodeId, class: "card-row", style: { padding: "8px" } }, /* @__PURE__ */ _("div", { class: "card-row__content" }, /* @__PURE__ */ _("div", { class: "card-row__title", style: { fontSize: "11px", fontWeight: 600 } }, text.nodeName), /* @__PURE__ */ _("div", { style: { fontSize: "10px", color: "var(--color-text-secondary)", marginTop: "2px" } }, text.fontSize, "px \xB7 Top: -", text.topTrim.toFixed(0), "px \xB7 Bottom: -", text.bottomTrim.toFixed(0), "px")))))) : /* @__PURE__ */ _("div", { style: { padding: "12px", backgroundColor: "var(--color-bg-danger-subtle)" } }, /* @__PURE__ */ _("div", { style: { fontSize: "11px", color: "var(--color-text-danger)", fontWeight: 600 } }, "\u2717 Failed"))), !trimResult && !isProcessing && /* @__PURE__ */ _("div", { class: "empty-state" }, /* @__PURE__ */ _("svg", { class: "empty-state__icon", viewBox: "0 0 64 64", fill: "none" }, /* @__PURE__ */ _("rect", { x: "16", y: "20", width: "32", height: "8", stroke: "currentColor", "stroke-width": "2", opacity: "0.3" }), /* @__PURE__ */ _("rect", { x: "16", y: "36", width: "32", height: "8", stroke: "currentColor", "stroke-width": "2", opacity: "0.3" }), /* @__PURE__ */ _("line", { x1: "12", y1: "24", x2: "52", y2: "24", stroke: "currentColor", "stroke-width": "1", "stroke-dasharray": "2,2", opacity: "0.5" }), /* @__PURE__ */ _("line", { x1: "12", y1: "40", x2: "52", y2: "40", stroke: "currentColor", "stroke-width": "1", "stroke-dasharray": "2,2", opacity: "0.5" })), /* @__PURE__ */ _("p", { class: "empty-state__description", style: { fontSize: "11px" } }, "Select text layers and click Trim")));
  }
  var init_TrimTab = __esm({
    "src/components/TrimTab.tsx"() {
      "use strict";
      init_preact_module();
      init_hooks_module();
      init_lib();
    }
  });

  // src/components/LineHeightTab.tsx
  function LineHeightTab() {
    const [scanResult, setScanResult] = d2(null);
    const [isScanning, setIsScanning] = d2(false);
    const [isFixingAll, setIsFixingAll] = d2(false);
    const [fixingNodeId, setFixingNodeId] = d2(null);
    const handleScan = q2(() => {
      setIsScanning(true);
      emit("SCAN_LINE_HEIGHTS");
    }, []);
    const handleFix = q2((nodeId, recommendedLineHeight) => {
      setFixingNodeId(nodeId);
      emit("FIX_LINE_HEIGHT", { nodeId, newLineHeight: recommendedLineHeight });
    }, []);
    const handleFixAll = q2(() => {
      if (!scanResult) return;
      const fixes = scanResult.textLayers.filter((layer) => layer.hasIssue && layer.recommendedLineHeight !== void 0).map((layer) => ({
        nodeId: layer.nodeId,
        newLineHeight: layer.recommendedLineHeight
      }));
      if (fixes.length === 0) return;
      setIsFixingAll(true);
      emit("FIX_ALL_LINE_HEIGHTS", { fixes });
    }, [scanResult]);
    const handleSelectNode = q2((nodeId) => {
      emit("SELECT_NODE", { nodeId });
    }, []);
    y2(() => {
      const unsubscribe = on("LINE_HEIGHT_SCAN_COMPLETE", (result) => {
        setScanResult(result);
        setIsScanning(false);
        setIsFixingAll(false);
        setFixingNodeId(null);
      });
      return () => {
        unsubscribe();
      };
    }, []);
    const issuesOnly = (scanResult == null ? void 0 : scanResult.textLayers.filter((layer) => layer.hasIssue)) || [];
    return /* @__PURE__ */ _("div", null, /* @__PURE__ */ _("div", { style: { padding: "12px", borderBottom: "1px solid var(--color-border)" } }, /* @__PURE__ */ _("h3", { style: { margin: "0 0 4px 0", fontSize: "13px", fontWeight: 600 } }, "Line Height"), /* @__PURE__ */ _("p", { style: { margin: "0", fontSize: "10px", color: "var(--color-text-secondary)" } }, "Detect spacing that's too tight or too loose")), /* @__PURE__ */ _("div", { style: { padding: "12px" } }, /* @__PURE__ */ _(
      "button",
      {
        class: "btn btn--primary",
        onClick: handleScan,
        disabled: isScanning || isFixingAll,
        style: { width: "100%" }
      },
      isScanning ? "Scanning..." : "Scan"
    )), scanResult && /* @__PURE__ */ _("div", { style: { borderTop: "1px solid var(--color-border)" } }, issuesOnly.length > 0 ? /* @__PURE__ */ _("div", null, /* @__PURE__ */ _("div", { style: {
      padding: "8px 12px",
      backgroundColor: "var(--color-bg-warning-subtle)",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    } }, /* @__PURE__ */ _("div", { style: { fontSize: "11px", color: "var(--color-text-warning)", fontWeight: 600 } }, "\u26A0 ", issuesOnly.length, " issue", issuesOnly.length !== 1 ? "s" : "", " found"), /* @__PURE__ */ _(
      "button",
      {
        class: "btn btn--secondary",
        onClick: handleFixAll,
        disabled: isFixingAll,
        style: {
          padding: "2px 8px",
          fontSize: "10px",
          minHeight: "24px",
          height: "24px"
        }
      },
      isFixingAll ? "Fixing..." : "Fix All"
    )), /* @__PURE__ */ _("div", { class: "card-list", style: { maxHeight: "320px", overflowY: "auto" } }, issuesOnly.map((layer) => {
      const isTooTight = layer.issueType === "TOO_TIGHT";
      const issueText = isTooTight ? "Too tight (overlap)" : "Too loose (disconnected)";
      return /* @__PURE__ */ _(
        "div",
        {
          key: layer.nodeId,
          class: "card-row",
          style: {
            backgroundColor: "var(--color-bg-warning-subtle)",
            cursor: "pointer",
            padding: "8px"
          },
          onClick: () => handleSelectNode(layer.nodeId)
        },
        /* @__PURE__ */ _("div", { class: "card-row__content" }, /* @__PURE__ */ _("div", { class: "card-row__title", style: { fontSize: "11px", fontWeight: 600 } }, layer.nodeName), /* @__PURE__ */ _("div", { style: { fontSize: "10px", color: "var(--color-text-secondary)", marginTop: "2px" } }, layer.fontSize.toFixed(2), "px \xB7 LH: ", layer.lineHeight.toFixed(0), "px \xB7 ", layer.lineHeightRatio.toFixed(2), "\xD7 ", issueText), /* @__PURE__ */ _("div", { style: {
          marginTop: "6px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "8px"
        } }, /* @__PURE__ */ _("div", { style: { fontSize: "10px", color: "var(--color-text)" } }, "Fix: ", layer.recommendedLineHeight, "px"), /* @__PURE__ */ _(
          "button",
          {
            class: "btn btn--secondary",
            onClick: (e3) => {
              e3.stopPropagation();
              handleFix(layer.nodeId, layer.recommendedLineHeight);
            },
            disabled: fixingNodeId === layer.nodeId || isFixingAll,
            style: {
              padding: "2px 8px",
              fontSize: "10px",
              minHeight: "auto"
            }
          },
          fixingNodeId === layer.nodeId ? "Fixing..." : "Fix"
        )))
      );
    }))) : /* @__PURE__ */ _("div", { style: { padding: "12px", backgroundColor: "var(--color-bg-success-subtle)" } }, /* @__PURE__ */ _("div", { style: { fontSize: "11px", color: "var(--color-text-success)", fontWeight: 600 } }, "\u2713 All line heights are optimal"))), !scanResult && !isScanning && /* @__PURE__ */ _("div", { class: "empty-state" }, /* @__PURE__ */ _("svg", { class: "empty-state__icon", viewBox: "0 0 64 64", fill: "none" }, /* @__PURE__ */ _("rect", { x: "16", y: "16", width: "32", height: "4", fill: "currentColor", opacity: "0.3" }), /* @__PURE__ */ _("rect", { x: "16", y: "28", width: "32", height: "4", fill: "currentColor", opacity: "0.3" }), /* @__PURE__ */ _("rect", { x: "16", y: "40", width: "32", height: "4", fill: "currentColor", opacity: "0.3" }), /* @__PURE__ */ _("line", { x1: "12", y1: "20", x2: "12", y2: "28", stroke: "currentColor", "stroke-width": "1", opacity: "0.5", "stroke-dasharray": "2,2" }), /* @__PURE__ */ _("line", { x1: "12", y1: "32", x2: "12", y2: "40", stroke: "currentColor", "stroke-width": "1", opacity: "0.5", "stroke-dasharray": "2,2" })), /* @__PURE__ */ _("p", { class: "empty-state__description", style: { fontSize: "11px" } }, "Select text layers and click Scan")));
  }
  var init_LineHeightTab = __esm({
    "src/components/LineHeightTab.tsx"() {
      "use strict";
      init_preact_module();
      init_hooks_module();
      init_lib();
    }
  });

  // ../../../../../../private/var/folders/rv/rx3nzqwx1cj4wksbb12rzlgm0000gn/T/7dbda259-08ea-4f77-b709-1ae341c25f29/styles.js
  var init_styles = __esm({
    "../../../../../../private/var/folders/rv/rx3nzqwx1cj4wksbb12rzlgm0000gn/T/7dbda259-08ea-4f77-b709-1ae341c25f29/styles.js"() {
      if (document.getElementById("6e2c0a1b7d") === null) {
        const element = document.createElement("style");
        element.id = "6e2c0a1b7d";
        element.textContent = `/* Font Toolkit - Professional design following Polaris design principles */

/* ========== Design Tokens ========== */
:root {
  /* Spacing - 4px grid system (Polaris standard) */
  --space-050: 2px;   /* Extra tight spacing */
  --space-100: 4px;   /* Tight spacing */
  --space-200: 8px;   /* Base tight spacing */
  --space-300: 12px;  /* Base spacing */
  --space-400: 16px;  /* Comfortable spacing */
  --space-500: 20px;  /* Loose spacing */
  --space-600: 24px;  /* Extra loose spacing */
  --space-800: 32px;  /* Section spacing */
  --space-1000: 40px; /* Large section spacing */

  /* Border Radius */
  --radius-sm: 4px;   /* Small elements (badges, tags) */
  --radius-md: 6px;   /* Default (buttons, inputs, cards) */
  --radius-lg: 8px;   /* Large elements (modals, panels) */

  /* Colors - Background */
  --color-bg-surface: #2c2c2c;      /* Main surface */
  --color-bg-surface-raised: #353535; /* Elevated surface */
  --color-bg-surface-hover: #3d3d3d; /* Hover state */
  --color-bg-input: #2e2e2e;        /* Input background */
  --color-bg-input-hover: #333333;  /* Input hover */

  /* Colors - Border */
  --color-border-subtle: rgba(255, 255, 255, 0.06);
  --color-border: rgba(255, 255, 255, 0.08);
  --color-border-strong: rgba(255, 255, 255, 0.12);
  --color-border-focus: #2b8af7;

  /* Colors - Text */
  --color-text: #ececec;           /* Primary text */
  --color-text-secondary: #b5b5b5; /* Secondary text */
  --color-text-subdued: #8a8a8a;   /* Muted/disabled text */
  --color-text-inverse: #ffffff;   /* White text */

  /* Colors - Interactive */
  --color-interactive: #2b8af7;    /* Primary action */
  --color-interactive-hover: #1e7ce6;
  --color-interactive-active: #1670d5;
  --color-interactive-disabled: rgba(43, 138, 247, 0.4);

  /* Typography - Font Sizes */
  --font-size-75: 11px;   /* Captions, metadata */
  --font-size-100: 12px;  /* Body small, buttons */
  --font-size-200: 13px;  /* Body text, labels */
  --font-size-300: 14px;  /* Headings small */
  --font-size-400: 16px;  /* Headings medium */
  --font-size-500: 18px;  /* Headings large */

  /* Typography - Font Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Typography - Line Heights */
  --line-height-tight: 1.25;   /* Headings */
  --line-height-base: 1.5;     /* Body text */
  --line-height-relaxed: 1.6;  /* Long-form text */

  /* Component Sizes */
  --height-input: 32px;
  --height-button: 32px;
  --height-button-sm: 28px;
  --height-header: 48px;

  /* Shadows */
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 2px 6px rgba(0, 0, 0, 0.15);
  --shadow-lg: 0 4px 12px rgba(0, 0, 0, 0.2);
  --shadow-xl: 0 8px 24px rgba(0, 0, 0, 0.3);

  /* Transitions */
  --transition-fast: 0.1s ease;
  --transition-base: 0.15s ease;
  --transition-slow: 0.2s ease;
}

/* ========== Reset & Base ========== */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html,
body {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: var(--color-bg-surface);
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: var(--font-size-200);
  line-height: var(--line-height-base);
  font-weight: var(--font-weight-regular);
  color: var(--color-text);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* ========== Container ========== */
.container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  background: var(--color-bg-surface);
}

/* ========== Header ========== */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--height-header);
  padding: 0 var(--space-400);
  border-bottom: 1px solid var(--color-border);
  flex-shrink: 0;
  background: var(--color-bg-surface);
}

.header__title {
  display: flex;
  align-items: center;
  gap: var(--space-200);
  font-size: var(--font-size-200);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
  letter-spacing: -0.01em;
}

.header__icon {
  width: 16px;
  height: 16px;
  color: var(--color-interactive);
  flex-shrink: 0;
}

.header__scan-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-100);
  height: var(--height-button-sm);
  padding: 0 var(--space-300);
  background: var(--color-interactive);
  color: var(--color-text-inverse);
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--font-size-100);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: background var(--transition-base);
  white-space: nowrap;
}

.header__scan-btn:hover:not(:disabled) {
  background: var(--color-interactive-hover);
}

.header__scan-btn:active:not(:disabled) {
  background: var(--color-interactive-active);
}

.header__scan-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.header__scan-icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

.header__scan-icon--spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* ========== Tabs ========== */
.tabs {
  display: flex;
  gap: var(--space-500);
  padding: 0 var(--space-400);
  border-bottom: 1px solid var(--color-border);
  flex-shrink: 0;
  background: var(--color-bg-surface);
}

.tab {
  position: relative;
  padding: var(--space-300) 0;
  border: none;
  background: transparent;
  color: var(--color-text-secondary);
  font-size: var(--font-size-200);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: color var(--transition-slow);
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  letter-spacing: -0.01em;
}

.tab:hover {
  color: var(--color-text);
}

.tab--active {
  color: var(--color-interactive);
  border-bottom-color: var(--color-interactive);
  font-weight: var(--font-weight-semibold);
}

/* ========== Content ========== */
.content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: var(--space-400);
}

/* ========== Home Tab ========== */
.welcome {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: var(--spacing-4) 0;
}

.welcome__icon {
  margin-bottom: var(--spacing-3);
  color: var(--accent-primary);
}

.welcome__title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-2);
}

.welcome__description {
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-4);
  max-width: 280px;
  line-height: 1.5;
}

.welcome__button {
  width: 100%;
  max-width: 280px;
}

.status {
  margin-top: var(--spacing-4);
  font-size: 12px;
  color: var(--text-muted);
}

/* ========== Search Box ========== */
.search-box {
  position: relative;
  margin-bottom: var(--space-400);
}

.search-box__icon {
  position: absolute;
  left: var(--space-300);
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-subdued);
  pointer-events: none;
  width: 14px;
  height: 14px;
}

.search-box__input {
  width: 100%;
  height: var(--height-input);
  padding: 0 var(--space-300) 0 36px;
  background: var(--color-bg-input);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text);
  font-size: var(--font-size-200);
  font-weight: var(--font-weight-regular);
  transition: all var(--transition-base);
}

.search-box__input:hover {
  background: var(--color-bg-input-hover);
  border-color: var(--color-border-strong);
}

.search-box__input:focus {
  outline: none;
  border-color: var(--color-border-focus);
  background: var(--color-bg-surface-raised);
  box-shadow: 0 0 0 1px var(--color-border-focus);
}

.search-box__input::placeholder {
  color: var(--color-text-subdued);
}

/* ========== Card Rows ========== */
.card-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-200);
}

.card-row {
  display: flex;
  align-items: center;
  gap: var(--space-300);
  padding: var(--space-300);
  background: var(--color-bg-surface-raised);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-md);
  transition: all var(--transition-base);
  cursor: pointer;
}

.card-row:hover {
  background: var(--color-bg-surface-hover);
  border-color: var(--color-border);
  box-shadow: var(--shadow-sm);
}

.card-row__preview {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-md);
  font-size: var(--font-size-400);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
  flex-shrink: 0;
}

.card-row__content {
  flex: 1;
  min-width: 0;
}

.card-row__title {
  font-size: var(--font-size-200);
  font-weight: var(--font-weight-medium);
  color: var(--color-text);
  margin-bottom: var(--space-050);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: var(--line-height-tight);
  letter-spacing: -0.01em;
}

.card-row__meta {
  font-size: var(--font-size-75);
  color: var(--color-text-secondary);
  line-height: var(--line-height-tight);
}

.card-row__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 20px;
  padding: 0 var(--space-200);
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-75);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
  flex-shrink: 0;
}

.card-row__actions {
  display: flex;
  gap: var(--space-200);
  flex-shrink: 0;
}

/* ========== Buttons ========== */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-100);
  height: var(--height-button);
  padding: 0 var(--space-400);
  border-radius: var(--radius-md);
  font-size: var(--font-size-200);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-base);
  border: none;
  white-space: nowrap;
  letter-spacing: -0.01em;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn--primary {
  background: var(--color-interactive);
  color: var(--color-text-inverse);
  box-shadow: var(--shadow-sm);
}

.btn--primary:hover:not(:disabled) {
  background: var(--color-interactive-hover);
  box-shadow: var(--shadow-md);
}

.btn--primary:active:not(:disabled) {
  background: var(--color-interactive-active);
  box-shadow: none;
}

.btn--ghost {
  background: transparent;
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.btn--ghost:hover:not(:disabled) {
  background: var(--color-bg-surface-hover);
  border-color: var(--color-border-strong);
}

.btn--ghost:active:not(:disabled) {
  background: var(--color-bg-surface-raised);
}

.btn--small {
  height: var(--height-button-sm);
  padding: 0 var(--space-300);
  font-size: var(--font-size-100);
}

/* ========== Group Controls ========== */
.group-controls {
  margin-bottom: var(--space-400);
}

.group-controls__label {
  display: block;
  font-size: var(--font-size-75);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-200);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.group-controls__select {
  width: 100%;
  height: var(--height-input);
  padding: 0 var(--space-300);
  background: var(--color-bg-input);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text);
  font-size: var(--font-size-200);
  font-weight: var(--font-weight-regular);
  cursor: pointer;
  transition: all var(--transition-base);
}

.group-controls__select:hover {
  background-color: var(--color-bg-input-hover);
  border-color: var(--color-border-strong);
}

.group-controls__select:focus {
  outline: none;
  border-color: var(--color-border-focus);
  background-color: var(--color-bg-surface-raised);
  box-shadow: 0 0 0 1px var(--color-border-focus);
}

/* Custom dropdown arrow for group controls */
.group-controls__select {
  padding-right: var(--space-800); /* Extra space for dropdown arrow */
  background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23b5b5b5' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right var(--space-300) center;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
}

/* ========== Group Item ========== */
.group-item {
  background: var(--color-bg-surface-raised);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-md);
  overflow: hidden;
  margin-bottom: var(--space-200);
}

.group-item__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-300);
  cursor: pointer;
  transition: background var(--transition-base);
}

.group-item__header:hover {
  background: var(--color-bg-surface-hover);
}

.group-item__title {
  font-size: var(--font-size-200);
  font-weight: var(--font-weight-medium);
  color: var(--color-text);
  letter-spacing: -0.01em;
}

.group-item__actions {
  display: flex;
  align-items: center;
  gap: var(--space-200);
}

.group-item__content {
  display: none;
  padding: var(--space-400);
  border-top: 1px solid var(--color-border);
  background: var(--color-bg-surface);
}

.group-item--expanded .group-item__content {
  display: block;
}

.group-occurrence {
  padding: var(--space-200) 0;
  border-bottom: 1px solid var(--color-border-subtle);
}

.group-occurrence:last-child {
  border-bottom: none;
}

.group-occurrence__title {
  font-size: var(--font-size-100);
  font-weight: var(--font-weight-medium);
  color: var(--color-text);
  margin-bottom: var(--space-050);
  line-height: var(--line-height-tight);
}

.group-occurrence__meta {
  font-size: var(--font-size-75);
  color: var(--color-text-secondary);
  line-height: var(--line-height-tight);
}

.group-item__update {
  padding: var(--space-400);
  background: var(--color-bg-surface-hover);
  border-top: 1px solid var(--color-border);
}

/* ========== Inline Update ========== */
.inline-update {
  display: flex;
  align-items: center;
  gap: var(--space-200);
}

.inline-update__label {
  font-size: var(--font-size-100);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
  white-space: nowrap;
}

.inline-update__input,
.inline-update__select {
  flex: 1;
  height: var(--height-button-sm);
  padding: 0 var(--space-300);
  background: var(--color-bg-input);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text);
  font-size: var(--font-size-200);
  font-weight: var(--font-weight-regular);
  min-width: 100px;
  transition: all var(--transition-base);
}

.inline-update__input:hover,
.inline-update__select:hover {
  background-color: var(--color-bg-input-hover);
  border-color: var(--color-border-strong);
}

.inline-update__input:focus,
.inline-update__select:focus {
  outline: none;
  border-color: var(--color-border-focus);
  background-color: var(--color-bg-surface-raised);
  box-shadow: 0 0 0 1px var(--color-border-focus);
}

/* Custom dropdown arrow for inline update select */
.inline-update__select {
  padding-right: var(--space-800); /* Extra space for dropdown arrow */
  background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23b5b5b5' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right var(--space-300) center;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
}

/* Remove number input spinners for inline update inputs */
.inline-update__input[type="number"]::-webkit-inner-spin-button,
.inline-update__input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.inline-update__input[type="number"] {
  -moz-appearance: textfield;
  appearance: textfield;
}

/* ========== Modal ========== */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

.modal {
  width: 90%;
  max-width: 400px;
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  animation: slideUp 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    transform: translateY(16px) scale(0.96);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

.modal__header {
  padding: var(--space-400);
  border-bottom: 1px solid var(--color-border);
}

.modal__title {
  font-size: var(--font-size-300);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
  margin-bottom: var(--space-100);
  line-height: var(--line-height-tight);
  letter-spacing: -0.01em;
}

.modal__subtitle {
  font-size: var(--font-size-100);
  color: var(--color-text-secondary);
  line-height: var(--line-height-base);
}

.modal__body {
  padding: var(--space-400);
  max-height: 60vh;
  overflow-y: auto;
}

.modal__footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-200);
  padding: var(--space-400);
  border-top: 1px solid var(--color-border);
  background: var(--color-bg-surface);
}

/* ========== Form Elements ========== */
.form-group {
  margin-bottom: var(--space-400);
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-label {
  display: block;
  font-size: var(--font-size-75);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-200);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-input,
.form-select {
  width: 100%;
  height: var(--height-input);
  padding: 0 var(--space-300);
  background: var(--color-bg-input);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text);
  font-size: var(--font-size-200);
  font-weight: var(--font-weight-regular);
  transition: all var(--transition-base);
}

.form-input:hover,
.form-select:hover {
  background-color: var(--color-bg-input-hover);
  border-color: var(--color-border-strong);
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: var(--color-border-focus);
  background-color: var(--color-bg-surface-raised);
  box-shadow: 0 0 0 1px var(--color-border-focus);
}

.form-input::placeholder {
  color: var(--color-text-subdued);
}

/* Remove number input spinners */
.form-input[type="number"]::-webkit-inner-spin-button,
.form-input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.form-input[type="number"] {
  -moz-appearance: textfield;
  appearance: textfield;
}

.form-select {
  cursor: pointer;
  padding-right: var(--space-800); /* Extra space for dropdown arrow */
  background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23b5b5b5' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right var(--space-300) center;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
}

.form-preview {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  padding: var(--spacing-3);
  background: var(--bg-card);
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-subtle);
}

.form-preview__icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-panel);
  border-radius: var(--radius-sm);
  font-size: 16px;
  font-weight: 600;
  color: var(--text-secondary);
}

.form-preview__text {
  font-size: 14px;
  color: var(--text-primary);
}

.form-info {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-2);
  padding: var(--spacing-3);
  background: rgba(43, 138, 247, 0.1);
  border-radius: var(--radius-sm);
  border: 1px solid rgba(43, 138, 247, 0.2);
}

.form-info__icon {
  width: 16px;
  height: 16px;
  color: var(--accent-primary);
  flex-shrink: 0;
  margin-top: 2px;
}

.form-info__text {
  font-size: 13px;
  color: var(--text-primary);
  line-height: 1.5;
}

.form-checkbox {
  display: flex;
  align-items: center;
  gap: var(--space-200);
  cursor: pointer;
  user-select: none;
  margin-bottom: var(--space-300);
}

.form-checkbox input[type="checkbox"] {
  width: 16px;
  height: 16px;
  margin: 0;
  cursor: pointer;
  accent-color: var(--color-interactive);
  flex-shrink: 0;
}

.form-checkbox__label {
  font-size: var(--font-size-200);
  color: var(--color-text);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-base);
}

/* ========== Footer ========== */
.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--footer-height);
  padding: 0 var(--spacing-5);
  border-top: 1px solid var(--border-subtle);
  background: var(--bg-panel);
  flex-shrink: 0;
}

.footer__status {
  font-size: 13px;
  color: var(--text-secondary);
}

.footer__actions {
  display: flex;
  gap: var(--spacing-2);
}

/* ========== Toast ========== */
.toast {
  position: fixed;
  bottom: var(--spacing-5);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  padding: var(--spacing-3) var(--spacing-4);
  background: var(--bg-card);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  animation: slideUpToast 0.3s;
  z-index: 2000;
}

@keyframes slideUpToast {
  from {
    transform: translateX(-50%) translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateX(-50%) translateY(0);
    opacity: 1;
  }
}

.toast__message {
  font-size: 14px;
  color: var(--text-primary);
}

.toast__undo {
  font-size: 13px;
  font-weight: 500;
  color: var(--accent-primary);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: color 0.2s;
}

.toast__undo:hover {
  color: var(--accent-hover);
}

/* ========== Progress ========== */
.progress-bar {
  width: 100%;
  height: 4px;
  background: var(--bg-input);
  border-radius: 2px;
  overflow: hidden;
  margin-top: var(--spacing-3);
}

.progress-bar__fill {
  height: 100%;
  background: var(--accent-primary);
  transition: width 0.3s;
  border-radius: 2px;
}

.progress-text {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: var(--spacing-2);
  text-align: center;
}

/* ========== Empty State ========== */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--space-800) var(--space-400);
  min-height: 240px;
}

.empty-state__icon {
  width: 56px;
  height: 56px;
  color: var(--color-text-subdued);
  margin-bottom: var(--space-400);
  opacity: 0.6;
}

.empty-state__title {
  font-size: var(--font-size-300);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-200);
  line-height: var(--line-height-tight);
}

.empty-state__description {
  font-size: var(--font-size-200);
  color: var(--color-text-subdued);
  line-height: var(--line-height-base);
  max-width: 280px;
}

/* ========== Utility Classes ========== */
.mt-1 { margin-top: var(--space-100); }
.mt-2 { margin-top: var(--space-200); }
.mt-3 { margin-top: var(--space-300); }
.mt-4 { margin-top: var(--space-400); }
.mb-1 { margin-bottom: var(--space-100); }
.mb-2 { margin-bottom: var(--space-200); }
.mb-3 { margin-bottom: var(--space-300); }
.mb-4 { margin-bottom: var(--space-400); }

/* ========== Search Dropdown (Combobox) ========== */
.combobox {
  position: relative;
  width: 100%;
}

.combobox__input-wrapper {
  position: relative;
}

.combobox__input {
  width: 100%;
  height: var(--height-input);
  padding: 0 var(--space-300);
  background: var(--color-bg-input);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text);
  font-size: var(--font-size-200);
  font-weight: var(--font-weight-regular);
  transition: all var(--transition-base);
  cursor: pointer;
}

.combobox__input:hover {
  background: var(--color-bg-input-hover);
  border-color: var(--color-border-strong);
}

.combobox__input:focus {
  outline: none;
  border-color: var(--color-border-focus);
  background: var(--color-bg-surface-raised);
  box-shadow: 0 0 0 1px var(--color-border-focus);
}

.combobox__input::placeholder {
  color: var(--color-text-subdued);
}

.combobox__dropdown {
  position: absolute;
  top: calc(100% + var(--space-100));
  left: 0;
  right: 0;
  max-height: 240px;
  background: var(--color-bg-surface-raised);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  overflow-y: auto;
  z-index: 100;
  animation: slideDown 0.15s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.combobox__option {
  padding: var(--space-200) var(--space-300);
  cursor: pointer;
  transition: background var(--transition-fast);
  font-size: var(--font-size-200);
  color: var(--color-text);
  border-bottom: 1px solid var(--color-border-subtle);
}

.combobox__option:last-child {
  border-bottom: none;
}

.combobox__option:hover {
  background: var(--color-bg-surface-hover);
}

.combobox__option--selected {
  background: var(--color-bg-surface-hover);
  font-weight: var(--font-weight-medium);
}

.combobox__option--highlighted {
  background: var(--color-bg-surface-hover);
}

.combobox__empty {
  padding: var(--space-400) var(--space-300);
  text-align: center;
  font-size: var(--font-size-200);
  color: var(--color-text-subdued);
}
`;
        document.head.append(element);
      }
    }
  });

  // src/ui.tsx
  var ui_exports = {};
  __export(ui_exports, {
    default: () => ui_default
  });
  function Plugin() {
    const [activeTab, setActiveTab] = d2("lineheight");
    const [scanResult, setScanResult] = d2(null);
    const [availableFonts, setAvailableFonts] = d2([]);
    const [isScanning, setIsScanning] = d2(false);
    const handleScan = q2(() => {
      setIsScanning(true);
      emit("SCAN_FONTS");
    }, []);
    y2(() => {
      const unsubscribeScanned = on("FONTS_SCANNED", (result) => {
        setScanResult(result);
        setIsScanning(false);
        if (result.fonts.length > 0) {
          setActiveTab("fonts");
        }
      });
      const unsubscribeFonts = on("AVAILABLE_FONTS", (fonts) => {
        setAvailableFonts(fonts);
      });
      const unsubscribeComplete = on("REPLACEMENT_COMPLETE", () => {
        emit("SCAN_FONTS");
      });
      return () => {
        unsubscribeScanned();
        unsubscribeFonts();
        unsubscribeComplete();
      };
    }, []);
    return /* @__PURE__ */ _("div", { class: "container" }, /* @__PURE__ */ _("header", { class: "header" }, /* @__PURE__ */ _("div", { class: "header__title" }, /* @__PURE__ */ _("svg", { class: "header__icon", viewBox: "0 0 20 20", fill: "none" }, /* @__PURE__ */ _("path", { d: "M3 5H17M3 10H17M3 15H12", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round" })), "Font Toolkit"), /* @__PURE__ */ _(
      "button",
      {
        class: isScanning ? "header__scan-btn header__scan-btn--scanning" : "header__scan-btn",
        onClick: handleScan,
        disabled: isScanning
      },
      isScanning ? /* @__PURE__ */ _(k, null, /* @__PURE__ */ _("svg", { class: "header__scan-icon header__scan-icon--spinning", viewBox: "0 0 16 16", fill: "none" }, /* @__PURE__ */ _("circle", { cx: "8", cy: "8", r: "6", stroke: "currentColor", "stroke-width": "2", "stroke-dasharray": "30 8" })), "Scanning...") : /* @__PURE__ */ _(k, null, /* @__PURE__ */ _("svg", { class: "header__scan-icon", viewBox: "0 0 16 16", fill: "none" }, /* @__PURE__ */ _("path", { d: "M8 2L8 14M2 8L14 8", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round" })), "Scan")
    )), /* @__PURE__ */ _("nav", { class: "tabs" }, /* @__PURE__ */ _(
      "button",
      {
        class: activeTab === "lineheight" ? "tab tab--active" : "tab",
        onClick: () => setActiveTab("lineheight"),
        title: "Line Height Overlap Detection"
      },
      "LH"
    ), /* @__PURE__ */ _(
      "button",
      {
        class: activeTab === "fonts" ? "tab tab--active" : "tab",
        onClick: () => setActiveTab("fonts")
      },
      "Fonts"
    ), /* @__PURE__ */ _(
      "button",
      {
        class: activeTab === "groups" ? "tab tab--active" : "tab",
        onClick: () => setActiveTab("groups")
      },
      "Groups"
    ), /* @__PURE__ */ _(
      "button",
      {
        class: activeTab === "trim" ? "tab tab--active" : "tab",
        onClick: () => setActiveTab("trim")
      },
      "Trim"
    )), /* @__PURE__ */ _("main", { class: "content" }, activeTab === "fonts" && /* @__PURE__ */ _(FontsTab, { scanResult, availableFonts }), activeTab === "groups" && /* @__PURE__ */ _(GroupsTab, { scanResult }), activeTab === "lineheight" && /* @__PURE__ */ _(LineHeightTab, null), activeTab === "trim" && /* @__PURE__ */ _(TrimTab, null)));
  }
  function ui_default() {
    const rootElement = document.getElementById("root");
    if (!rootElement) {
      const newRoot = document.createElement("div");
      newRoot.id = "root";
      document.body.appendChild(newRoot);
      G(/* @__PURE__ */ _(Plugin, null), newRoot);
    } else {
      G(/* @__PURE__ */ _(Plugin, null), rootElement);
    }
  }
  var init_ui = __esm({
    "src/ui.tsx"() {
      "use strict";
      init_preact_module();
      init_hooks_module();
      init_lib();
      init_FontsTab();
      init_GroupsTab();
      init_TrimTab();
      init_LineHeightTab();
      init_styles();
    }
  });

  // <stdin>
  var rootNode = document.getElementById("create-figma-plugin");
  var modules = { "src/main.ts--default": (init_ui(), __toCommonJS(ui_exports))["default"] };
  var commandId = __FIGMA_COMMAND__ === "" ? "src/main.ts--default" : __FIGMA_COMMAND__;
  if (typeof modules[commandId] === "undefined") {
    throw new Error(
      "No UI defined for command `" + commandId + "`"
    );
  }
  modules[commandId](rootNode, __SHOW_UI_DATA__);
})();
