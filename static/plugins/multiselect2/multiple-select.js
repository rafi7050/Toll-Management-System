!function (g) {
    "use strict";
    var C = function (e) {
            var u = arguments,
                t = !0,
                s = 1;
            return e = e.replace(/%s/g, function () {
                var e = u[s++];
                return void 0 === e ? (t = !1, "") : e
            }), t ? e : ""
        },
        s = function (e) {
            for (var u = [{
                base: "A",
                letters: /[\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F]/g
            }, {
                base: "AA",
                letters: /[\uA732]/g
            }, {
                base: "AE",
                letters: /[\u00C6\u01FC\u01E2]/g
            }, {
                base: "AO",
                letters: /[\uA734]/g
            }, {
                base: "AU",
                letters: /[\uA736]/g
            }, {
                base: "AV",
                letters: /[\uA738\uA73A]/g
            }, {
                base: "AY",
                letters: /[\uA73C]/g
            }, {
                base: "B",
                letters: /[\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181]/g
            }, {
                base: "C",
                letters: /[\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E]/g
            }, {
                base: "D",
                letters: /[\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779]/g
            }, {
                base: "DZ",
                letters: /[\u01F1\u01C4]/g
            }, {
                base: "Dz",
                letters: /[\u01F2\u01C5]/g
            }, {
                base: "E",
                letters: /[\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E]/g
            }, {
                base: "F",
                letters: /[\u0046\u24BB\uFF26\u1E1E\u0191\uA77B]/g
            }, {
                base: "G",
                letters: /[\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E]/g
            }, {
                base: "H",
                letters: /[\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D]/g
            }, {
                base: "I",
                letters: /[\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197]/g
            }, {
                base: "J",
                letters: /[\u004A\u24BF\uFF2A\u0134\u0248]/g
            }, {
                base: "K",
                letters: /[\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2]/g
            }, {
                base: "L",
                letters: /[\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780]/g
            }, {
                base: "LJ",
                letters: /[\u01C7]/g
            }, {
                base: "Lj",
                letters: /[\u01C8]/g
            }, {
                base: "M",
                letters: /[\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C]/g
            }, {
                base: "N",
                letters: /[\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4]/g
            }, {
                base: "NJ",
                letters: /[\u01CA]/g
            }, {
                base: "Nj",
                letters: /[\u01CB]/g
            }, {
                base: "O",
                letters: /[\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C]/g
            }, {
                base: "OI",
                letters: /[\u01A2]/g
            }, {
                base: "OO",
                letters: /[\uA74E]/g
            }, {
                base: "OU",
                letters: /[\u0222]/g
            }, {
                base: "P",
                letters: /[\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754]/g
            }, {
                base: "Q",
                letters: /[\u0051\u24C6\uFF31\uA756\uA758\u024A]/g
            }, {
                base: "R",
                letters: /[\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782]/g
            }, {
                base: "S",
                letters: /[\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784]/g
            }, {
                base: "T",
                letters: /[\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786]/g
            }, {
                base: "TZ",
                letters: /[\uA728]/g
            }, {
                base: "U",
                letters: /[\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244]/g
            }, {
                base: "V",
                letters: /[\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245]/g
            }, {
                base: "VY",
                letters: /[\uA760]/g
            }, {
                base: "W",
                letters: /[\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72]/g
            }, {
                base: "X",
                letters: /[\u0058\u24CD\uFF38\u1E8A\u1E8C]/g
            }, {
                base: "Y",
                letters: /[\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE]/g
            }, {
                base: "Z",
                letters: /[\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762]/g
            }, {
                base: "a",
                letters: /[\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250]/g
            }, {
                base: "aa",
                letters: /[\uA733]/g
            }, {
                base: "ae",
                letters: /[\u00E6\u01FD\u01E3]/g
            }, {
                base: "ao",
                letters: /[\uA735]/g
            }, {
                base: "au",
                letters: /[\uA737]/g
            }, {
                base: "av",
                letters: /[\uA739\uA73B]/g
            }, {
                base: "ay",
                letters: /[\uA73D]/g
            }, {
                base: "b",
                letters: /[\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253]/g
            }, {
                base: "c",
                letters: /[\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184]/g
            }, {
                base: "d",
                letters: /[\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A]/g
            }, {
                base: "dz",
                letters: /[\u01F3\u01C6]/g
            }, {
                base: "e",
                letters: /[\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD]/g
            }, {
                base: "f",
                letters: /[\u0066\u24D5\uFF46\u1E1F\u0192\uA77C]/g
            }, {
                base: "g",
                letters: /[\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F]/g
            }, {
                base: "h",
                letters: /[\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265]/g
            }, {
                base: "hv",
                letters: /[\u0195]/g
            }, {
                base: "i",
                letters: /[\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131]/g
            }, {
                base: "j",
                letters: /[\u006A\u24D9\uFF4A\u0135\u01F0\u0249]/g
            }, {
                base: "k",
                letters: /[\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3]/g
            }, {
                base: "l",
                letters: /[\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747]/g
            }, {
                base: "lj",
                letters: /[\u01C9]/g
            }, {
                base: "m",
                letters: /[\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F]/g
            }, {
                base: "n",
                letters: /[\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5]/g
            }, {
                base: "nj",
                letters: /[\u01CC]/g
            }, {
                base: "o",
                letters: /[\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275]/g
            }, {
                base: "oi",
                letters: /[\u01A3]/g
            }, {
                base: "ou",
                letters: /[\u0223]/g
            }, {
                base: "oo",
                letters: /[\uA74F]/g
            }, {
                base: "p",
                letters: /[\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755]/g
            }, {
                base: "q",
                letters: /[\u0071\u24E0\uFF51\u024B\uA757\uA759]/g
            }, {
                base: "r",
                letters: /[\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783]/g
            }, {
                base: "s",
                letters: /[\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B]/g
            }, {
                base: "t",
                letters: /[\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787]/g
            }, {
                base: "tz",
                letters: /[\uA729]/g
            }, {
                base: "u",
                letters: /[\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289]/g
            }, {
                base: "v",
                letters: /[\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C]/g
            }, {
                base: "vy",
                letters: /[\uA761]/g
            }, {
                base: "w",
                letters: /[\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73]/g
            }, {
                base: "x",
                letters: /[\u0078\u24E7\uFF58\u1E8B\u1E8D]/g
            }, {
                base: "y",
                letters: /[\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF]/g
            }, {
                base: "z",
                letters: /[\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763]/g
            }], t = 0; t < u.length; t++) e = e.replace(u[t].letters, u[t].base);
            return e
        };

    function n(u, e) {
        var t = this,
            s = u.attr("name") || e.name || "";
        this.options = e, this.$el = u.hide(), this.$label = this.$el.closest("label"), 0 === this.$label.length && this.$el.attr("id") && (this.$label = g(C('label[for="%s"]', this.$el.attr("id").replace(/:/g, "\\:")))), this.$parent = g(C('<div class="ms-parent %s" %s/>', u.attr("class") || "", C('title="%s"', u.attr("title")))), this.$choice = g(C(['<button type="button" class="ms-choice">', '<span class="placeholder">%s</span>', "<div></div>", "</button>"].join(""), this.options.placeholder)), this.$drop = g(C('<div class="ms-drop %s"%s></div>', this.options.position, C(' style="width: %s"', this.options.dropWidth))), this.$el.after(this.$parent), this.$parent.append(this.$choice), this.$parent.append(this.$drop), this.$el.prop("disabled") && this.$choice.addClass("disabled"), this.$parent.css("width", this.options.width || this.$el.css("width") || this.$el.outerWidth() + 20), this.selectAllName = 'data-name="selectAll' + s + '"', this.selectGroupName = 'data-name="selectGroup' + s + '"', this.selectItemName = 'data-name="selectItem' + s + '"', this.options.keepOpen || g(document).click(function (e) {
            g(e.target)[0] !== t.$choice[0] && g(e.target).parents(".ms-choice")[0] !== t.$choice[0] && (g(e.target)[0] === t.$drop[0] || g(e.target).parents(".ms-drop")[0] !== t.$drop[0] && e.target !== u[0]) && t.options.isOpen && t.close()
        })
    }

    n.prototype = {
        constructor: n,
        init: function () {
            var t = this,
                s = g("<ul></ul>");
            this.$drop.html(""), this.options.filter && this.$drop.append(['<div class="ms-search">', '<input type="text" autocomplete="off" autocorrect="off" autocapitilize="off" spellcheck="false">', "</div>"].join("")), this.options.selectAll && !this.options.single && s.append(['<li class="ms-select-all">', "<label>", C('<input type="checkbox" %s /> ', this.selectAllName), this.options.formatSelectAll(), "</label>", "</li>"].join("")), g.each(this.$el.children(), function (e, u) {
                s.append(t.optionToHtml(e, u))
            }), s.append(C('<li class="ms-no-results">%s</li>', this.options.formatNoMatchesFound())), this.$drop.append(s), this.$drop.find("ul").css("max-height", this.options.maxHeight + "px"), this.$drop.find(".multiple").css("width", this.options.multipleWidth + "px"), this.$searchInput = this.$drop.find(".ms-search input"), this.$selectAll = this.$drop.find("input[" + this.selectAllName + "]"), this.$selectGroups = this.$drop.find("input[" + this.selectGroupName + "]"), this.$selectItems = this.$drop.find("input[" + this.selectItemName + "]:enabled"), this.$disableItems = this.$drop.find("input[" + this.selectItemName + "]:disabled"), this.$noResults = this.$drop.find(".ms-no-results"), this.events(), this.updateSelectAll(!0), this.update(!0), this.options.isOpen && this.open(), this.options.openOnHover && g(".ms-parent").hover(function (e) {
                t.open()
            })
        },
        optionToHtml: function (e, u, t, s) {
            var i, l = this,
                o = g(u),
                n = o.attr("class") || "",
                a = C('title="%s"', o.attr("title")),
                r = this.options.multiple ? "multiple" : "",
                c = this.options.single ? "radio" : "checkbox";
            if (o.is("option")) {
                var h, p = o.val(),
                    E = l.options.textTemplate(o),
                    d = o.prop("selected"),
                    A = C('style="%s"', this.options.styler(p));
                return i = s || o.prop("disabled"), (h = g([C('<li class="%s %s" %s %s>', r, n, a, A), C('<label class="%s">', i ? "disabled" : ""), C('<input type="%s" %s%s%s%s>', c, this.selectItemName, d ? ' checked="checked"' : "", i ? ' disabled="disabled"' : "", C(' data-group="%s"', t)), C("<span>%s</span>", E), "</label>", "</li>"].join(""))).find("input").val(p), h
            }
            if (o.is("optgroup")) {
                var f = l.options.labelTemplate(o),
                    F = g("<div/>");
                return t = "group_" + e, i = o.prop("disabled"), F.append(['<li class="group">', C('<label class="optgroup %s" data-group="%s">', i ? "disabled" : "", t), this.options.hideOptgroupCheckboxes || this.options.single ? "" : C('<input type="checkbox" %s %s>', this.selectGroupName, i ? 'disabled="disabled"' : ""), f, "</label>", "</li>"].join("")), g.each(o.children(), function (e, u) {
                    F.append(l.optionToHtml(e, u, t, i))
                }), F.html()
            }
        },
        events: function () {
            var s = this,
                u = function (e) {
                    e.preventDefault(), s[s.options.isOpen ? "close" : "open"]()
                };
            this.$label && this.$label.off("click").on("click", function (e) {
                "label" === e.target.nodeName.toLowerCase() && e.target === this && (u(e), s.options.filter && s.options.isOpen || s.focus(), e.stopPropagation())
            }), this.$choice.off("click").on("click", u).off("focus").on("focus", this.options.onFocus).off("blur").on("blur", this.options.onBlur), this.$parent.off("keydown").on("keydown", function (e) {
                switch (e.which) {
                    case 27:
                        s.close(), s.$choice.focus()
                }
            }), this.$searchInput.off("keydown").on("keydown", function (e) {
                9 === e.keyCode && e.shiftKey && s.close()
            }).off("keyup").on("keyup", function (e) {
                if (s.options.filterAcceptOnEnter && (13 === e.which || 32 == e.which) && s.$searchInput.val()) return s.$selectAll.click(), s.close(), void s.focus();
                s.filter()
            }), this.$selectAll.off("click").on("click", function () {
                var e = g(this).prop("checked"),
                    u = s.$selectItems.filter(":visible");
                u.length === s.$selectItems.length ? s[e ? "checkAll" : "uncheckAll"]() : (s.$selectGroups.prop("checked", e), u.prop("checked", e), s.options[e ? "onCheckAll" : "onUncheckAll"](), s.update())
            }), this.$selectGroups.off("click").on("click", function () {
                var e = g(this).parent().attr("data-group"),
                    u = s.$selectItems.filter(":visible").filter(C('[data-group="%s"]', e)),
                    t = u.length !== u.filter(":checked").length;
                u.prop("checked", t), s.updateSelectAll(), s.update(), s.options.onOptgroupClick({
                    label: g(this).parent().text(),
                    checked: t,
                    children: u.get(),
                    instance: s
                })
            }), this.$selectItems.off("click").on("click", function () {
                if (s.updateSelectAll(), s.update(), s.updateOptGroupSelect(), s.options.onClick({
                    label: g(this).parent().text(),
                    value: g(this).val(),
                    checked: g(this).prop("checked"),
                    instance: s
                }), s.options.single && s.options.isOpen && !s.options.keepOpen && s.close(), s.options.single) {
                    var e = g(this).val();
                    s.$selectItems.filter(function () {
                        return g(this).val() !== e
                    }).each(function () {
                        g(this).prop("checked", !1)
                    }), s.update()
                }
            })
        },
        open: function () {
            if (!this.$choice.hasClass("disabled")) {
                if (this.options.isOpen = !0, this.$choice.find(">div").addClass("open"), this.$drop[this.animateMethod("show")](), this.$selectAll.parent().show(), this.$noResults.hide(), this.$el.children().length || (this.$selectAll.parent().hide(), this.$noResults.show()), this.options.container) {
                    var e = this.$drop.offset();
                    this.$drop.appendTo(g(this.options.container)), this.$drop.offset({
                        top: e.top,
                        left: e.left
                    })
                }
                this.options.filter && (this.$searchInput.val(""), this.$searchInput.focus(), this.filter()), this.options.onOpen()
            }
        },
        close: function () {
            this.options.isOpen = !1, this.$choice.find(">div").removeClass("open"), this.$drop[this.animateMethod("hide")](), this.options.container && (this.$parent.append(this.$drop), this.$drop.css({
                top: "auto",
                left: "auto"
            })), this.options.onClose()
        },
        animateMethod: function (e) {
            return {
                show: {
                    fade: "fadeIn",
                    slide: "slideDown"
                },
                hide: {
                    fade: "fadeOut",
                    slide: "slideUp"
                }
            } [e][this.options.animate] || e
        },
        update: function (e) {
            var u = this.options.displayValues ? this.getSelects() : this.getSelects("text"),
                t = this.$choice.find(">span"),
                s = u.length;
            0 === s ? t.addClass("placeholder").html(this.options.placeholder) : this.options.formatAllSelected() && s === this.$selectItems.length + this.$disableItems.length ? t.removeClass("placeholder").html(this.options.formatAllSelected) : this.options.ellipsis && s > this.options.minimumCountSelected ? t.removeClass("placeholder").text(u.slice(0, this.options.minimumCountSelected).join(this.options.delimiter) + "...") : this.options.formatCountSelected() && s > this.options.minimumCountSelected ? t.removeClass("placeholder").html(this.options.formatCountSelected().replace("#", u.length).replace("%", this.$selectItems.length + this.$disableItems.length)) : t.removeClass("placeholder").html(this.options.formatSelectedOptions(u)), this.options.addTitle && t.prop("title", this.getSelects("text")), this.$el.val(this.getSelects()).trigger("change"), this.$drop.find("li").removeClass("selected"), this.$drop.find("input:checked").each(function () {
                g(this).parents("li").first().addClass("selected")
            }), e || this.$el.trigger("change")
        },
        updateSelectAll: function (e) {
            var u = this.$selectItems;
            e || (u = u.filter(":visible")), this.$selectAll.prop("checked", u.length && u.length === u.filter(":checked").length), !e && this.$selectAll.prop("checked") && this.options.onCheckAll()
        },
        updateOptGroupSelect: function () {
            var i = this.$selectItems.filter(":visible");
            g.each(this.$selectGroups, function (e, u) {
                var t = g(u).parent().attr("data-group"),
                    s = i.filter(C('[data-group="%s"]', t));
                g(u).prop("checked", s.length && s.length === s.filter(":checked").length)
            })
        },
        getSelects: function (e) {
            var o = this,
                n = [],
                u = [];
            return this.$drop.find(C("input[%s]:checked", this.selectItemName)).each(function () {
                n.push(g(this).parents("li").first().text()), u.push(g(this).val())
            }), "text" === e && this.$selectGroups.length && (n = [], this.$selectGroups.each(function () {
                var e = [],
                    u = g.trim(g(this).parent().text()),
                    t = g(this).parent().data("group"),
                    s = o.$drop.find(C('[%s][data-group="%s"]', o.selectItemName, t)),
                    i = s.filter(":checked");
                if (i.length) {
                    if (e.push("["), e.push(u), s.length > i.length) {
                        var l = [];
                        i.each(function () {
                            l.push(g(this).parent().text())
                        }), e.push(": " + l.join(", "))
                    }
                    e.push("]"), n.push(e.join(""))
                }
            })), "text" === e ? n : u
        },
        setSelects: function (e) {
            var i = this;
            this.$selectItems.prop("checked", !1), this.$disableItems.prop("checked", !1), g.each(e, function (e, u) {
                i.$selectItems.filter(C('[value="%s"]', u)).prop("checked", !0), i.$disableItems.filter(C('[value="%s"]', u)).prop("checked", !0)
            }), this.$selectAll.prop("checked", this.$selectItems.length === this.$selectItems.filter(":checked").length + this.$disableItems.filter(":checked").length), g.each(i.$selectGroups, function (e, u) {
                var t = g(u).parent().attr("data-group"),
                    s = i.$selectItems.filter('[data-group="' + t + '"]');
                g(u).prop("checked", s.length && s.length === s.filter(":checked").length)
            }), this.update()
        },
        enable: function () {
            this.$choice.removeClass("disabled")
        },
        disable: function () {
            this.$choice.addClass("disabled")
        },
        checkAll: function () {
            this.$selectItems.prop("checked", !0), this.$selectGroups.prop("checked", !0), this.$selectAll.prop("checked", !0), this.update(), this.options.onCheckAll()
        },
        uncheckAll: function () {
            this.$selectItems.prop("checked", !1), this.$selectGroups.prop("checked", !1), this.$selectAll.prop("checked", !1), this.update(), this.options.onUncheckAll()
        },
        focus: function () {
            this.$choice.focus(), this.options.onFocus()
        },
        blur: function () {
            this.$choice.blur(), this.options.onBlur()
        },
        refresh: function () {
            this.init()
        },
        destroy: function () {
            this.$el.show(), this.$parent.remove(), this.$el.data("multipleSelect", null)
        },
        filter: function () {
            var t = this,
                u = g.trim(this.$searchInput.val()).toLowerCase();
            0 === u.length ? (this.$selectAll.parent().show(), this.$selectItems.parent().show(), this.$disableItems.parent().show(), this.$selectGroups.parent().show(), this.$noResults.hide()) : (this.$selectItems.each(function () {
                var e = g(this).parent();
                e[s(e.text().toLowerCase()).indexOf(s(u)) < 0 ? "hide" : "show"]()
            }), this.$disableItems.parent().hide(), this.$selectGroups.each(function () {
                var e = g(this).parent(),
                    u = e.attr("data-group");
                e[t.$selectItems.filter(":visible").filter(C('[data-group="%s"]', u)).length ? "show" : "hide"]()
            }), this.$selectItems.parent().filter(":visible").length ? (this.$selectAll.parent().show(), this.$noResults.hide()) : (this.$selectAll.parent().hide(), this.$noResults.show())), this.updateOptGroupSelect(), this.updateSelectAll(), this.options.onFilter(u)
        },
        destroy: function () {
            this.$el.before(this.$parent), this.$parent.remove(), delete g.fn.multipleSelect
        }
    }, g.fn.multipleSelect = function () {
        var s, i = arguments[0],
            l = arguments,
            o = ["getSelects", "setSelects", "enable", "disable", "open", "close", "checkAll", "uncheckAll", "focus", "blur", "refresh", "destroy"];
        return this.each(function () {
            var e = g(this),
                u = e.data("multipleSelect"),
                t = g.extend({}, g.fn.multipleSelect.defaults, e.data(), "object" == typeof i && i);
            if (u || (u = new n(e, t), e.data("multipleSelect", u)), "string" == typeof i) {
                if (g.inArray(i, o) < 0) throw "Unknown method: " + i;
                s = u[i](l[1]), "destroy" === i && e.removeData("multipleSelect")
            } else u.init(), l[1] && (s = u[l[1]].apply(u, [].slice.call(l, 2)))
        }), void 0 !== s ? s : this
    }, g.fn.multipleSelect.defaults = {
        name: "",
        placeholder: "",
        selectAll: !0,
        allSelected: !0,
        displayType: "countSelected",
        displayValues: !1,
        displayTitle: !1,
        displayDelimiter: ", ",
        minimumCountSelected: 3,
        ellipsis: !1,
        single: !1,
        multiple: !1,
        multipleWidth: 80,
        hideOptgroupCheckboxes: !1,
        width: void 0,
        dropWidth: void 0,
        maxHeight: 250,
        position: "bottom",
        isOpen: !1,
        keepOpen: !1,
        openOnHover: !1,
        filter: !1,
        filterPlaceholder: "",
        filterAcceptOnEnter: !1,
        container: null,
        animate: "none",
        formatSelectAll: function () {
            return "[Select all]"
        },
        formatAllSelected: function () {
            return "All selected"
        },
        formatCountSelected: function () {
            return "# of % selected"
        },
        formatNoMatchesFound: function () {
            return "No matches found"
        },
        formatSelectedOptions: function (options = []) {
            if (options.length) {
                return makeUL(options)
            }
        },
        styler: function () {
            return !1
        },
        textTemplate: function (e) {
            return e.html()
        },
        labelTemplate: function (e) {
            return e.attr("label")
        },
        onOpen: function () {
            return !1
        },
        onClose: function () {
            return !1
        },
        onCheckAll: function () {
            return !1
        },
        onUncheckAll: function () {
            return !1
        },
        onFocus: function () {
            return !1
        },
        onBlur: function () {
            return !1
        },
        onOptgroupClick: function () {
            return !1
        },
        onClick: function () {
            return !1
        },
        onFilter: function () {
            return !1
        }
    }
}(jQuery);

function makeUL(array) {
    // Create the list element:
    var list = $('<ul></ul>').addClass('select2-selection__rendered');
    array.forEach(function (item) {
        var list_item = $('<li class="select2-selection__choice"></li>').text(item).attr('title',item);
        // Add it to the list:
        list.append(list_item);
    })

    // Finally, return the constructed list:
    return list;
}