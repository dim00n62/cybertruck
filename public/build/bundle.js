
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_custom_element_data(node, prop, value) {
        if (prop in node) {
            node[prop] = value;
        }
        else {
            attr(node, prop, value);
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if ($$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.23.2' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src\App.svelte generated by Svelte v3.23.2 */

    const file = "src\\App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	child_ctx[8] = i;
    	return child_ctx;
    }

    // (58:6) {#each roads as _, i}
    function create_each_block(ctx) {
    	let a_plane;
    	let a_plane_position_value;

    	const block = {
    		c: function create() {
    			a_plane = element("a-plane");
    			set_custom_element_data(a_plane, "rotation", "-90 0 0");
    			set_custom_element_data(a_plane, "width", "4");
    			set_custom_element_data(a_plane, "height", "4");
    			set_custom_element_data(a_plane, "material", "src: url(./road.jpg)");
    			set_custom_element_data(a_plane, "position", a_plane_position_value = "" + ((/*i*/ ctx[8] - roadLenght / 2) * 4 + " 0 0"));
    			add_location(a_plane, file, 58, 8, 2692);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a_plane, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a_plane);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(58:6) {#each roads as _, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let a;
    	let t1;
    	let a_scene;
    	let a_entity10;
    	let a_image0;
    	let a_image0_src_value;
    	let t2;
    	let a_image1;
    	let a_image1_src_value;
    	let t3;
    	let a_text0;
    	let t4;
    	let a_text1;
    	let t5;
    	let a_entity1;
    	let a_entity0;
    	let t6;
    	let a_entity3;
    	let a_entity2;
    	let t7;
    	let a_entity5;
    	let a_entity4;
    	let t8;
    	let a_entity7;
    	let a_entity6;
    	let t9;
    	let a_entity8;
    	let t10;
    	let a_entity9;
    	let t11;
    	let a_entity11;
    	let a_entity11_position_value;
    	let t12;
    	let a_sky;
    	let a_sky_src_value;
    	let t13;
    	let a_entity12;
    	let t14;
    	let a_camera;
    	let each_value = /*roads*/ ctx[3];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			main = element("main");
    			a = element("a");
    			a.textContent = "Protect yourself with #CyberFit 👨‍💻";
    			t1 = space();
    			a_scene = element("a-scene");
    			a_entity10 = element("a-entity");
    			a_image0 = element("a-image");
    			t2 = space();
    			a_image1 = element("a-image");
    			t3 = space();
    			a_text0 = element("a-text");
    			t4 = space();
    			a_text1 = element("a-text");
    			t5 = space();
    			a_entity1 = element("a-entity");
    			a_entity0 = element("a-entity");
    			t6 = space();
    			a_entity3 = element("a-entity");
    			a_entity2 = element("a-entity");
    			t7 = space();
    			a_entity5 = element("a-entity");
    			a_entity4 = element("a-entity");
    			t8 = space();
    			a_entity7 = element("a-entity");
    			a_entity6 = element("a-entity");
    			t9 = space();
    			a_entity8 = element("a-entity");
    			t10 = space();
    			a_entity9 = element("a-entity");
    			t11 = space();
    			a_entity11 = element("a-entity");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t12 = space();
    			a_sky = element("a-sky");
    			t13 = space();
    			a_entity12 = element("a-entity");
    			t14 = space();
    			a_camera = element("a-camera");
    			attr_dev(a, "href", "https://www.acronis.com/en-us/lp/cyberfit/");
    			attr_dev(a, "class", "link svelte-rqzs13");
    			add_location(a, file, 27, 2, 671);
    			set_custom_element_data(a_image0, "position", "1.32 .7 .8");
    			if (a_image0.src !== (a_image0_src_value = "logo.gif")) set_custom_element_data(a_image0, "src", a_image0_src_value);
    			set_custom_element_data(a_image0, "width", "1.2");
    			set_custom_element_data(a_image0, "height", ".3");
    			set_custom_element_data(a_image0, "rotation", "0 -90 0");
    			add_location(a_image0, file, 31, 6, 891);
    			set_custom_element_data(a_image1, "position", "2.37 .7 .8");
    			if (a_image1.src !== (a_image1_src_value = "logo.gif")) set_custom_element_data(a_image1, "src", a_image1_src_value);
    			set_custom_element_data(a_image1, "width", "1.2");
    			set_custom_element_data(a_image1, "height", ".3");
    			set_custom_element_data(a_image1, "rotation", "0 90 0");
    			add_location(a_image1, file, 32, 6, 997);
    			set_custom_element_data(a_text0, "position", "2.22 1.06 -.5");
    			set_custom_element_data(a_text0, "value", "#CyberFit");
    			set_custom_element_data(a_text0, "color", "#fff");
    			set_custom_element_data(a_text0, "line-height", "50");
    			set_custom_element_data(a_text0, "rotation", "-80 180 0");
    			set_custom_element_data(a_text0, "scale", ".7 .7 .7");
    			add_location(a_text0, file, 33, 6, 1102);
    			set_custom_element_data(a_text1, "position", "1.5 .99 1.8");
    			set_custom_element_data(a_text1, "value", "#CyberFit");
    			set_custom_element_data(a_text1, "color", "#fff");
    			set_custom_element_data(a_text1, "line-height", "50");
    			set_custom_element_data(a_text1, "rotation", "-70 0 0");
    			set_custom_element_data(a_text1, "scale", ".7 .7 .7");
    			add_location(a_text1, file, 34, 6, 1237);
    			set_custom_element_data(a_entity0, "position", "0 -.285 0");
    			set_custom_element_data(a_entity0, "rotation", "0 0 0");
    			set_custom_element_data(a_entity0, "gltf-model", "url(./wheel.glb)");
    			add_location(a_entity0, file, 37, 8, 1498);
    			set_custom_element_data(a_entity1, "position", "2.38 0.385 1.85");
    			set_custom_element_data(a_entity1, "animation", "property: rotation; to: 360 0 0; dur: 1000; easing: linear; loop: true");
    			add_location(a_entity1, file, 36, 6, 1369);
    			set_custom_element_data(a_entity2, "position", "0 -.285 0");
    			set_custom_element_data(a_entity2, "rotation", "0 0 0");
    			set_custom_element_data(a_entity2, "gltf-model", "url(./wheel.glb)");
    			add_location(a_entity2, file, 40, 8, 1741);
    			set_custom_element_data(a_entity3, "position", "2.38 0.385 -.28");
    			set_custom_element_data(a_entity3, "animation", "property: rotation; to: 360 0 0; dur: 1000; easing: linear; loop: true");
    			add_location(a_entity3, file, 39, 6, 1612);
    			set_custom_element_data(a_entity4, "position", "0 -.285 0");
    			set_custom_element_data(a_entity4, "rotation", "0 180 0");
    			set_custom_element_data(a_entity4, "gltf-model", "url(./wheel.glb)");
    			add_location(a_entity4, file, 43, 8, 1983);
    			set_custom_element_data(a_entity5, "position", "1.3 0.385 1.85");
    			set_custom_element_data(a_entity5, "animation", "property: rotation; to: 360 0 0; dur: 1000; easing: linear; loop: true");
    			add_location(a_entity5, file, 42, 6, 1855);
    			set_custom_element_data(a_entity6, "position", "0 -.285 0");
    			set_custom_element_data(a_entity6, "rotation", "0 180 0");
    			set_custom_element_data(a_entity6, "gltf-model", "url(./wheel.glb)");
    			add_location(a_entity6, file, 46, 8, 2227);
    			set_custom_element_data(a_entity7, "position", "1.3 0.385 -.28");
    			set_custom_element_data(a_entity7, "animation", "property: rotation; to: 360 0 0; dur: 1000; easing: linear; loop: true");
    			add_location(a_entity7, file, 45, 6, 2099);
    			set_custom_element_data(a_entity8, "light", "type: point; intensity: 2; distance: 5; decay: 1; color: #F00;");
    			set_custom_element_data(a_entity8, "position", "2 .9 -1");
    			add_location(a_entity8, file, 49, 6, 2344);
    			set_custom_element_data(a_entity9, "light", "type: point; intensity: 4; distance: 5; decay: 1; color: #FFF;");
    			set_custom_element_data(a_entity9, "position", "2 .5 3");
    			add_location(a_entity9, file, 51, 6, 2472);
    			set_custom_element_data(a_entity10, "position", ".7 -.12 -1.85");
    			set_custom_element_data(a_entity10, "rotation", "0 -90 0");
    			set_custom_element_data(a_entity10, "gltf-model", "url(./cybertruck.glb)");
    			add_location(a_entity10, file, 30, 4, 795);
    			set_custom_element_data(a_entity11, "position", a_entity11_position_value = "" + (/*roadPosition*/ ctx[0] + " 0 0"));
    			add_location(a_entity11, file, 56, 4, 2615);
    			set_custom_element_data(a_sky, "color", "#4875b3");
    			if (a_sky.src !== (a_sky_src_value = "./sky.jpg")) set_custom_element_data(a_sky, "src", a_sky_src_value);
    			add_location(a_sky, file, 63, 4, 2862);
    			set_custom_element_data(a_entity12, "light", "type: ambient; color: #BBB;");
    			add_location(a_entity12, file, 64, 4, 2914);
    			set_custom_element_data(a_camera, "position", /*cameraPosition*/ ctx[1]);
    			set_custom_element_data(a_camera, "rotation", /*cameraRotation*/ ctx[2]);
    			set_custom_element_data(a_camera, "look-controls", "enabled: false");
    			add_location(a_camera, file, 66, 4, 2977);
    			add_location(a_scene, file, 28, 1, 780);
    			attr_dev(main, "class", "svelte-rqzs13");
    			add_location(main, file, 25, 0, 661);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, a);
    			append_dev(main, t1);
    			append_dev(main, a_scene);
    			append_dev(a_scene, a_entity10);
    			append_dev(a_entity10, a_image0);
    			append_dev(a_entity10, t2);
    			append_dev(a_entity10, a_image1);
    			append_dev(a_entity10, t3);
    			append_dev(a_entity10, a_text0);
    			append_dev(a_entity10, t4);
    			append_dev(a_entity10, a_text1);
    			append_dev(a_entity10, t5);
    			append_dev(a_entity10, a_entity1);
    			append_dev(a_entity1, a_entity0);
    			append_dev(a_entity10, t6);
    			append_dev(a_entity10, a_entity3);
    			append_dev(a_entity3, a_entity2);
    			append_dev(a_entity10, t7);
    			append_dev(a_entity10, a_entity5);
    			append_dev(a_entity5, a_entity4);
    			append_dev(a_entity10, t8);
    			append_dev(a_entity10, a_entity7);
    			append_dev(a_entity7, a_entity6);
    			append_dev(a_entity10, t9);
    			append_dev(a_entity10, a_entity8);
    			append_dev(a_entity10, t10);
    			append_dev(a_entity10, a_entity9);
    			append_dev(a_scene, t11);
    			append_dev(a_scene, a_entity11);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(a_entity11, null);
    			}

    			append_dev(a_scene, t12);
    			append_dev(a_scene, a_sky);
    			append_dev(a_scene, t13);
    			append_dev(a_scene, a_entity12);
    			append_dev(a_scene, t14);
    			append_dev(a_scene, a_camera);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*roadLenght*/ 0) {
    				each_value = /*roads*/ ctx[3];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(a_entity11, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*roadPosition*/ 1 && a_entity11_position_value !== (a_entity11_position_value = "" + (/*roadPosition*/ ctx[0] + " 0 0"))) {
    				set_custom_element_data(a_entity11, "position", a_entity11_position_value);
    			}

    			if (dirty & /*cameraPosition*/ 2) {
    				set_custom_element_data(a_camera, "position", /*cameraPosition*/ ctx[1]);
    			}

    			if (dirty & /*cameraRotation*/ 4) {
    				set_custom_element_data(a_camera, "rotation", /*cameraRotation*/ ctx[2]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const coefficient = 0.005;
    const rotationRadius = 3;
    const roadLenght = 100;

    function instance($$self, $$props, $$invalidate) {
    	const roads = Array(roadLenght);
    	let frameCounter = 0;
    	let roadPosition = -30;
    	let cameraPosition = `0 2 ${rotationRadius}`;
    	let cameraRotation = "-30 0 0";

    	function update() {
    		$$invalidate(1, cameraPosition = `${Math.sin(frameCounter * coefficient) * rotationRadius} 2 ${Math.cos(frameCounter * coefficient) * rotationRadius}}`);
    		$$invalidate(2, cameraRotation = `-30 ${frameCounter * coefficient * 180 / Math.PI} 0`);
    		frameCounter++;
    		$$invalidate(0, roadPosition += coefficient * 5);

    		if (roadPosition > 30) {
    			$$invalidate(0, roadPosition = -30);
    		}
    	}

    	setInterval(update, 10);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("App", $$slots, []);

    	$$self.$capture_state = () => ({
    		coefficient,
    		rotationRadius,
    		roadLenght,
    		roads,
    		frameCounter,
    		roadPosition,
    		cameraPosition,
    		cameraRotation,
    		update
    	});

    	$$self.$inject_state = $$props => {
    		if ("frameCounter" in $$props) frameCounter = $$props.frameCounter;
    		if ("roadPosition" in $$props) $$invalidate(0, roadPosition = $$props.roadPosition);
    		if ("cameraPosition" in $$props) $$invalidate(1, cameraPosition = $$props.cameraPosition);
    		if ("cameraRotation" in $$props) $$invalidate(2, cameraRotation = $$props.cameraRotation);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [roadPosition, cameraPosition, cameraRotation, roads];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
