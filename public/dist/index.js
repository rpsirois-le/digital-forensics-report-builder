(function () {
    'use strict';

    const { useState: useState$1 } = React;
    const e$5 = React.createElement;

    const config = {
        INDICATORS: [
            {
                source: 'graykey'
                , type: 'pdf'
                , regex: /GrayKey Progress Report/i
            }
            , {
                source: 'dvr_examiner'
                , type: 'pdf'
                , regex: /DVR Examiner/i
            }
            , {
                source: 'counts'
                , type: 'csv'
                , regex: /data/i
            }
            , {
                source: 'cellebrite'
                , type: 'xml'
                , regex: /cellebrite/i
            }
        ]
    };

    function pdfParser( file, formData, setFormData ) {
        let reader = new FileReader();

        reader.onload = async function() {
            const typedarray = new Uint8Array( reader.result );

            const pdf = await pdfjsLib.getDocument( typedarray ).promise;
            const page = await pdf.getPage( 1 );
            const textNodes = await page.getTextContent();

            const reducer = ( prev, next ) => {
                return `${ prev }\n${ next.str }`
            };
            console.log( textNodes.items.reduce( reducer, '' ) );

            const source = determineFileSource( textNodes.items.map( node => node.str ), 'pdf' );
            console.log( source );
        };

        reader.onerror = function() {
            console.log( 'PDF Reader error', reader.error );
        };

        reader.readAsArrayBuffer( file );
    }

    function csvParser( file, formData, setFormData ) {
        let reader = new FileReader();

        reader.onload = async function() {
            console.log( reader.result );
            const source = determineFileSource( reader.result.split( '\n' ), 'csv' );
            console.log( source );
        };

        reader.onerror = function() {
            console.log( 'CSV Reader error', reader.error );
        };

        reader.readAsText( file );
    }

    function xmlParser( file, formData, setFormData ) {
        let reader = new FileReader();

        reader.onload = async function() {
            const data = parser.parse( reader.result, {
                ignoreAttributes: false
                , attributeNamePrefix: ''
                , textNodeName: 'text'
            });

            const source = determineFileSource( reader.result.split( '\n' ), 'xml' );

            if ( source == 'cellebrite' ) parseCellebriteXmlReport( data, formData, setFormData );
        };

        reader.onerror = function() {
            console.log( 'XML Reader error', reader.error );
        };

        reader.readAsText( file );
    }

    function determineFileSource( lines, type ) {
        let n = 0;
        const parsers = config.INDICATORS.filter( parser => parser.type == type );

        function next( linenum ) {
            if ( linenum >= lines.length ) return false

            const line = lines[linenum];
            let match = false;

            parsers.forEach( indicator => {
                if ( line.match( indicator.regex ) ) match = indicator.source;
            });

            if ( match ) return match

            return next( n++ )
        }

        return next( n )
    }

    const parseCellebriteXmlReport = ( data, formData, setFormData ) => {
        const { project } = data;

        let updateFields = { ...formData };

        console.log( project );

        // case information
        project.caseInformation.field.forEach( field => {
            if ( field.name == 'Examiner name' ) updateFields.examiner = field.text;
            if ( field.name == 'Authorization' ) updateFields.auth_type = field.text;
            if ( field.name == 'Requester Name' ) updateFields.requester = field.text;
            if ( field.name == 'Unit name' ) updateFields.cellebrite_ufed_name = field.text;
            if ( field.name == 'Extraction type' ) updateFields.extraction_type = field.text;
            if ( field.name == 'Case number' ) updateFields.crn = field.text;
            if ( field.name == 'Evidence number' ) updateFields.evid_num = field.text;
        });
        // metadata additional fields
        project.metadata.forEach( metadata => {
            // additional fields
            if ( metadata.section == 'Additional Fields' ) {
                metadata.item.forEach( field => {
                    if ( field.name == 'UFED_PA_Version' ) updateFields.cellebrite_pa_version = field.text;
                });
            }
            // extraction data
            else if ( metadata.section == 'Extraction Data' ) {
                metadata.item.forEach( field => {
                    if ( field.name == 'DeviceInfoUnitIdentifier' ) updateFields.cellebrite_ufed_sn = field.text;
                    if ( field.name == 'DeviceInfoUnitVersion' ) updateFields.cellebrite_ufed_ver = field.text;
                });
            }
            // Device Info
            else if ( metadata.section == 'Device Info' ) {
                metadata.item.forEach( field => {
                    if ( field.name == 'DeviceInfoDetectedManufacturer' ) updateFields.dev_make = field.text;
                    if ( field.name == 'DeviceInfoDetectedModel' ) updateFields.dev_model_name = field.text;
                });
            }
        });

        setFormData( updateFields );
    };

    function FileParser({ name, label, formData, setFormData }) {
        const [ filename, setFilename ] = useState$1( '' );
        const handleFile = e => {
            const file = e.target.files[0];
            const { name, type, size } = file;

            setFilename( name );

            console.log( `GOT FILE: ${ name }, ${ type }, ${ size }` );

            if ( type == 'application/pdf' ) pdfParser( file);
            else if ( type == 'text/csv' )  csvParser( file);
            else if ( type == 'text/xml' || type == 'application/xml' )  xmlParser( file, formData, setFormData );
            else return `File type ${ type } is unsupported`
        };

        return e$5( 'div', { className: 'field' }, [
            e$5( 'div', { className: 'file has-name is-fullwidth' }, [
                e$5( 'label', { className: 'file-label' }, [
                    e$5( 'input', { className: 'file-input', type: 'file', name: name, onChange: handleFile } )
                    , e$5( 'span', { className: 'file-cta' }, [
                        e$5( 'span', { className: 'file-icon' }, [
                            e$5( 'i', { className: 'fas fa-upload' } )
                        ])
                        , e$5( 'span', { className: 'file-label' }, label )
                    ])
                    , e$5( 'span', { className: 'file-name' }, filename )
                ])
            ])
        ])
    }

    var react = {exports: {}};

    var react_development = {};

    /*
    object-assign
    (c) Sindre Sorhus
    @license MIT
    */
    /* eslint-disable no-unused-vars */
    var getOwnPropertySymbols = Object.getOwnPropertySymbols;
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var propIsEnumerable = Object.prototype.propertyIsEnumerable;

    function toObject(val) {
    	if (val === null || val === undefined) {
    		throw new TypeError('Object.assign cannot be called with null or undefined');
    	}

    	return Object(val);
    }

    function shouldUseNative() {
    	try {
    		if (!Object.assign) {
    			return false;
    		}

    		// Detect buggy property enumeration order in older V8 versions.

    		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
    		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
    		test1[5] = 'de';
    		if (Object.getOwnPropertyNames(test1)[0] === '5') {
    			return false;
    		}

    		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
    		var test2 = {};
    		for (var i = 0; i < 10; i++) {
    			test2['_' + String.fromCharCode(i)] = i;
    		}
    		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
    			return test2[n];
    		});
    		if (order2.join('') !== '0123456789') {
    			return false;
    		}

    		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
    		var test3 = {};
    		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
    			test3[letter] = letter;
    		});
    		if (Object.keys(Object.assign({}, test3)).join('') !==
    				'abcdefghijklmnopqrst') {
    			return false;
    		}

    		return true;
    	} catch (err) {
    		// We don't expect any of the above to throw, but better to be safe.
    		return false;
    	}
    }

    var objectAssign = shouldUseNative() ? Object.assign : function (target, source) {
    	var from;
    	var to = toObject(target);
    	var symbols;

    	for (var s = 1; s < arguments.length; s++) {
    		from = Object(arguments[s]);

    		for (var key in from) {
    			if (hasOwnProperty.call(from, key)) {
    				to[key] = from[key];
    			}
    		}

    		if (getOwnPropertySymbols) {
    			symbols = getOwnPropertySymbols(from);
    			for (var i = 0; i < symbols.length; i++) {
    				if (propIsEnumerable.call(from, symbols[i])) {
    					to[symbols[i]] = from[symbols[i]];
    				}
    			}
    		}
    	}

    	return to;
    };

    /** @license React v17.0.2
     * react.development.js
     *
     * Copyright (c) Facebook, Inc. and its affiliates.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */

    (function (exports) {

    {
      (function() {

    var _assign = objectAssign;

    // TODO: this is special because it gets imported during build.
    var ReactVersion = '17.0.2';

    // ATTENTION
    // When adding new symbols to this file,
    // Please consider also adding to 'react-devtools-shared/src/backend/ReactSymbols'
    // The Symbol used to tag the ReactElement-like types. If there is no native Symbol
    // nor polyfill, then a plain number is used for performance.
    var REACT_ELEMENT_TYPE = 0xeac7;
    var REACT_PORTAL_TYPE = 0xeaca;
    exports.Fragment = 0xeacb;
    exports.StrictMode = 0xeacc;
    exports.Profiler = 0xead2;
    var REACT_PROVIDER_TYPE = 0xeacd;
    var REACT_CONTEXT_TYPE = 0xeace;
    var REACT_FORWARD_REF_TYPE = 0xead0;
    exports.Suspense = 0xead1;
    var REACT_SUSPENSE_LIST_TYPE = 0xead8;
    var REACT_MEMO_TYPE = 0xead3;
    var REACT_LAZY_TYPE = 0xead4;
    var REACT_BLOCK_TYPE = 0xead9;
    var REACT_SERVER_BLOCK_TYPE = 0xeada;
    var REACT_FUNDAMENTAL_TYPE = 0xead5;
    var REACT_DEBUG_TRACING_MODE_TYPE = 0xeae1;
    var REACT_LEGACY_HIDDEN_TYPE = 0xeae3;

    if (typeof Symbol === 'function' && Symbol.for) {
      var symbolFor = Symbol.for;
      REACT_ELEMENT_TYPE = symbolFor('react.element');
      REACT_PORTAL_TYPE = symbolFor('react.portal');
      exports.Fragment = symbolFor('react.fragment');
      exports.StrictMode = symbolFor('react.strict_mode');
      exports.Profiler = symbolFor('react.profiler');
      REACT_PROVIDER_TYPE = symbolFor('react.provider');
      REACT_CONTEXT_TYPE = symbolFor('react.context');
      REACT_FORWARD_REF_TYPE = symbolFor('react.forward_ref');
      exports.Suspense = symbolFor('react.suspense');
      REACT_SUSPENSE_LIST_TYPE = symbolFor('react.suspense_list');
      REACT_MEMO_TYPE = symbolFor('react.memo');
      REACT_LAZY_TYPE = symbolFor('react.lazy');
      REACT_BLOCK_TYPE = symbolFor('react.block');
      REACT_SERVER_BLOCK_TYPE = symbolFor('react.server.block');
      REACT_FUNDAMENTAL_TYPE = symbolFor('react.fundamental');
      symbolFor('react.scope');
      symbolFor('react.opaque.id');
      REACT_DEBUG_TRACING_MODE_TYPE = symbolFor('react.debug_trace_mode');
      symbolFor('react.offscreen');
      REACT_LEGACY_HIDDEN_TYPE = symbolFor('react.legacy_hidden');
    }

    var MAYBE_ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
    var FAUX_ITERATOR_SYMBOL = '@@iterator';
    function getIteratorFn(maybeIterable) {
      if (maybeIterable === null || typeof maybeIterable !== 'object') {
        return null;
      }

      var maybeIterator = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL];

      if (typeof maybeIterator === 'function') {
        return maybeIterator;
      }

      return null;
    }

    /**
     * Keeps track of the current dispatcher.
     */
    var ReactCurrentDispatcher = {
      /**
       * @internal
       * @type {ReactComponent}
       */
      current: null
    };

    /**
     * Keeps track of the current batch's configuration such as how long an update
     * should suspend for if it needs to.
     */
    var ReactCurrentBatchConfig = {
      transition: 0
    };

    /**
     * Keeps track of the current owner.
     *
     * The current owner is the component who should own any components that are
     * currently being constructed.
     */
    var ReactCurrentOwner = {
      /**
       * @internal
       * @type {ReactComponent}
       */
      current: null
    };

    var ReactDebugCurrentFrame = {};
    var currentExtraStackFrame = null;
    function setExtraStackFrame(stack) {
      {
        currentExtraStackFrame = stack;
      }
    }

    {
      ReactDebugCurrentFrame.setExtraStackFrame = function (stack) {
        {
          currentExtraStackFrame = stack;
        }
      }; // Stack implementation injected by the current renderer.


      ReactDebugCurrentFrame.getCurrentStack = null;

      ReactDebugCurrentFrame.getStackAddendum = function () {
        var stack = ''; // Add an extra top frame while an element is being validated

        if (currentExtraStackFrame) {
          stack += currentExtraStackFrame;
        } // Delegate to the injected renderer-specific implementation


        var impl = ReactDebugCurrentFrame.getCurrentStack;

        if (impl) {
          stack += impl() || '';
        }

        return stack;
      };
    }

    /**
     * Used by act() to track whether you're inside an act() scope.
     */
    var IsSomeRendererActing = {
      current: false
    };

    var ReactSharedInternals = {
      ReactCurrentDispatcher: ReactCurrentDispatcher,
      ReactCurrentBatchConfig: ReactCurrentBatchConfig,
      ReactCurrentOwner: ReactCurrentOwner,
      IsSomeRendererActing: IsSomeRendererActing,
      // Used by renderers to avoid bundling object-assign twice in UMD bundles:
      assign: _assign
    };

    {
      ReactSharedInternals.ReactDebugCurrentFrame = ReactDebugCurrentFrame;
    }

    // by calls to these methods by a Babel plugin.
    //
    // In PROD (or in packages without access to React internals),
    // they are left as they are instead.

    function warn(format) {
      {
        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        printWarning('warn', format, args);
      }
    }
    function error(format) {
      {
        for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
          args[_key2 - 1] = arguments[_key2];
        }

        printWarning('error', format, args);
      }
    }

    function printWarning(level, format, args) {
      // When changing this logic, you might want to also
      // update consoleWithStackDev.www.js as well.
      {
        var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;
        var stack = ReactDebugCurrentFrame.getStackAddendum();

        if (stack !== '') {
          format += '%s';
          args = args.concat([stack]);
        }

        var argsWithFormat = args.map(function (item) {
          return '' + item;
        }); // Careful: RN currently depends on this prefix

        argsWithFormat.unshift('Warning: ' + format); // We intentionally don't use spread (or .apply) directly because it
        // breaks IE9: https://github.com/facebook/react/issues/13610
        // eslint-disable-next-line react-internal/no-production-logging

        Function.prototype.apply.call(console[level], console, argsWithFormat);
      }
    }

    var didWarnStateUpdateForUnmountedComponent = {};

    function warnNoop(publicInstance, callerName) {
      {
        var _constructor = publicInstance.constructor;
        var componentName = _constructor && (_constructor.displayName || _constructor.name) || 'ReactClass';
        var warningKey = componentName + "." + callerName;

        if (didWarnStateUpdateForUnmountedComponent[warningKey]) {
          return;
        }

        error("Can't call %s on a component that is not yet mounted. " + 'This is a no-op, but it might indicate a bug in your application. ' + 'Instead, assign to `this.state` directly or define a `state = {};` ' + 'class property with the desired state in the %s component.', callerName, componentName);

        didWarnStateUpdateForUnmountedComponent[warningKey] = true;
      }
    }
    /**
     * This is the abstract API for an update queue.
     */


    var ReactNoopUpdateQueue = {
      /**
       * Checks whether or not this composite component is mounted.
       * @param {ReactClass} publicInstance The instance we want to test.
       * @return {boolean} True if mounted, false otherwise.
       * @protected
       * @final
       */
      isMounted: function (publicInstance) {
        return false;
      },

      /**
       * Forces an update. This should only be invoked when it is known with
       * certainty that we are **not** in a DOM transaction.
       *
       * You may want to call this when you know that some deeper aspect of the
       * component's state has changed but `setState` was not called.
       *
       * This will not invoke `shouldComponentUpdate`, but it will invoke
       * `componentWillUpdate` and `componentDidUpdate`.
       *
       * @param {ReactClass} publicInstance The instance that should rerender.
       * @param {?function} callback Called after component is updated.
       * @param {?string} callerName name of the calling function in the public API.
       * @internal
       */
      enqueueForceUpdate: function (publicInstance, callback, callerName) {
        warnNoop(publicInstance, 'forceUpdate');
      },

      /**
       * Replaces all of the state. Always use this or `setState` to mutate state.
       * You should treat `this.state` as immutable.
       *
       * There is no guarantee that `this.state` will be immediately updated, so
       * accessing `this.state` after calling this method may return the old value.
       *
       * @param {ReactClass} publicInstance The instance that should rerender.
       * @param {object} completeState Next state.
       * @param {?function} callback Called after component is updated.
       * @param {?string} callerName name of the calling function in the public API.
       * @internal
       */
      enqueueReplaceState: function (publicInstance, completeState, callback, callerName) {
        warnNoop(publicInstance, 'replaceState');
      },

      /**
       * Sets a subset of the state. This only exists because _pendingState is
       * internal. This provides a merging strategy that is not available to deep
       * properties which is confusing. TODO: Expose pendingState or don't use it
       * during the merge.
       *
       * @param {ReactClass} publicInstance The instance that should rerender.
       * @param {object} partialState Next partial state to be merged with state.
       * @param {?function} callback Called after component is updated.
       * @param {?string} Name of the calling function in the public API.
       * @internal
       */
      enqueueSetState: function (publicInstance, partialState, callback, callerName) {
        warnNoop(publicInstance, 'setState');
      }
    };

    var emptyObject = {};

    {
      Object.freeze(emptyObject);
    }
    /**
     * Base class helpers for the updating state of a component.
     */


    function Component(props, context, updater) {
      this.props = props;
      this.context = context; // If a component has string refs, we will assign a different object later.

      this.refs = emptyObject; // We initialize the default updater but the real one gets injected by the
      // renderer.

      this.updater = updater || ReactNoopUpdateQueue;
    }

    Component.prototype.isReactComponent = {};
    /**
     * Sets a subset of the state. Always use this to mutate
     * state. You should treat `this.state` as immutable.
     *
     * There is no guarantee that `this.state` will be immediately updated, so
     * accessing `this.state` after calling this method may return the old value.
     *
     * There is no guarantee that calls to `setState` will run synchronously,
     * as they may eventually be batched together.  You can provide an optional
     * callback that will be executed when the call to setState is actually
     * completed.
     *
     * When a function is provided to setState, it will be called at some point in
     * the future (not synchronously). It will be called with the up to date
     * component arguments (state, props, context). These values can be different
     * from this.* because your function may be called after receiveProps but before
     * shouldComponentUpdate, and this new state, props, and context will not yet be
     * assigned to this.
     *
     * @param {object|function} partialState Next partial state or function to
     *        produce next partial state to be merged with current state.
     * @param {?function} callback Called after state is updated.
     * @final
     * @protected
     */

    Component.prototype.setState = function (partialState, callback) {
      if (!(typeof partialState === 'object' || typeof partialState === 'function' || partialState == null)) {
        {
          throw Error( "setState(...): takes an object of state variables to update or a function which returns an object of state variables." );
        }
      }

      this.updater.enqueueSetState(this, partialState, callback, 'setState');
    };
    /**
     * Forces an update. This should only be invoked when it is known with
     * certainty that we are **not** in a DOM transaction.
     *
     * You may want to call this when you know that some deeper aspect of the
     * component's state has changed but `setState` was not called.
     *
     * This will not invoke `shouldComponentUpdate`, but it will invoke
     * `componentWillUpdate` and `componentDidUpdate`.
     *
     * @param {?function} callback Called after update is complete.
     * @final
     * @protected
     */


    Component.prototype.forceUpdate = function (callback) {
      this.updater.enqueueForceUpdate(this, callback, 'forceUpdate');
    };
    /**
     * Deprecated APIs. These APIs used to exist on classic React classes but since
     * we would like to deprecate them, we're not going to move them over to this
     * modern base class. Instead, we define a getter that warns if it's accessed.
     */


    {
      var deprecatedAPIs = {
        isMounted: ['isMounted', 'Instead, make sure to clean up subscriptions and pending requests in ' + 'componentWillUnmount to prevent memory leaks.'],
        replaceState: ['replaceState', 'Refactor your code to use setState instead (see ' + 'https://github.com/facebook/react/issues/3236).']
      };

      var defineDeprecationWarning = function (methodName, info) {
        Object.defineProperty(Component.prototype, methodName, {
          get: function () {
            warn('%s(...) is deprecated in plain JavaScript React classes. %s', info[0], info[1]);

            return undefined;
          }
        });
      };

      for (var fnName in deprecatedAPIs) {
        if (deprecatedAPIs.hasOwnProperty(fnName)) {
          defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
        }
      }
    }

    function ComponentDummy() {}

    ComponentDummy.prototype = Component.prototype;
    /**
     * Convenience component with default shallow equality check for sCU.
     */

    function PureComponent(props, context, updater) {
      this.props = props;
      this.context = context; // If a component has string refs, we will assign a different object later.

      this.refs = emptyObject;
      this.updater = updater || ReactNoopUpdateQueue;
    }

    var pureComponentPrototype = PureComponent.prototype = new ComponentDummy();
    pureComponentPrototype.constructor = PureComponent; // Avoid an extra prototype jump for these methods.

    _assign(pureComponentPrototype, Component.prototype);

    pureComponentPrototype.isPureReactComponent = true;

    // an immutable object with a single mutable value
    function createRef() {
      var refObject = {
        current: null
      };

      {
        Object.seal(refObject);
      }

      return refObject;
    }

    function getWrappedName(outerType, innerType, wrapperName) {
      var functionName = innerType.displayName || innerType.name || '';
      return outerType.displayName || (functionName !== '' ? wrapperName + "(" + functionName + ")" : wrapperName);
    }

    function getContextName(type) {
      return type.displayName || 'Context';
    }

    function getComponentName(type) {
      if (type == null) {
        // Host root, text node or just invalid type.
        return null;
      }

      {
        if (typeof type.tag === 'number') {
          error('Received an unexpected object in getComponentName(). ' + 'This is likely a bug in React. Please file an issue.');
        }
      }

      if (typeof type === 'function') {
        return type.displayName || type.name || null;
      }

      if (typeof type === 'string') {
        return type;
      }

      switch (type) {
        case exports.Fragment:
          return 'Fragment';

        case REACT_PORTAL_TYPE:
          return 'Portal';

        case exports.Profiler:
          return 'Profiler';

        case exports.StrictMode:
          return 'StrictMode';

        case exports.Suspense:
          return 'Suspense';

        case REACT_SUSPENSE_LIST_TYPE:
          return 'SuspenseList';
      }

      if (typeof type === 'object') {
        switch (type.$$typeof) {
          case REACT_CONTEXT_TYPE:
            var context = type;
            return getContextName(context) + '.Consumer';

          case REACT_PROVIDER_TYPE:
            var provider = type;
            return getContextName(provider._context) + '.Provider';

          case REACT_FORWARD_REF_TYPE:
            return getWrappedName(type, type.render, 'ForwardRef');

          case REACT_MEMO_TYPE:
            return getComponentName(type.type);

          case REACT_BLOCK_TYPE:
            return getComponentName(type._render);

          case REACT_LAZY_TYPE:
            {
              var lazyComponent = type;
              var payload = lazyComponent._payload;
              var init = lazyComponent._init;

              try {
                return getComponentName(init(payload));
              } catch (x) {
                return null;
              }
            }
        }
      }

      return null;
    }

    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var RESERVED_PROPS = {
      key: true,
      ref: true,
      __self: true,
      __source: true
    };
    var specialPropKeyWarningShown, specialPropRefWarningShown, didWarnAboutStringRefs;

    {
      didWarnAboutStringRefs = {};
    }

    function hasValidRef(config) {
      {
        if (hasOwnProperty.call(config, 'ref')) {
          var getter = Object.getOwnPropertyDescriptor(config, 'ref').get;

          if (getter && getter.isReactWarning) {
            return false;
          }
        }
      }

      return config.ref !== undefined;
    }

    function hasValidKey(config) {
      {
        if (hasOwnProperty.call(config, 'key')) {
          var getter = Object.getOwnPropertyDescriptor(config, 'key').get;

          if (getter && getter.isReactWarning) {
            return false;
          }
        }
      }

      return config.key !== undefined;
    }

    function defineKeyPropWarningGetter(props, displayName) {
      var warnAboutAccessingKey = function () {
        {
          if (!specialPropKeyWarningShown) {
            specialPropKeyWarningShown = true;

            error('%s: `key` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://reactjs.org/link/special-props)', displayName);
          }
        }
      };

      warnAboutAccessingKey.isReactWarning = true;
      Object.defineProperty(props, 'key', {
        get: warnAboutAccessingKey,
        configurable: true
      });
    }

    function defineRefPropWarningGetter(props, displayName) {
      var warnAboutAccessingRef = function () {
        {
          if (!specialPropRefWarningShown) {
            specialPropRefWarningShown = true;

            error('%s: `ref` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://reactjs.org/link/special-props)', displayName);
          }
        }
      };

      warnAboutAccessingRef.isReactWarning = true;
      Object.defineProperty(props, 'ref', {
        get: warnAboutAccessingRef,
        configurable: true
      });
    }

    function warnIfStringRefCannotBeAutoConverted(config) {
      {
        if (typeof config.ref === 'string' && ReactCurrentOwner.current && config.__self && ReactCurrentOwner.current.stateNode !== config.__self) {
          var componentName = getComponentName(ReactCurrentOwner.current.type);

          if (!didWarnAboutStringRefs[componentName]) {
            error('Component "%s" contains the string ref "%s". ' + 'Support for string refs will be removed in a future major release. ' + 'This case cannot be automatically converted to an arrow function. ' + 'We ask you to manually fix this case by using useRef() or createRef() instead. ' + 'Learn more about using refs safely here: ' + 'https://reactjs.org/link/strict-mode-string-ref', componentName, config.ref);

            didWarnAboutStringRefs[componentName] = true;
          }
        }
      }
    }
    /**
     * Factory method to create a new React element. This no longer adheres to
     * the class pattern, so do not use new to call it. Also, instanceof check
     * will not work. Instead test $$typeof field against Symbol.for('react.element') to check
     * if something is a React Element.
     *
     * @param {*} type
     * @param {*} props
     * @param {*} key
     * @param {string|object} ref
     * @param {*} owner
     * @param {*} self A *temporary* helper to detect places where `this` is
     * different from the `owner` when React.createElement is called, so that we
     * can warn. We want to get rid of owner and replace string `ref`s with arrow
     * functions, and as long as `this` and owner are the same, there will be no
     * change in behavior.
     * @param {*} source An annotation object (added by a transpiler or otherwise)
     * indicating filename, line number, and/or other information.
     * @internal
     */


    var ReactElement = function (type, key, ref, self, source, owner, props) {
      var element = {
        // This tag allows us to uniquely identify this as a React Element
        $$typeof: REACT_ELEMENT_TYPE,
        // Built-in properties that belong on the element
        type: type,
        key: key,
        ref: ref,
        props: props,
        // Record the component responsible for creating this element.
        _owner: owner
      };

      {
        // The validation flag is currently mutative. We put it on
        // an external backing store so that we can freeze the whole object.
        // This can be replaced with a WeakMap once they are implemented in
        // commonly used development environments.
        element._store = {}; // To make comparing ReactElements easier for testing purposes, we make
        // the validation flag non-enumerable (where possible, which should
        // include every environment we run tests in), so the test framework
        // ignores it.

        Object.defineProperty(element._store, 'validated', {
          configurable: false,
          enumerable: false,
          writable: true,
          value: false
        }); // self and source are DEV only properties.

        Object.defineProperty(element, '_self', {
          configurable: false,
          enumerable: false,
          writable: false,
          value: self
        }); // Two elements created in two different places should be considered
        // equal for testing purposes and therefore we hide it from enumeration.

        Object.defineProperty(element, '_source', {
          configurable: false,
          enumerable: false,
          writable: false,
          value: source
        });

        if (Object.freeze) {
          Object.freeze(element.props);
          Object.freeze(element);
        }
      }

      return element;
    };
    /**
     * Create and return a new ReactElement of the given type.
     * See https://reactjs.org/docs/react-api.html#createelement
     */

    function createElement(type, config, children) {
      var propName; // Reserved names are extracted

      var props = {};
      var key = null;
      var ref = null;
      var self = null;
      var source = null;

      if (config != null) {
        if (hasValidRef(config)) {
          ref = config.ref;

          {
            warnIfStringRefCannotBeAutoConverted(config);
          }
        }

        if (hasValidKey(config)) {
          key = '' + config.key;
        }

        self = config.__self === undefined ? null : config.__self;
        source = config.__source === undefined ? null : config.__source; // Remaining properties are added to a new props object

        for (propName in config) {
          if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
            props[propName] = config[propName];
          }
        }
      } // Children can be more than one argument, and those are transferred onto
      // the newly allocated props object.


      var childrenLength = arguments.length - 2;

      if (childrenLength === 1) {
        props.children = children;
      } else if (childrenLength > 1) {
        var childArray = Array(childrenLength);

        for (var i = 0; i < childrenLength; i++) {
          childArray[i] = arguments[i + 2];
        }

        {
          if (Object.freeze) {
            Object.freeze(childArray);
          }
        }

        props.children = childArray;
      } // Resolve default props


      if (type && type.defaultProps) {
        var defaultProps = type.defaultProps;

        for (propName in defaultProps) {
          if (props[propName] === undefined) {
            props[propName] = defaultProps[propName];
          }
        }
      }

      {
        if (key || ref) {
          var displayName = typeof type === 'function' ? type.displayName || type.name || 'Unknown' : type;

          if (key) {
            defineKeyPropWarningGetter(props, displayName);
          }

          if (ref) {
            defineRefPropWarningGetter(props, displayName);
          }
        }
      }

      return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
    }
    function cloneAndReplaceKey(oldElement, newKey) {
      var newElement = ReactElement(oldElement.type, newKey, oldElement.ref, oldElement._self, oldElement._source, oldElement._owner, oldElement.props);
      return newElement;
    }
    /**
     * Clone and return a new ReactElement using element as the starting point.
     * See https://reactjs.org/docs/react-api.html#cloneelement
     */

    function cloneElement(element, config, children) {
      if (!!(element === null || element === undefined)) {
        {
          throw Error( "React.cloneElement(...): The argument must be a React element, but you passed " + element + "." );
        }
      }

      var propName; // Original props are copied

      var props = _assign({}, element.props); // Reserved names are extracted


      var key = element.key;
      var ref = element.ref; // Self is preserved since the owner is preserved.

      var self = element._self; // Source is preserved since cloneElement is unlikely to be targeted by a
      // transpiler, and the original source is probably a better indicator of the
      // true owner.

      var source = element._source; // Owner will be preserved, unless ref is overridden

      var owner = element._owner;

      if (config != null) {
        if (hasValidRef(config)) {
          // Silently steal the ref from the parent.
          ref = config.ref;
          owner = ReactCurrentOwner.current;
        }

        if (hasValidKey(config)) {
          key = '' + config.key;
        } // Remaining properties override existing props


        var defaultProps;

        if (element.type && element.type.defaultProps) {
          defaultProps = element.type.defaultProps;
        }

        for (propName in config) {
          if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
            if (config[propName] === undefined && defaultProps !== undefined) {
              // Resolve default props
              props[propName] = defaultProps[propName];
            } else {
              props[propName] = config[propName];
            }
          }
        }
      } // Children can be more than one argument, and those are transferred onto
      // the newly allocated props object.


      var childrenLength = arguments.length - 2;

      if (childrenLength === 1) {
        props.children = children;
      } else if (childrenLength > 1) {
        var childArray = Array(childrenLength);

        for (var i = 0; i < childrenLength; i++) {
          childArray[i] = arguments[i + 2];
        }

        props.children = childArray;
      }

      return ReactElement(element.type, key, ref, self, source, owner, props);
    }
    /**
     * Verifies the object is a ReactElement.
     * See https://reactjs.org/docs/react-api.html#isvalidelement
     * @param {?object} object
     * @return {boolean} True if `object` is a ReactElement.
     * @final
     */

    function isValidElement(object) {
      return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
    }

    var SEPARATOR = '.';
    var SUBSEPARATOR = ':';
    /**
     * Escape and wrap key so it is safe to use as a reactid
     *
     * @param {string} key to be escaped.
     * @return {string} the escaped key.
     */

    function escape(key) {
      var escapeRegex = /[=:]/g;
      var escaperLookup = {
        '=': '=0',
        ':': '=2'
      };
      var escapedString = key.replace(escapeRegex, function (match) {
        return escaperLookup[match];
      });
      return '$' + escapedString;
    }
    /**
     * TODO: Test that a single child and an array with one item have the same key
     * pattern.
     */


    var didWarnAboutMaps = false;
    var userProvidedKeyEscapeRegex = /\/+/g;

    function escapeUserProvidedKey(text) {
      return text.replace(userProvidedKeyEscapeRegex, '$&/');
    }
    /**
     * Generate a key string that identifies a element within a set.
     *
     * @param {*} element A element that could contain a manual key.
     * @param {number} index Index that is used if a manual key is not provided.
     * @return {string}
     */


    function getElementKey(element, index) {
      // Do some typechecking here since we call this blindly. We want to ensure
      // that we don't block potential future ES APIs.
      if (typeof element === 'object' && element !== null && element.key != null) {
        // Explicit key
        return escape('' + element.key);
      } // Implicit key determined by the index in the set


      return index.toString(36);
    }

    function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
      var type = typeof children;

      if (type === 'undefined' || type === 'boolean') {
        // All of the above are perceived as null.
        children = null;
      }

      var invokeCallback = false;

      if (children === null) {
        invokeCallback = true;
      } else {
        switch (type) {
          case 'string':
          case 'number':
            invokeCallback = true;
            break;

          case 'object':
            switch (children.$$typeof) {
              case REACT_ELEMENT_TYPE:
              case REACT_PORTAL_TYPE:
                invokeCallback = true;
            }

        }
      }

      if (invokeCallback) {
        var _child = children;
        var mappedChild = callback(_child); // If it's the only child, treat the name as if it was wrapped in an array
        // so that it's consistent if the number of children grows:

        var childKey = nameSoFar === '' ? SEPARATOR + getElementKey(_child, 0) : nameSoFar;

        if (Array.isArray(mappedChild)) {
          var escapedChildKey = '';

          if (childKey != null) {
            escapedChildKey = escapeUserProvidedKey(childKey) + '/';
          }

          mapIntoArray(mappedChild, array, escapedChildKey, '', function (c) {
            return c;
          });
        } else if (mappedChild != null) {
          if (isValidElement(mappedChild)) {
            mappedChild = cloneAndReplaceKey(mappedChild, // Keep both the (mapped) and old keys if they differ, just as
            // traverseAllChildren used to do for objects as children
            escapedPrefix + ( // $FlowFixMe Flow incorrectly thinks React.Portal doesn't have a key
            mappedChild.key && (!_child || _child.key !== mappedChild.key) ? // $FlowFixMe Flow incorrectly thinks existing element's key can be a number
            escapeUserProvidedKey('' + mappedChild.key) + '/' : '') + childKey);
          }

          array.push(mappedChild);
        }

        return 1;
      }

      var child;
      var nextName;
      var subtreeCount = 0; // Count of children found in the current subtree.

      var nextNamePrefix = nameSoFar === '' ? SEPARATOR : nameSoFar + SUBSEPARATOR;

      if (Array.isArray(children)) {
        for (var i = 0; i < children.length; i++) {
          child = children[i];
          nextName = nextNamePrefix + getElementKey(child, i);
          subtreeCount += mapIntoArray(child, array, escapedPrefix, nextName, callback);
        }
      } else {
        var iteratorFn = getIteratorFn(children);

        if (typeof iteratorFn === 'function') {
          var iterableChildren = children;

          {
            // Warn about using Maps as children
            if (iteratorFn === iterableChildren.entries) {
              if (!didWarnAboutMaps) {
                warn('Using Maps as children is not supported. ' + 'Use an array of keyed ReactElements instead.');
              }

              didWarnAboutMaps = true;
            }
          }

          var iterator = iteratorFn.call(iterableChildren);
          var step;
          var ii = 0;

          while (!(step = iterator.next()).done) {
            child = step.value;
            nextName = nextNamePrefix + getElementKey(child, ii++);
            subtreeCount += mapIntoArray(child, array, escapedPrefix, nextName, callback);
          }
        } else if (type === 'object') {
          var childrenString = '' + children;

          {
            {
              throw Error( "Objects are not valid as a React child (found: " + (childrenString === '[object Object]' ? 'object with keys {' + Object.keys(children).join(', ') + '}' : childrenString) + "). If you meant to render a collection of children, use an array instead." );
            }
          }
        }
      }

      return subtreeCount;
    }

    /**
     * Maps children that are typically specified as `props.children`.
     *
     * See https://reactjs.org/docs/react-api.html#reactchildrenmap
     *
     * The provided mapFunction(child, index) will be called for each
     * leaf child.
     *
     * @param {?*} children Children tree container.
     * @param {function(*, int)} func The map function.
     * @param {*} context Context for mapFunction.
     * @return {object} Object containing the ordered map of results.
     */
    function mapChildren(children, func, context) {
      if (children == null) {
        return children;
      }

      var result = [];
      var count = 0;
      mapIntoArray(children, result, '', '', function (child) {
        return func.call(context, child, count++);
      });
      return result;
    }
    /**
     * Count the number of children that are typically specified as
     * `props.children`.
     *
     * See https://reactjs.org/docs/react-api.html#reactchildrencount
     *
     * @param {?*} children Children tree container.
     * @return {number} The number of children.
     */


    function countChildren(children) {
      var n = 0;
      mapChildren(children, function () {
        n++; // Don't return anything
      });
      return n;
    }

    /**
     * Iterates through children that are typically specified as `props.children`.
     *
     * See https://reactjs.org/docs/react-api.html#reactchildrenforeach
     *
     * The provided forEachFunc(child, index) will be called for each
     * leaf child.
     *
     * @param {?*} children Children tree container.
     * @param {function(*, int)} forEachFunc
     * @param {*} forEachContext Context for forEachContext.
     */
    function forEachChildren(children, forEachFunc, forEachContext) {
      mapChildren(children, function () {
        forEachFunc.apply(this, arguments); // Don't return anything.
      }, forEachContext);
    }
    /**
     * Flatten a children object (typically specified as `props.children`) and
     * return an array with appropriately re-keyed children.
     *
     * See https://reactjs.org/docs/react-api.html#reactchildrentoarray
     */


    function toArray(children) {
      return mapChildren(children, function (child) {
        return child;
      }) || [];
    }
    /**
     * Returns the first child in a collection of children and verifies that there
     * is only one child in the collection.
     *
     * See https://reactjs.org/docs/react-api.html#reactchildrenonly
     *
     * The current implementation of this function assumes that a single child gets
     * passed without a wrapper, but the purpose of this helper function is to
     * abstract away the particular structure of children.
     *
     * @param {?object} children Child collection structure.
     * @return {ReactElement} The first and only `ReactElement` contained in the
     * structure.
     */


    function onlyChild(children) {
      if (!isValidElement(children)) {
        {
          throw Error( "React.Children.only expected to receive a single React element child." );
        }
      }

      return children;
    }

    function createContext(defaultValue, calculateChangedBits) {
      if (calculateChangedBits === undefined) {
        calculateChangedBits = null;
      } else {
        {
          if (calculateChangedBits !== null && typeof calculateChangedBits !== 'function') {
            error('createContext: Expected the optional second argument to be a ' + 'function. Instead received: %s', calculateChangedBits);
          }
        }
      }

      var context = {
        $$typeof: REACT_CONTEXT_TYPE,
        _calculateChangedBits: calculateChangedBits,
        // As a workaround to support multiple concurrent renderers, we categorize
        // some renderers as primary and others as secondary. We only expect
        // there to be two concurrent renderers at most: React Native (primary) and
        // Fabric (secondary); React DOM (primary) and React ART (secondary).
        // Secondary renderers store their context values on separate fields.
        _currentValue: defaultValue,
        _currentValue2: defaultValue,
        // Used to track how many concurrent renderers this context currently
        // supports within in a single renderer. Such as parallel server rendering.
        _threadCount: 0,
        // These are circular
        Provider: null,
        Consumer: null
      };
      context.Provider = {
        $$typeof: REACT_PROVIDER_TYPE,
        _context: context
      };
      var hasWarnedAboutUsingNestedContextConsumers = false;
      var hasWarnedAboutUsingConsumerProvider = false;
      var hasWarnedAboutDisplayNameOnConsumer = false;

      {
        // A separate object, but proxies back to the original context object for
        // backwards compatibility. It has a different $$typeof, so we can properly
        // warn for the incorrect usage of Context as a Consumer.
        var Consumer = {
          $$typeof: REACT_CONTEXT_TYPE,
          _context: context,
          _calculateChangedBits: context._calculateChangedBits
        }; // $FlowFixMe: Flow complains about not setting a value, which is intentional here

        Object.defineProperties(Consumer, {
          Provider: {
            get: function () {
              if (!hasWarnedAboutUsingConsumerProvider) {
                hasWarnedAboutUsingConsumerProvider = true;

                error('Rendering <Context.Consumer.Provider> is not supported and will be removed in ' + 'a future major release. Did you mean to render <Context.Provider> instead?');
              }

              return context.Provider;
            },
            set: function (_Provider) {
              context.Provider = _Provider;
            }
          },
          _currentValue: {
            get: function () {
              return context._currentValue;
            },
            set: function (_currentValue) {
              context._currentValue = _currentValue;
            }
          },
          _currentValue2: {
            get: function () {
              return context._currentValue2;
            },
            set: function (_currentValue2) {
              context._currentValue2 = _currentValue2;
            }
          },
          _threadCount: {
            get: function () {
              return context._threadCount;
            },
            set: function (_threadCount) {
              context._threadCount = _threadCount;
            }
          },
          Consumer: {
            get: function () {
              if (!hasWarnedAboutUsingNestedContextConsumers) {
                hasWarnedAboutUsingNestedContextConsumers = true;

                error('Rendering <Context.Consumer.Consumer> is not supported and will be removed in ' + 'a future major release. Did you mean to render <Context.Consumer> instead?');
              }

              return context.Consumer;
            }
          },
          displayName: {
            get: function () {
              return context.displayName;
            },
            set: function (displayName) {
              if (!hasWarnedAboutDisplayNameOnConsumer) {
                warn('Setting `displayName` on Context.Consumer has no effect. ' + "You should set it directly on the context with Context.displayName = '%s'.", displayName);

                hasWarnedAboutDisplayNameOnConsumer = true;
              }
            }
          }
        }); // $FlowFixMe: Flow complains about missing properties because it doesn't understand defineProperty

        context.Consumer = Consumer;
      }

      {
        context._currentRenderer = null;
        context._currentRenderer2 = null;
      }

      return context;
    }

    var Uninitialized = -1;
    var Pending = 0;
    var Resolved = 1;
    var Rejected = 2;

    function lazyInitializer(payload) {
      if (payload._status === Uninitialized) {
        var ctor = payload._result;
        var thenable = ctor(); // Transition to the next state.

        var pending = payload;
        pending._status = Pending;
        pending._result = thenable;
        thenable.then(function (moduleObject) {
          if (payload._status === Pending) {
            var defaultExport = moduleObject.default;

            {
              if (defaultExport === undefined) {
                error('lazy: Expected the result of a dynamic import() call. ' + 'Instead received: %s\n\nYour code should look like: \n  ' + // Break up imports to avoid accidentally parsing them as dependencies.
                'const MyComponent = lazy(() => imp' + "ort('./MyComponent'))", moduleObject);
              }
            } // Transition to the next state.


            var resolved = payload;
            resolved._status = Resolved;
            resolved._result = defaultExport;
          }
        }, function (error) {
          if (payload._status === Pending) {
            // Transition to the next state.
            var rejected = payload;
            rejected._status = Rejected;
            rejected._result = error;
          }
        });
      }

      if (payload._status === Resolved) {
        return payload._result;
      } else {
        throw payload._result;
      }
    }

    function lazy(ctor) {
      var payload = {
        // We use these fields to store the result.
        _status: -1,
        _result: ctor
      };
      var lazyType = {
        $$typeof: REACT_LAZY_TYPE,
        _payload: payload,
        _init: lazyInitializer
      };

      {
        // In production, this would just set it on the object.
        var defaultProps;
        var propTypes; // $FlowFixMe

        Object.defineProperties(lazyType, {
          defaultProps: {
            configurable: true,
            get: function () {
              return defaultProps;
            },
            set: function (newDefaultProps) {
              error('React.lazy(...): It is not supported to assign `defaultProps` to ' + 'a lazy component import. Either specify them where the component ' + 'is defined, or create a wrapping component around it.');

              defaultProps = newDefaultProps; // Match production behavior more closely:
              // $FlowFixMe

              Object.defineProperty(lazyType, 'defaultProps', {
                enumerable: true
              });
            }
          },
          propTypes: {
            configurable: true,
            get: function () {
              return propTypes;
            },
            set: function (newPropTypes) {
              error('React.lazy(...): It is not supported to assign `propTypes` to ' + 'a lazy component import. Either specify them where the component ' + 'is defined, or create a wrapping component around it.');

              propTypes = newPropTypes; // Match production behavior more closely:
              // $FlowFixMe

              Object.defineProperty(lazyType, 'propTypes', {
                enumerable: true
              });
            }
          }
        });
      }

      return lazyType;
    }

    function forwardRef(render) {
      {
        if (render != null && render.$$typeof === REACT_MEMO_TYPE) {
          error('forwardRef requires a render function but received a `memo` ' + 'component. Instead of forwardRef(memo(...)), use ' + 'memo(forwardRef(...)).');
        } else if (typeof render !== 'function') {
          error('forwardRef requires a render function but was given %s.', render === null ? 'null' : typeof render);
        } else {
          if (render.length !== 0 && render.length !== 2) {
            error('forwardRef render functions accept exactly two parameters: props and ref. %s', render.length === 1 ? 'Did you forget to use the ref parameter?' : 'Any additional parameter will be undefined.');
          }
        }

        if (render != null) {
          if (render.defaultProps != null || render.propTypes != null) {
            error('forwardRef render functions do not support propTypes or defaultProps. ' + 'Did you accidentally pass a React component?');
          }
        }
      }

      var elementType = {
        $$typeof: REACT_FORWARD_REF_TYPE,
        render: render
      };

      {
        var ownName;
        Object.defineProperty(elementType, 'displayName', {
          enumerable: false,
          configurable: true,
          get: function () {
            return ownName;
          },
          set: function (name) {
            ownName = name;

            if (render.displayName == null) {
              render.displayName = name;
            }
          }
        });
      }

      return elementType;
    }

    // Filter certain DOM attributes (e.g. src, href) if their values are empty strings.

    var enableScopeAPI = false; // Experimental Create Event Handle API.

    function isValidElementType(type) {
      if (typeof type === 'string' || typeof type === 'function') {
        return true;
      } // Note: typeof might be other than 'symbol' or 'number' (e.g. if it's a polyfill).


      if (type === exports.Fragment || type === exports.Profiler || type === REACT_DEBUG_TRACING_MODE_TYPE || type === exports.StrictMode || type === exports.Suspense || type === REACT_SUSPENSE_LIST_TYPE || type === REACT_LEGACY_HIDDEN_TYPE || enableScopeAPI ) {
        return true;
      }

      if (typeof type === 'object' && type !== null) {
        if (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_FUNDAMENTAL_TYPE || type.$$typeof === REACT_BLOCK_TYPE || type[0] === REACT_SERVER_BLOCK_TYPE) {
          return true;
        }
      }

      return false;
    }

    function memo(type, compare) {
      {
        if (!isValidElementType(type)) {
          error('memo: The first argument must be a component. Instead ' + 'received: %s', type === null ? 'null' : typeof type);
        }
      }

      var elementType = {
        $$typeof: REACT_MEMO_TYPE,
        type: type,
        compare: compare === undefined ? null : compare
      };

      {
        var ownName;
        Object.defineProperty(elementType, 'displayName', {
          enumerable: false,
          configurable: true,
          get: function () {
            return ownName;
          },
          set: function (name) {
            ownName = name;

            if (type.displayName == null) {
              type.displayName = name;
            }
          }
        });
      }

      return elementType;
    }

    function resolveDispatcher() {
      var dispatcher = ReactCurrentDispatcher.current;

      if (!(dispatcher !== null)) {
        {
          throw Error( "Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem." );
        }
      }

      return dispatcher;
    }

    function useContext(Context, unstable_observedBits) {
      var dispatcher = resolveDispatcher();

      {
        if (unstable_observedBits !== undefined) {
          error('useContext() second argument is reserved for future ' + 'use in React. Passing it is not supported. ' + 'You passed: %s.%s', unstable_observedBits, typeof unstable_observedBits === 'number' && Array.isArray(arguments[2]) ? '\n\nDid you call array.map(useContext)? ' + 'Calling Hooks inside a loop is not supported. ' + 'Learn more at https://reactjs.org/link/rules-of-hooks' : '');
        } // TODO: add a more generic warning for invalid values.


        if (Context._context !== undefined) {
          var realContext = Context._context; // Don't deduplicate because this legitimately causes bugs
          // and nobody should be using this in existing code.

          if (realContext.Consumer === Context) {
            error('Calling useContext(Context.Consumer) is not supported, may cause bugs, and will be ' + 'removed in a future major release. Did you mean to call useContext(Context) instead?');
          } else if (realContext.Provider === Context) {
            error('Calling useContext(Context.Provider) is not supported. ' + 'Did you mean to call useContext(Context) instead?');
          }
        }
      }

      return dispatcher.useContext(Context, unstable_observedBits);
    }
    function useState(initialState) {
      var dispatcher = resolveDispatcher();
      return dispatcher.useState(initialState);
    }
    function useReducer(reducer, initialArg, init) {
      var dispatcher = resolveDispatcher();
      return dispatcher.useReducer(reducer, initialArg, init);
    }
    function useRef(initialValue) {
      var dispatcher = resolveDispatcher();
      return dispatcher.useRef(initialValue);
    }
    function useEffect(create, deps) {
      var dispatcher = resolveDispatcher();
      return dispatcher.useEffect(create, deps);
    }
    function useLayoutEffect(create, deps) {
      var dispatcher = resolveDispatcher();
      return dispatcher.useLayoutEffect(create, deps);
    }
    function useCallback(callback, deps) {
      var dispatcher = resolveDispatcher();
      return dispatcher.useCallback(callback, deps);
    }
    function useMemo(create, deps) {
      var dispatcher = resolveDispatcher();
      return dispatcher.useMemo(create, deps);
    }
    function useImperativeHandle(ref, create, deps) {
      var dispatcher = resolveDispatcher();
      return dispatcher.useImperativeHandle(ref, create, deps);
    }
    function useDebugValue(value, formatterFn) {
      {
        var dispatcher = resolveDispatcher();
        return dispatcher.useDebugValue(value, formatterFn);
      }
    }

    // Helpers to patch console.logs to avoid logging during side-effect free
    // replaying on render function. This currently only patches the object
    // lazily which won't cover if the log function was extracted eagerly.
    // We could also eagerly patch the method.
    var disabledDepth = 0;
    var prevLog;
    var prevInfo;
    var prevWarn;
    var prevError;
    var prevGroup;
    var prevGroupCollapsed;
    var prevGroupEnd;

    function disabledLog() {}

    disabledLog.__reactDisabledLog = true;
    function disableLogs() {
      {
        if (disabledDepth === 0) {
          /* eslint-disable react-internal/no-production-logging */
          prevLog = console.log;
          prevInfo = console.info;
          prevWarn = console.warn;
          prevError = console.error;
          prevGroup = console.group;
          prevGroupCollapsed = console.groupCollapsed;
          prevGroupEnd = console.groupEnd; // https://github.com/facebook/react/issues/19099

          var props = {
            configurable: true,
            enumerable: true,
            value: disabledLog,
            writable: true
          }; // $FlowFixMe Flow thinks console is immutable.

          Object.defineProperties(console, {
            info: props,
            log: props,
            warn: props,
            error: props,
            group: props,
            groupCollapsed: props,
            groupEnd: props
          });
          /* eslint-enable react-internal/no-production-logging */
        }

        disabledDepth++;
      }
    }
    function reenableLogs() {
      {
        disabledDepth--;

        if (disabledDepth === 0) {
          /* eslint-disable react-internal/no-production-logging */
          var props = {
            configurable: true,
            enumerable: true,
            writable: true
          }; // $FlowFixMe Flow thinks console is immutable.

          Object.defineProperties(console, {
            log: _assign({}, props, {
              value: prevLog
            }),
            info: _assign({}, props, {
              value: prevInfo
            }),
            warn: _assign({}, props, {
              value: prevWarn
            }),
            error: _assign({}, props, {
              value: prevError
            }),
            group: _assign({}, props, {
              value: prevGroup
            }),
            groupCollapsed: _assign({}, props, {
              value: prevGroupCollapsed
            }),
            groupEnd: _assign({}, props, {
              value: prevGroupEnd
            })
          });
          /* eslint-enable react-internal/no-production-logging */
        }

        if (disabledDepth < 0) {
          error('disabledDepth fell below zero. ' + 'This is a bug in React. Please file an issue.');
        }
      }
    }

    var ReactCurrentDispatcher$1 = ReactSharedInternals.ReactCurrentDispatcher;
    var prefix;
    function describeBuiltInComponentFrame(name, source, ownerFn) {
      {
        if (prefix === undefined) {
          // Extract the VM specific prefix used by each line.
          try {
            throw Error();
          } catch (x) {
            var match = x.stack.trim().match(/\n( *(at )?)/);
            prefix = match && match[1] || '';
          }
        } // We use the prefix to ensure our stacks line up with native stack frames.


        return '\n' + prefix + name;
      }
    }
    var reentry = false;
    var componentFrameCache;

    {
      var PossiblyWeakMap = typeof WeakMap === 'function' ? WeakMap : Map;
      componentFrameCache = new PossiblyWeakMap();
    }

    function describeNativeComponentFrame(fn, construct) {
      // If something asked for a stack inside a fake render, it should get ignored.
      if (!fn || reentry) {
        return '';
      }

      {
        var frame = componentFrameCache.get(fn);

        if (frame !== undefined) {
          return frame;
        }
      }

      var control;
      reentry = true;
      var previousPrepareStackTrace = Error.prepareStackTrace; // $FlowFixMe It does accept undefined.

      Error.prepareStackTrace = undefined;
      var previousDispatcher;

      {
        previousDispatcher = ReactCurrentDispatcher$1.current; // Set the dispatcher in DEV because this might be call in the render function
        // for warnings.

        ReactCurrentDispatcher$1.current = null;
        disableLogs();
      }

      try {
        // This should throw.
        if (construct) {
          // Something should be setting the props in the constructor.
          var Fake = function () {
            throw Error();
          }; // $FlowFixMe


          Object.defineProperty(Fake.prototype, 'props', {
            set: function () {
              // We use a throwing setter instead of frozen or non-writable props
              // because that won't throw in a non-strict mode function.
              throw Error();
            }
          });

          if (typeof Reflect === 'object' && Reflect.construct) {
            // We construct a different control for this case to include any extra
            // frames added by the construct call.
            try {
              Reflect.construct(Fake, []);
            } catch (x) {
              control = x;
            }

            Reflect.construct(fn, [], Fake);
          } else {
            try {
              Fake.call();
            } catch (x) {
              control = x;
            }

            fn.call(Fake.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (x) {
            control = x;
          }

          fn();
        }
      } catch (sample) {
        // This is inlined manually because closure doesn't do it for us.
        if (sample && control && typeof sample.stack === 'string') {
          // This extracts the first frame from the sample that isn't also in the control.
          // Skipping one frame that we assume is the frame that calls the two.
          var sampleLines = sample.stack.split('\n');
          var controlLines = control.stack.split('\n');
          var s = sampleLines.length - 1;
          var c = controlLines.length - 1;

          while (s >= 1 && c >= 0 && sampleLines[s] !== controlLines[c]) {
            // We expect at least one stack frame to be shared.
            // Typically this will be the root most one. However, stack frames may be
            // cut off due to maximum stack limits. In this case, one maybe cut off
            // earlier than the other. We assume that the sample is longer or the same
            // and there for cut off earlier. So we should find the root most frame in
            // the sample somewhere in the control.
            c--;
          }

          for (; s >= 1 && c >= 0; s--, c--) {
            // Next we find the first one that isn't the same which should be the
            // frame that called our sample function and the control.
            if (sampleLines[s] !== controlLines[c]) {
              // In V8, the first line is describing the message but other VMs don't.
              // If we're about to return the first line, and the control is also on the same
              // line, that's a pretty good indicator that our sample threw at same line as
              // the control. I.e. before we entered the sample frame. So we ignore this result.
              // This can happen if you passed a class to function component, or non-function.
              if (s !== 1 || c !== 1) {
                do {
                  s--;
                  c--; // We may still have similar intermediate frames from the construct call.
                  // The next one that isn't the same should be our match though.

                  if (c < 0 || sampleLines[s] !== controlLines[c]) {
                    // V8 adds a "new" prefix for native classes. Let's remove it to make it prettier.
                    var _frame = '\n' + sampleLines[s].replace(' at new ', ' at ');

                    {
                      if (typeof fn === 'function') {
                        componentFrameCache.set(fn, _frame);
                      }
                    } // Return the line we found.


                    return _frame;
                  }
                } while (s >= 1 && c >= 0);
              }

              break;
            }
          }
        }
      } finally {
        reentry = false;

        {
          ReactCurrentDispatcher$1.current = previousDispatcher;
          reenableLogs();
        }

        Error.prepareStackTrace = previousPrepareStackTrace;
      } // Fallback to just using the name if we couldn't make it throw.


      var name = fn ? fn.displayName || fn.name : '';
      var syntheticFrame = name ? describeBuiltInComponentFrame(name) : '';

      {
        if (typeof fn === 'function') {
          componentFrameCache.set(fn, syntheticFrame);
        }
      }

      return syntheticFrame;
    }
    function describeFunctionComponentFrame(fn, source, ownerFn) {
      {
        return describeNativeComponentFrame(fn, false);
      }
    }

    function shouldConstruct(Component) {
      var prototype = Component.prototype;
      return !!(prototype && prototype.isReactComponent);
    }

    function describeUnknownElementTypeFrameInDEV(type, source, ownerFn) {

      if (type == null) {
        return '';
      }

      if (typeof type === 'function') {
        {
          return describeNativeComponentFrame(type, shouldConstruct(type));
        }
      }

      if (typeof type === 'string') {
        return describeBuiltInComponentFrame(type);
      }

      switch (type) {
        case exports.Suspense:
          return describeBuiltInComponentFrame('Suspense');

        case REACT_SUSPENSE_LIST_TYPE:
          return describeBuiltInComponentFrame('SuspenseList');
      }

      if (typeof type === 'object') {
        switch (type.$$typeof) {
          case REACT_FORWARD_REF_TYPE:
            return describeFunctionComponentFrame(type.render);

          case REACT_MEMO_TYPE:
            // Memo may contain any component type so we recursively resolve it.
            return describeUnknownElementTypeFrameInDEV(type.type, source, ownerFn);

          case REACT_BLOCK_TYPE:
            return describeFunctionComponentFrame(type._render);

          case REACT_LAZY_TYPE:
            {
              var lazyComponent = type;
              var payload = lazyComponent._payload;
              var init = lazyComponent._init;

              try {
                // Lazy may contain any component type so we recursively resolve it.
                return describeUnknownElementTypeFrameInDEV(init(payload), source, ownerFn);
              } catch (x) {}
            }
        }
      }

      return '';
    }

    var loggedTypeFailures = {};
    var ReactDebugCurrentFrame$1 = ReactSharedInternals.ReactDebugCurrentFrame;

    function setCurrentlyValidatingElement(element) {
      {
        if (element) {
          var owner = element._owner;
          var stack = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
          ReactDebugCurrentFrame$1.setExtraStackFrame(stack);
        } else {
          ReactDebugCurrentFrame$1.setExtraStackFrame(null);
        }
      }
    }

    function checkPropTypes(typeSpecs, values, location, componentName, element) {
      {
        // $FlowFixMe This is okay but Flow doesn't know it.
        var has = Function.call.bind(Object.prototype.hasOwnProperty);

        for (var typeSpecName in typeSpecs) {
          if (has(typeSpecs, typeSpecName)) {
            var error$1 = void 0; // Prop type validation may throw. In case they do, we don't want to
            // fail the render phase where it didn't fail before. So we log it.
            // After these have been cleaned up, we'll let them throw.

            try {
              // This is intentionally an invariant that gets caught. It's the same
              // behavior as without this statement except with a better message.
              if (typeof typeSpecs[typeSpecName] !== 'function') {
                var err = Error((componentName || 'React class') + ': ' + location + ' type `' + typeSpecName + '` is invalid; ' + 'it must be a function, usually from the `prop-types` package, but received `' + typeof typeSpecs[typeSpecName] + '`.' + 'This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.');
                err.name = 'Invariant Violation';
                throw err;
              }

              error$1 = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED');
            } catch (ex) {
              error$1 = ex;
            }

            if (error$1 && !(error$1 instanceof Error)) {
              setCurrentlyValidatingElement(element);

              error('%s: type specification of %s' + ' `%s` is invalid; the type checker ' + 'function must return `null` or an `Error` but returned a %s. ' + 'You may have forgotten to pass an argument to the type checker ' + 'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' + 'shape all require an argument).', componentName || 'React class', location, typeSpecName, typeof error$1);

              setCurrentlyValidatingElement(null);
            }

            if (error$1 instanceof Error && !(error$1.message in loggedTypeFailures)) {
              // Only monitor this failure once because there tends to be a lot of the
              // same error.
              loggedTypeFailures[error$1.message] = true;
              setCurrentlyValidatingElement(element);

              error('Failed %s type: %s', location, error$1.message);

              setCurrentlyValidatingElement(null);
            }
          }
        }
      }
    }

    function setCurrentlyValidatingElement$1(element) {
      {
        if (element) {
          var owner = element._owner;
          var stack = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
          setExtraStackFrame(stack);
        } else {
          setExtraStackFrame(null);
        }
      }
    }

    var propTypesMisspellWarningShown;

    {
      propTypesMisspellWarningShown = false;
    }

    function getDeclarationErrorAddendum() {
      if (ReactCurrentOwner.current) {
        var name = getComponentName(ReactCurrentOwner.current.type);

        if (name) {
          return '\n\nCheck the render method of `' + name + '`.';
        }
      }

      return '';
    }

    function getSourceInfoErrorAddendum(source) {
      if (source !== undefined) {
        var fileName = source.fileName.replace(/^.*[\\\/]/, '');
        var lineNumber = source.lineNumber;
        return '\n\nCheck your code at ' + fileName + ':' + lineNumber + '.';
      }

      return '';
    }

    function getSourceInfoErrorAddendumForProps(elementProps) {
      if (elementProps !== null && elementProps !== undefined) {
        return getSourceInfoErrorAddendum(elementProps.__source);
      }

      return '';
    }
    /**
     * Warn if there's no key explicitly set on dynamic arrays of children or
     * object keys are not valid. This allows us to keep track of children between
     * updates.
     */


    var ownerHasKeyUseWarning = {};

    function getCurrentComponentErrorInfo(parentType) {
      var info = getDeclarationErrorAddendum();

      if (!info) {
        var parentName = typeof parentType === 'string' ? parentType : parentType.displayName || parentType.name;

        if (parentName) {
          info = "\n\nCheck the top-level render call using <" + parentName + ">.";
        }
      }

      return info;
    }
    /**
     * Warn if the element doesn't have an explicit key assigned to it.
     * This element is in an array. The array could grow and shrink or be
     * reordered. All children that haven't already been validated are required to
     * have a "key" property assigned to it. Error statuses are cached so a warning
     * will only be shown once.
     *
     * @internal
     * @param {ReactElement} element Element that requires a key.
     * @param {*} parentType element's parent's type.
     */


    function validateExplicitKey(element, parentType) {
      if (!element._store || element._store.validated || element.key != null) {
        return;
      }

      element._store.validated = true;
      var currentComponentErrorInfo = getCurrentComponentErrorInfo(parentType);

      if (ownerHasKeyUseWarning[currentComponentErrorInfo]) {
        return;
      }

      ownerHasKeyUseWarning[currentComponentErrorInfo] = true; // Usually the current owner is the offender, but if it accepts children as a
      // property, it may be the creator of the child that's responsible for
      // assigning it a key.

      var childOwner = '';

      if (element && element._owner && element._owner !== ReactCurrentOwner.current) {
        // Give the component that originally created this child.
        childOwner = " It was passed a child from " + getComponentName(element._owner.type) + ".";
      }

      {
        setCurrentlyValidatingElement$1(element);

        error('Each child in a list should have a unique "key" prop.' + '%s%s See https://reactjs.org/link/warning-keys for more information.', currentComponentErrorInfo, childOwner);

        setCurrentlyValidatingElement$1(null);
      }
    }
    /**
     * Ensure that every element either is passed in a static location, in an
     * array with an explicit keys property defined, or in an object literal
     * with valid key property.
     *
     * @internal
     * @param {ReactNode} node Statically passed child of any type.
     * @param {*} parentType node's parent's type.
     */


    function validateChildKeys(node, parentType) {
      if (typeof node !== 'object') {
        return;
      }

      if (Array.isArray(node)) {
        for (var i = 0; i < node.length; i++) {
          var child = node[i];

          if (isValidElement(child)) {
            validateExplicitKey(child, parentType);
          }
        }
      } else if (isValidElement(node)) {
        // This element was passed in a valid location.
        if (node._store) {
          node._store.validated = true;
        }
      } else if (node) {
        var iteratorFn = getIteratorFn(node);

        if (typeof iteratorFn === 'function') {
          // Entry iterators used to provide implicit keys,
          // but now we print a separate warning for them later.
          if (iteratorFn !== node.entries) {
            var iterator = iteratorFn.call(node);
            var step;

            while (!(step = iterator.next()).done) {
              if (isValidElement(step.value)) {
                validateExplicitKey(step.value, parentType);
              }
            }
          }
        }
      }
    }
    /**
     * Given an element, validate that its props follow the propTypes definition,
     * provided by the type.
     *
     * @param {ReactElement} element
     */


    function validatePropTypes(element) {
      {
        var type = element.type;

        if (type === null || type === undefined || typeof type === 'string') {
          return;
        }

        var propTypes;

        if (typeof type === 'function') {
          propTypes = type.propTypes;
        } else if (typeof type === 'object' && (type.$$typeof === REACT_FORWARD_REF_TYPE || // Note: Memo only checks outer props here.
        // Inner props are checked in the reconciler.
        type.$$typeof === REACT_MEMO_TYPE)) {
          propTypes = type.propTypes;
        } else {
          return;
        }

        if (propTypes) {
          // Intentionally inside to avoid triggering lazy initializers:
          var name = getComponentName(type);
          checkPropTypes(propTypes, element.props, 'prop', name, element);
        } else if (type.PropTypes !== undefined && !propTypesMisspellWarningShown) {
          propTypesMisspellWarningShown = true; // Intentionally inside to avoid triggering lazy initializers:

          var _name = getComponentName(type);

          error('Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?', _name || 'Unknown');
        }

        if (typeof type.getDefaultProps === 'function' && !type.getDefaultProps.isReactClassApproved) {
          error('getDefaultProps is only used on classic React.createClass ' + 'definitions. Use a static property named `defaultProps` instead.');
        }
      }
    }
    /**
     * Given a fragment, validate that it can only be provided with fragment props
     * @param {ReactElement} fragment
     */


    function validateFragmentProps(fragment) {
      {
        var keys = Object.keys(fragment.props);

        for (var i = 0; i < keys.length; i++) {
          var key = keys[i];

          if (key !== 'children' && key !== 'key') {
            setCurrentlyValidatingElement$1(fragment);

            error('Invalid prop `%s` supplied to `React.Fragment`. ' + 'React.Fragment can only have `key` and `children` props.', key);

            setCurrentlyValidatingElement$1(null);
            break;
          }
        }

        if (fragment.ref !== null) {
          setCurrentlyValidatingElement$1(fragment);

          error('Invalid attribute `ref` supplied to `React.Fragment`.');

          setCurrentlyValidatingElement$1(null);
        }
      }
    }
    function createElementWithValidation(type, props, children) {
      var validType = isValidElementType(type); // We warn in this case but don't throw. We expect the element creation to
      // succeed and there will likely be errors in render.

      if (!validType) {
        var info = '';

        if (type === undefined || typeof type === 'object' && type !== null && Object.keys(type).length === 0) {
          info += ' You likely forgot to export your component from the file ' + "it's defined in, or you might have mixed up default and named imports.";
        }

        var sourceInfo = getSourceInfoErrorAddendumForProps(props);

        if (sourceInfo) {
          info += sourceInfo;
        } else {
          info += getDeclarationErrorAddendum();
        }

        var typeString;

        if (type === null) {
          typeString = 'null';
        } else if (Array.isArray(type)) {
          typeString = 'array';
        } else if (type !== undefined && type.$$typeof === REACT_ELEMENT_TYPE) {
          typeString = "<" + (getComponentName(type.type) || 'Unknown') + " />";
          info = ' Did you accidentally export a JSX literal instead of a component?';
        } else {
          typeString = typeof type;
        }

        {
          error('React.createElement: type is invalid -- expected a string (for ' + 'built-in components) or a class/function (for composite ' + 'components) but got: %s.%s', typeString, info);
        }
      }

      var element = createElement.apply(this, arguments); // The result can be nullish if a mock or a custom function is used.
      // TODO: Drop this when these are no longer allowed as the type argument.

      if (element == null) {
        return element;
      } // Skip key warning if the type isn't valid since our key validation logic
      // doesn't expect a non-string/function type and can throw confusing errors.
      // We don't want exception behavior to differ between dev and prod.
      // (Rendering will throw with a helpful message and as soon as the type is
      // fixed, the key warnings will appear.)


      if (validType) {
        for (var i = 2; i < arguments.length; i++) {
          validateChildKeys(arguments[i], type);
        }
      }

      if (type === exports.Fragment) {
        validateFragmentProps(element);
      } else {
        validatePropTypes(element);
      }

      return element;
    }
    var didWarnAboutDeprecatedCreateFactory = false;
    function createFactoryWithValidation(type) {
      var validatedFactory = createElementWithValidation.bind(null, type);
      validatedFactory.type = type;

      {
        if (!didWarnAboutDeprecatedCreateFactory) {
          didWarnAboutDeprecatedCreateFactory = true;

          warn('React.createFactory() is deprecated and will be removed in ' + 'a future major release. Consider using JSX ' + 'or use React.createElement() directly instead.');
        } // Legacy hook: remove it


        Object.defineProperty(validatedFactory, 'type', {
          enumerable: false,
          get: function () {
            warn('Factory.type is deprecated. Access the class directly ' + 'before passing it to createFactory.');

            Object.defineProperty(this, 'type', {
              value: type
            });
            return type;
          }
        });
      }

      return validatedFactory;
    }
    function cloneElementWithValidation(element, props, children) {
      var newElement = cloneElement.apply(this, arguments);

      for (var i = 2; i < arguments.length; i++) {
        validateChildKeys(arguments[i], newElement.type);
      }

      validatePropTypes(newElement);
      return newElement;
    }

    {

      try {
        var frozenObject = Object.freeze({});
        /* eslint-disable no-new */

        new Map([[frozenObject, null]]);
        new Set([frozenObject]);
        /* eslint-enable no-new */
      } catch (e) {
      }
    }

    var createElement$1 =  createElementWithValidation ;
    var cloneElement$1 =  cloneElementWithValidation ;
    var createFactory =  createFactoryWithValidation ;
    var Children = {
      map: mapChildren,
      forEach: forEachChildren,
      count: countChildren,
      toArray: toArray,
      only: onlyChild
    };

    exports.Children = Children;
    exports.Component = Component;
    exports.PureComponent = PureComponent;
    exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = ReactSharedInternals;
    exports.cloneElement = cloneElement$1;
    exports.createContext = createContext;
    exports.createElement = createElement$1;
    exports.createFactory = createFactory;
    exports.createRef = createRef;
    exports.forwardRef = forwardRef;
    exports.isValidElement = isValidElement;
    exports.lazy = lazy;
    exports.memo = memo;
    exports.useCallback = useCallback;
    exports.useContext = useContext;
    exports.useDebugValue = useDebugValue;
    exports.useEffect = useEffect;
    exports.useImperativeHandle = useImperativeHandle;
    exports.useLayoutEffect = useLayoutEffect;
    exports.useMemo = useMemo;
    exports.useReducer = useReducer;
    exports.useRef = useRef;
    exports.useState = useState;
    exports.version = ReactVersion;
      })();
    }
    }(react_development));

    {
      react.exports = react_development;
    }

    var React$1 = react.exports;

    var propTypes = {exports: {}};

    var reactIs = {exports: {}};

    var reactIs_development = {};

    /** @license React v16.13.1
     * react-is.development.js
     *
     * Copyright (c) Facebook, Inc. and its affiliates.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */



    {
      (function() {

    // The Symbol used to tag the ReactElement-like types. If there is no native Symbol
    // nor polyfill, then a plain number is used for performance.
    var hasSymbol = typeof Symbol === 'function' && Symbol.for;
    var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for('react.element') : 0xeac7;
    var REACT_PORTAL_TYPE = hasSymbol ? Symbol.for('react.portal') : 0xeaca;
    var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for('react.fragment') : 0xeacb;
    var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for('react.strict_mode') : 0xeacc;
    var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for('react.profiler') : 0xead2;
    var REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for('react.provider') : 0xeacd;
    var REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for('react.context') : 0xeace; // TODO: We don't use AsyncMode or ConcurrentMode anymore. They were temporary
    // (unstable) APIs that have been removed. Can we remove the symbols?

    var REACT_ASYNC_MODE_TYPE = hasSymbol ? Symbol.for('react.async_mode') : 0xeacf;
    var REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol.for('react.concurrent_mode') : 0xeacf;
    var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for('react.forward_ref') : 0xead0;
    var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for('react.suspense') : 0xead1;
    var REACT_SUSPENSE_LIST_TYPE = hasSymbol ? Symbol.for('react.suspense_list') : 0xead8;
    var REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3;
    var REACT_LAZY_TYPE = hasSymbol ? Symbol.for('react.lazy') : 0xead4;
    var REACT_BLOCK_TYPE = hasSymbol ? Symbol.for('react.block') : 0xead9;
    var REACT_FUNDAMENTAL_TYPE = hasSymbol ? Symbol.for('react.fundamental') : 0xead5;
    var REACT_RESPONDER_TYPE = hasSymbol ? Symbol.for('react.responder') : 0xead6;
    var REACT_SCOPE_TYPE = hasSymbol ? Symbol.for('react.scope') : 0xead7;

    function isValidElementType(type) {
      return typeof type === 'string' || typeof type === 'function' || // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
      type === REACT_FRAGMENT_TYPE || type === REACT_CONCURRENT_MODE_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || typeof type === 'object' && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_FUNDAMENTAL_TYPE || type.$$typeof === REACT_RESPONDER_TYPE || type.$$typeof === REACT_SCOPE_TYPE || type.$$typeof === REACT_BLOCK_TYPE);
    }

    function typeOf(object) {
      if (typeof object === 'object' && object !== null) {
        var $$typeof = object.$$typeof;

        switch ($$typeof) {
          case REACT_ELEMENT_TYPE:
            var type = object.type;

            switch (type) {
              case REACT_ASYNC_MODE_TYPE:
              case REACT_CONCURRENT_MODE_TYPE:
              case REACT_FRAGMENT_TYPE:
              case REACT_PROFILER_TYPE:
              case REACT_STRICT_MODE_TYPE:
              case REACT_SUSPENSE_TYPE:
                return type;

              default:
                var $$typeofType = type && type.$$typeof;

                switch ($$typeofType) {
                  case REACT_CONTEXT_TYPE:
                  case REACT_FORWARD_REF_TYPE:
                  case REACT_LAZY_TYPE:
                  case REACT_MEMO_TYPE:
                  case REACT_PROVIDER_TYPE:
                    return $$typeofType;

                  default:
                    return $$typeof;
                }

            }

          case REACT_PORTAL_TYPE:
            return $$typeof;
        }
      }

      return undefined;
    } // AsyncMode is deprecated along with isAsyncMode

    var AsyncMode = REACT_ASYNC_MODE_TYPE;
    var ConcurrentMode = REACT_CONCURRENT_MODE_TYPE;
    var ContextConsumer = REACT_CONTEXT_TYPE;
    var ContextProvider = REACT_PROVIDER_TYPE;
    var Element = REACT_ELEMENT_TYPE;
    var ForwardRef = REACT_FORWARD_REF_TYPE;
    var Fragment = REACT_FRAGMENT_TYPE;
    var Lazy = REACT_LAZY_TYPE;
    var Memo = REACT_MEMO_TYPE;
    var Portal = REACT_PORTAL_TYPE;
    var Profiler = REACT_PROFILER_TYPE;
    var StrictMode = REACT_STRICT_MODE_TYPE;
    var Suspense = REACT_SUSPENSE_TYPE;
    var hasWarnedAboutDeprecatedIsAsyncMode = false; // AsyncMode should be deprecated

    function isAsyncMode(object) {
      {
        if (!hasWarnedAboutDeprecatedIsAsyncMode) {
          hasWarnedAboutDeprecatedIsAsyncMode = true; // Using console['warn'] to evade Babel and ESLint

          console['warn']('The ReactIs.isAsyncMode() alias has been deprecated, ' + 'and will be removed in React 17+. Update your code to use ' + 'ReactIs.isConcurrentMode() instead. It has the exact same API.');
        }
      }

      return isConcurrentMode(object) || typeOf(object) === REACT_ASYNC_MODE_TYPE;
    }
    function isConcurrentMode(object) {
      return typeOf(object) === REACT_CONCURRENT_MODE_TYPE;
    }
    function isContextConsumer(object) {
      return typeOf(object) === REACT_CONTEXT_TYPE;
    }
    function isContextProvider(object) {
      return typeOf(object) === REACT_PROVIDER_TYPE;
    }
    function isElement(object) {
      return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
    }
    function isForwardRef(object) {
      return typeOf(object) === REACT_FORWARD_REF_TYPE;
    }
    function isFragment(object) {
      return typeOf(object) === REACT_FRAGMENT_TYPE;
    }
    function isLazy(object) {
      return typeOf(object) === REACT_LAZY_TYPE;
    }
    function isMemo(object) {
      return typeOf(object) === REACT_MEMO_TYPE;
    }
    function isPortal(object) {
      return typeOf(object) === REACT_PORTAL_TYPE;
    }
    function isProfiler(object) {
      return typeOf(object) === REACT_PROFILER_TYPE;
    }
    function isStrictMode(object) {
      return typeOf(object) === REACT_STRICT_MODE_TYPE;
    }
    function isSuspense(object) {
      return typeOf(object) === REACT_SUSPENSE_TYPE;
    }

    reactIs_development.AsyncMode = AsyncMode;
    reactIs_development.ConcurrentMode = ConcurrentMode;
    reactIs_development.ContextConsumer = ContextConsumer;
    reactIs_development.ContextProvider = ContextProvider;
    reactIs_development.Element = Element;
    reactIs_development.ForwardRef = ForwardRef;
    reactIs_development.Fragment = Fragment;
    reactIs_development.Lazy = Lazy;
    reactIs_development.Memo = Memo;
    reactIs_development.Portal = Portal;
    reactIs_development.Profiler = Profiler;
    reactIs_development.StrictMode = StrictMode;
    reactIs_development.Suspense = Suspense;
    reactIs_development.isAsyncMode = isAsyncMode;
    reactIs_development.isConcurrentMode = isConcurrentMode;
    reactIs_development.isContextConsumer = isContextConsumer;
    reactIs_development.isContextProvider = isContextProvider;
    reactIs_development.isElement = isElement;
    reactIs_development.isForwardRef = isForwardRef;
    reactIs_development.isFragment = isFragment;
    reactIs_development.isLazy = isLazy;
    reactIs_development.isMemo = isMemo;
    reactIs_development.isPortal = isPortal;
    reactIs_development.isProfiler = isProfiler;
    reactIs_development.isStrictMode = isStrictMode;
    reactIs_development.isSuspense = isSuspense;
    reactIs_development.isValidElementType = isValidElementType;
    reactIs_development.typeOf = typeOf;
      })();
    }

    {
      reactIs.exports = reactIs_development;
    }

    /**
     * Copyright (c) 2013-present, Facebook, Inc.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */

    var ReactPropTypesSecret$2 = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

    var ReactPropTypesSecret_1 = ReactPropTypesSecret$2;

    /**
     * Copyright (c) 2013-present, Facebook, Inc.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */

    var printWarning$1 = function() {};

    {
      var ReactPropTypesSecret$1 = ReactPropTypesSecret_1;
      var loggedTypeFailures = {};
      var has$1 = Function.call.bind(Object.prototype.hasOwnProperty);

      printWarning$1 = function(text) {
        var message = 'Warning: ' + text;
        if (typeof console !== 'undefined') {
          console.error(message);
        }
        try {
          // --- Welcome to debugging React ---
          // This error was thrown as a convenience so that you can use this stack
          // to find the callsite that caused this warning to fire.
          throw new Error(message);
        } catch (x) {}
      };
    }

    /**
     * Assert that the values match with the type specs.
     * Error messages are memorized and will only be shown once.
     *
     * @param {object} typeSpecs Map of name to a ReactPropType
     * @param {object} values Runtime values that need to be type-checked
     * @param {string} location e.g. "prop", "context", "child context"
     * @param {string} componentName Name of the component for error messages.
     * @param {?Function} getStack Returns the component stack.
     * @private
     */
    function checkPropTypes$1(typeSpecs, values, location, componentName, getStack) {
      {
        for (var typeSpecName in typeSpecs) {
          if (has$1(typeSpecs, typeSpecName)) {
            var error;
            // Prop type validation may throw. In case they do, we don't want to
            // fail the render phase where it didn't fail before. So we log it.
            // After these have been cleaned up, we'll let them throw.
            try {
              // This is intentionally an invariant that gets caught. It's the same
              // behavior as without this statement except with a better message.
              if (typeof typeSpecs[typeSpecName] !== 'function') {
                var err = Error(
                  (componentName || 'React class') + ': ' + location + ' type `' + typeSpecName + '` is invalid; ' +
                  'it must be a function, usually from the `prop-types` package, but received `' + typeof typeSpecs[typeSpecName] + '`.'
                );
                err.name = 'Invariant Violation';
                throw err;
              }
              error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret$1);
            } catch (ex) {
              error = ex;
            }
            if (error && !(error instanceof Error)) {
              printWarning$1(
                (componentName || 'React class') + ': type specification of ' +
                location + ' `' + typeSpecName + '` is invalid; the type checker ' +
                'function must return `null` or an `Error` but returned a ' + typeof error + '. ' +
                'You may have forgotten to pass an argument to the type checker ' +
                'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' +
                'shape all require an argument).'
              );
            }
            if (error instanceof Error && !(error.message in loggedTypeFailures)) {
              // Only monitor this failure once because there tends to be a lot of the
              // same error.
              loggedTypeFailures[error.message] = true;

              var stack = getStack ? getStack() : '';

              printWarning$1(
                'Failed ' + location + ' type: ' + error.message + (stack != null ? stack : '')
              );
            }
          }
        }
      }
    }

    /**
     * Resets warning cache when testing.
     *
     * @private
     */
    checkPropTypes$1.resetWarningCache = function() {
      {
        loggedTypeFailures = {};
      }
    };

    var checkPropTypes_1 = checkPropTypes$1;

    /**
     * Copyright (c) 2013-present, Facebook, Inc.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */

    var ReactIs$1 = reactIs.exports;
    var assign = objectAssign;

    var ReactPropTypesSecret = ReactPropTypesSecret_1;
    var checkPropTypes = checkPropTypes_1;

    var has = Function.call.bind(Object.prototype.hasOwnProperty);
    var printWarning = function() {};

    {
      printWarning = function(text) {
        var message = 'Warning: ' + text;
        if (typeof console !== 'undefined') {
          console.error(message);
        }
        try {
          // --- Welcome to debugging React ---
          // This error was thrown as a convenience so that you can use this stack
          // to find the callsite that caused this warning to fire.
          throw new Error(message);
        } catch (x) {}
      };
    }

    function emptyFunctionThatReturnsNull() {
      return null;
    }

    var factoryWithTypeCheckers = function(isValidElement, throwOnDirectAccess) {
      /* global Symbol */
      var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
      var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

      /**
       * Returns the iterator method function contained on the iterable object.
       *
       * Be sure to invoke the function with the iterable as context:
       *
       *     var iteratorFn = getIteratorFn(myIterable);
       *     if (iteratorFn) {
       *       var iterator = iteratorFn.call(myIterable);
       *       ...
       *     }
       *
       * @param {?object} maybeIterable
       * @return {?function}
       */
      function getIteratorFn(maybeIterable) {
        var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
        if (typeof iteratorFn === 'function') {
          return iteratorFn;
        }
      }

      /**
       * Collection of methods that allow declaration and validation of props that are
       * supplied to React components. Example usage:
       *
       *   var Props = require('ReactPropTypes');
       *   var MyArticle = React.createClass({
       *     propTypes: {
       *       // An optional string prop named "description".
       *       description: Props.string,
       *
       *       // A required enum prop named "category".
       *       category: Props.oneOf(['News','Photos']).isRequired,
       *
       *       // A prop named "dialog" that requires an instance of Dialog.
       *       dialog: Props.instanceOf(Dialog).isRequired
       *     },
       *     render: function() { ... }
       *   });
       *
       * A more formal specification of how these methods are used:
       *
       *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
       *   decl := ReactPropTypes.{type}(.isRequired)?
       *
       * Each and every declaration produces a function with the same signature. This
       * allows the creation of custom validation functions. For example:
       *
       *  var MyLink = React.createClass({
       *    propTypes: {
       *      // An optional string or URI prop named "href".
       *      href: function(props, propName, componentName) {
       *        var propValue = props[propName];
       *        if (propValue != null && typeof propValue !== 'string' &&
       *            !(propValue instanceof URI)) {
       *          return new Error(
       *            'Expected a string or an URI for ' + propName + ' in ' +
       *            componentName
       *          );
       *        }
       *      }
       *    },
       *    render: function() {...}
       *  });
       *
       * @internal
       */

      var ANONYMOUS = '<<anonymous>>';

      // Important!
      // Keep this list in sync with production version in `./factoryWithThrowingShims.js`.
      var ReactPropTypes = {
        array: createPrimitiveTypeChecker('array'),
        bool: createPrimitiveTypeChecker('boolean'),
        func: createPrimitiveTypeChecker('function'),
        number: createPrimitiveTypeChecker('number'),
        object: createPrimitiveTypeChecker('object'),
        string: createPrimitiveTypeChecker('string'),
        symbol: createPrimitiveTypeChecker('symbol'),

        any: createAnyTypeChecker(),
        arrayOf: createArrayOfTypeChecker,
        element: createElementTypeChecker(),
        elementType: createElementTypeTypeChecker(),
        instanceOf: createInstanceTypeChecker,
        node: createNodeChecker(),
        objectOf: createObjectOfTypeChecker,
        oneOf: createEnumTypeChecker,
        oneOfType: createUnionTypeChecker,
        shape: createShapeTypeChecker,
        exact: createStrictShapeTypeChecker,
      };

      /**
       * inlined Object.is polyfill to avoid requiring consumers ship their own
       * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
       */
      /*eslint-disable no-self-compare*/
      function is(x, y) {
        // SameValue algorithm
        if (x === y) {
          // Steps 1-5, 7-10
          // Steps 6.b-6.e: +0 != -0
          return x !== 0 || 1 / x === 1 / y;
        } else {
          // Step 6.a: NaN == NaN
          return x !== x && y !== y;
        }
      }
      /*eslint-enable no-self-compare*/

      /**
       * We use an Error-like object for backward compatibility as people may call
       * PropTypes directly and inspect their output. However, we don't use real
       * Errors anymore. We don't inspect their stack anyway, and creating them
       * is prohibitively expensive if they are created too often, such as what
       * happens in oneOfType() for any type before the one that matched.
       */
      function PropTypeError(message) {
        this.message = message;
        this.stack = '';
      }
      // Make `instanceof Error` still work for returned errors.
      PropTypeError.prototype = Error.prototype;

      function createChainableTypeChecker(validate) {
        {
          var manualPropTypeCallCache = {};
          var manualPropTypeWarningCount = 0;
        }
        function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
          componentName = componentName || ANONYMOUS;
          propFullName = propFullName || propName;

          if (secret !== ReactPropTypesSecret) {
            if (throwOnDirectAccess) {
              // New behavior only for users of `prop-types` package
              var err = new Error(
                'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
                'Use `PropTypes.checkPropTypes()` to call them. ' +
                'Read more at http://fb.me/use-check-prop-types'
              );
              err.name = 'Invariant Violation';
              throw err;
            } else if (typeof console !== 'undefined') {
              // Old behavior for people using React.PropTypes
              var cacheKey = componentName + ':' + propName;
              if (
                !manualPropTypeCallCache[cacheKey] &&
                // Avoid spamming the console because they are often not actionable except for lib authors
                manualPropTypeWarningCount < 3
              ) {
                printWarning(
                  'You are manually calling a React.PropTypes validation ' +
                  'function for the `' + propFullName + '` prop on `' + componentName  + '`. This is deprecated ' +
                  'and will throw in the standalone `prop-types` package. ' +
                  'You may be seeing this warning due to a third-party PropTypes ' +
                  'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.'
                );
                manualPropTypeCallCache[cacheKey] = true;
                manualPropTypeWarningCount++;
              }
            }
          }
          if (props[propName] == null) {
            if (isRequired) {
              if (props[propName] === null) {
                return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));
              }
              return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));
            }
            return null;
          } else {
            return validate(props, propName, componentName, location, propFullName);
          }
        }

        var chainedCheckType = checkType.bind(null, false);
        chainedCheckType.isRequired = checkType.bind(null, true);

        return chainedCheckType;
      }

      function createPrimitiveTypeChecker(expectedType) {
        function validate(props, propName, componentName, location, propFullName, secret) {
          var propValue = props[propName];
          var propType = getPropType(propValue);
          if (propType !== expectedType) {
            // `propValue` being instance of, say, date/regexp, pass the 'object'
            // check, but we can offer a more precise error message here rather than
            // 'of type `object`'.
            var preciseType = getPreciseType(propValue);

            return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'));
          }
          return null;
        }
        return createChainableTypeChecker(validate);
      }

      function createAnyTypeChecker() {
        return createChainableTypeChecker(emptyFunctionThatReturnsNull);
      }

      function createArrayOfTypeChecker(typeChecker) {
        function validate(props, propName, componentName, location, propFullName) {
          if (typeof typeChecker !== 'function') {
            return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
          }
          var propValue = props[propName];
          if (!Array.isArray(propValue)) {
            var propType = getPropType(propValue);
            return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
          }
          for (var i = 0; i < propValue.length; i++) {
            var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret);
            if (error instanceof Error) {
              return error;
            }
          }
          return null;
        }
        return createChainableTypeChecker(validate);
      }

      function createElementTypeChecker() {
        function validate(props, propName, componentName, location, propFullName) {
          var propValue = props[propName];
          if (!isValidElement(propValue)) {
            var propType = getPropType(propValue);
            return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
          }
          return null;
        }
        return createChainableTypeChecker(validate);
      }

      function createElementTypeTypeChecker() {
        function validate(props, propName, componentName, location, propFullName) {
          var propValue = props[propName];
          if (!ReactIs$1.isValidElementType(propValue)) {
            var propType = getPropType(propValue);
            return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement type.'));
          }
          return null;
        }
        return createChainableTypeChecker(validate);
      }

      function createInstanceTypeChecker(expectedClass) {
        function validate(props, propName, componentName, location, propFullName) {
          if (!(props[propName] instanceof expectedClass)) {
            var expectedClassName = expectedClass.name || ANONYMOUS;
            var actualClassName = getClassName(props[propName]);
            return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
          }
          return null;
        }
        return createChainableTypeChecker(validate);
      }

      function createEnumTypeChecker(expectedValues) {
        if (!Array.isArray(expectedValues)) {
          {
            if (arguments.length > 1) {
              printWarning(
                'Invalid arguments supplied to oneOf, expected an array, got ' + arguments.length + ' arguments. ' +
                'A common mistake is to write oneOf(x, y, z) instead of oneOf([x, y, z]).'
              );
            } else {
              printWarning('Invalid argument supplied to oneOf, expected an array.');
            }
          }
          return emptyFunctionThatReturnsNull;
        }

        function validate(props, propName, componentName, location, propFullName) {
          var propValue = props[propName];
          for (var i = 0; i < expectedValues.length; i++) {
            if (is(propValue, expectedValues[i])) {
              return null;
            }
          }

          var valuesString = JSON.stringify(expectedValues, function replacer(key, value) {
            var type = getPreciseType(value);
            if (type === 'symbol') {
              return String(value);
            }
            return value;
          });
          return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of value `' + String(propValue) + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
        }
        return createChainableTypeChecker(validate);
      }

      function createObjectOfTypeChecker(typeChecker) {
        function validate(props, propName, componentName, location, propFullName) {
          if (typeof typeChecker !== 'function') {
            return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
          }
          var propValue = props[propName];
          var propType = getPropType(propValue);
          if (propType !== 'object') {
            return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
          }
          for (var key in propValue) {
            if (has(propValue, key)) {
              var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
              if (error instanceof Error) {
                return error;
              }
            }
          }
          return null;
        }
        return createChainableTypeChecker(validate);
      }

      function createUnionTypeChecker(arrayOfTypeCheckers) {
        if (!Array.isArray(arrayOfTypeCheckers)) {
          printWarning('Invalid argument supplied to oneOfType, expected an instance of array.') ;
          return emptyFunctionThatReturnsNull;
        }

        for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
          var checker = arrayOfTypeCheckers[i];
          if (typeof checker !== 'function') {
            printWarning(
              'Invalid argument supplied to oneOfType. Expected an array of check functions, but ' +
              'received ' + getPostfixForTypeWarning(checker) + ' at index ' + i + '.'
            );
            return emptyFunctionThatReturnsNull;
          }
        }

        function validate(props, propName, componentName, location, propFullName) {
          for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
            var checker = arrayOfTypeCheckers[i];
            if (checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret) == null) {
              return null;
            }
          }

          return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`.'));
        }
        return createChainableTypeChecker(validate);
      }

      function createNodeChecker() {
        function validate(props, propName, componentName, location, propFullName) {
          if (!isNode(props[propName])) {
            return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
          }
          return null;
        }
        return createChainableTypeChecker(validate);
      }

      function createShapeTypeChecker(shapeTypes) {
        function validate(props, propName, componentName, location, propFullName) {
          var propValue = props[propName];
          var propType = getPropType(propValue);
          if (propType !== 'object') {
            return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
          }
          for (var key in shapeTypes) {
            var checker = shapeTypes[key];
            if (!checker) {
              continue;
            }
            var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
            if (error) {
              return error;
            }
          }
          return null;
        }
        return createChainableTypeChecker(validate);
      }

      function createStrictShapeTypeChecker(shapeTypes) {
        function validate(props, propName, componentName, location, propFullName) {
          var propValue = props[propName];
          var propType = getPropType(propValue);
          if (propType !== 'object') {
            return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
          }
          // We need to check all keys in case some are required but missing from
          // props.
          var allKeys = assign({}, props[propName], shapeTypes);
          for (var key in allKeys) {
            var checker = shapeTypes[key];
            if (!checker) {
              return new PropTypeError(
                'Invalid ' + location + ' `' + propFullName + '` key `' + key + '` supplied to `' + componentName + '`.' +
                '\nBad object: ' + JSON.stringify(props[propName], null, '  ') +
                '\nValid keys: ' +  JSON.stringify(Object.keys(shapeTypes), null, '  ')
              );
            }
            var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
            if (error) {
              return error;
            }
          }
          return null;
        }

        return createChainableTypeChecker(validate);
      }

      function isNode(propValue) {
        switch (typeof propValue) {
          case 'number':
          case 'string':
          case 'undefined':
            return true;
          case 'boolean':
            return !propValue;
          case 'object':
            if (Array.isArray(propValue)) {
              return propValue.every(isNode);
            }
            if (propValue === null || isValidElement(propValue)) {
              return true;
            }

            var iteratorFn = getIteratorFn(propValue);
            if (iteratorFn) {
              var iterator = iteratorFn.call(propValue);
              var step;
              if (iteratorFn !== propValue.entries) {
                while (!(step = iterator.next()).done) {
                  if (!isNode(step.value)) {
                    return false;
                  }
                }
              } else {
                // Iterator will provide entry [k,v] tuples rather than values.
                while (!(step = iterator.next()).done) {
                  var entry = step.value;
                  if (entry) {
                    if (!isNode(entry[1])) {
                      return false;
                    }
                  }
                }
              }
            } else {
              return false;
            }

            return true;
          default:
            return false;
        }
      }

      function isSymbol(propType, propValue) {
        // Native Symbol.
        if (propType === 'symbol') {
          return true;
        }

        // falsy value can't be a Symbol
        if (!propValue) {
          return false;
        }

        // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
        if (propValue['@@toStringTag'] === 'Symbol') {
          return true;
        }

        // Fallback for non-spec compliant Symbols which are polyfilled.
        if (typeof Symbol === 'function' && propValue instanceof Symbol) {
          return true;
        }

        return false;
      }

      // Equivalent of `typeof` but with special handling for array and regexp.
      function getPropType(propValue) {
        var propType = typeof propValue;
        if (Array.isArray(propValue)) {
          return 'array';
        }
        if (propValue instanceof RegExp) {
          // Old webkits (at least until Android 4.0) return 'function' rather than
          // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
          // passes PropTypes.object.
          return 'object';
        }
        if (isSymbol(propType, propValue)) {
          return 'symbol';
        }
        return propType;
      }

      // This handles more types than `getPropType`. Only used for error messages.
      // See `createPrimitiveTypeChecker`.
      function getPreciseType(propValue) {
        if (typeof propValue === 'undefined' || propValue === null) {
          return '' + propValue;
        }
        var propType = getPropType(propValue);
        if (propType === 'object') {
          if (propValue instanceof Date) {
            return 'date';
          } else if (propValue instanceof RegExp) {
            return 'regexp';
          }
        }
        return propType;
      }

      // Returns a string that is postfixed to a warning about an invalid type.
      // For example, "undefined" or "of type array"
      function getPostfixForTypeWarning(value) {
        var type = getPreciseType(value);
        switch (type) {
          case 'array':
          case 'object':
            return 'an ' + type;
          case 'boolean':
          case 'date':
          case 'regexp':
            return 'a ' + type;
          default:
            return type;
        }
      }

      // Returns class name of the object, if any.
      function getClassName(propValue) {
        if (!propValue.constructor || !propValue.constructor.name) {
          return ANONYMOUS;
        }
        return propValue.constructor.name;
      }

      ReactPropTypes.checkPropTypes = checkPropTypes;
      ReactPropTypes.resetWarningCache = checkPropTypes.resetWarningCache;
      ReactPropTypes.PropTypes = ReactPropTypes;

      return ReactPropTypes;
    };

    /**
     * Copyright (c) 2013-present, Facebook, Inc.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */

    {
      var ReactIs = reactIs.exports;

      // By explicitly using `prop-types` you are opting into new development behavior.
      // http://fb.me/prop-types-in-prod
      var throwOnDirectAccess = true;
      propTypes.exports = factoryWithTypeCheckers(ReactIs.isElement, throwOnDirectAccess);
    }

    var PropTypes = propTypes.exports;

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    }

    /** @deprecated */
    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }

    var COMMON_MIME_TYPES = new Map([
        ['avi', 'video/avi'],
        ['gif', 'image/gif'],
        ['ico', 'image/x-icon'],
        ['jpeg', 'image/jpeg'],
        ['jpg', 'image/jpeg'],
        ['mkv', 'video/x-matroska'],
        ['mov', 'video/quicktime'],
        ['mp4', 'video/mp4'],
        ['pdf', 'application/pdf'],
        ['png', 'image/png'],
        ['zip', 'application/zip'],
        ['doc', 'application/msword'],
        ['docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    ]);
    function toFileWithPath(file, path) {
        var f = withMimeType(file);
        if (typeof f.path !== 'string') { // on electron, path is already set to the absolute path
            var webkitRelativePath = file.webkitRelativePath;
            Object.defineProperty(f, 'path', {
                value: typeof path === 'string'
                    ? path
                    // If <input webkitdirectory> is set,
                    // the File will have a {webkitRelativePath} property
                    // https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/webkitdirectory
                    : typeof webkitRelativePath === 'string' && webkitRelativePath.length > 0
                        ? webkitRelativePath
                        : file.name,
                writable: false,
                configurable: false,
                enumerable: true
            });
        }
        return f;
    }
    function withMimeType(file) {
        var name = file.name;
        var hasExtension = name && name.lastIndexOf('.') !== -1;
        if (hasExtension && !file.type) {
            var ext = name.split('.')
                .pop().toLowerCase();
            var type = COMMON_MIME_TYPES.get(ext);
            if (type) {
                Object.defineProperty(file, 'type', {
                    value: type,
                    writable: false,
                    configurable: false,
                    enumerable: true
                });
            }
        }
        return file;
    }

    var FILES_TO_IGNORE = [
        // Thumbnail cache files for macOS and Windows
        '.DS_Store',
        'Thumbs.db' // Windows
    ];
    /**
     * Convert a DragEvent's DataTrasfer object to a list of File objects
     * NOTE: If some of the items are folders,
     * everything will be flattened and placed in the same list but the paths will be kept as a {path} property.
     * @param evt
     */
    function fromEvent(evt) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, isDragEvt(evt) && evt.dataTransfer
                        ? getDataTransferFiles(evt.dataTransfer, evt.type)
                        : getInputFiles(evt)];
            });
        });
    }
    function isDragEvt(value) {
        return !!value.dataTransfer;
    }
    function getInputFiles(evt) {
        var files = isInput(evt.target)
            ? evt.target.files
                ? fromList(evt.target.files)
                : []
            : [];
        return files.map(function (file) { return toFileWithPath(file); });
    }
    function isInput(value) {
        return value !== null;
    }
    function getDataTransferFiles(dt, type) {
        return __awaiter(this, void 0, void 0, function () {
            var items, files;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!dt.items) return [3 /*break*/, 2];
                        items = fromList(dt.items)
                            .filter(function (item) { return item.kind === 'file'; });
                        // According to https://html.spec.whatwg.org/multipage/dnd.html#dndevents,
                        // only 'dragstart' and 'drop' has access to the data (source node)
                        if (type !== 'drop') {
                            return [2 /*return*/, items];
                        }
                        return [4 /*yield*/, Promise.all(items.map(toFilePromises))];
                    case 1:
                        files = _a.sent();
                        return [2 /*return*/, noIgnoredFiles(flatten(files))];
                    case 2: return [2 /*return*/, noIgnoredFiles(fromList(dt.files)
                            .map(function (file) { return toFileWithPath(file); }))];
                }
            });
        });
    }
    function noIgnoredFiles(files) {
        return files.filter(function (file) { return FILES_TO_IGNORE.indexOf(file.name) === -1; });
    }
    // IE11 does not support Array.from()
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from#Browser_compatibility
    // https://developer.mozilla.org/en-US/docs/Web/API/FileList
    // https://developer.mozilla.org/en-US/docs/Web/API/DataTransferItemList
    function fromList(items) {
        var files = [];
        // tslint:disable: prefer-for-of
        for (var i = 0; i < items.length; i++) {
            var file = items[i];
            files.push(file);
        }
        return files;
    }
    // https://developer.mozilla.org/en-US/docs/Web/API/DataTransferItem
    function toFilePromises(item) {
        if (typeof item.webkitGetAsEntry !== 'function') {
            return fromDataTransferItem(item);
        }
        var entry = item.webkitGetAsEntry();
        // Safari supports dropping an image node from a different window and can be retrieved using
        // the DataTransferItem.getAsFile() API
        // NOTE: FileSystemEntry.file() throws if trying to get the file
        if (entry && entry.isDirectory) {
            return fromDirEntry(entry);
        }
        return fromDataTransferItem(item);
    }
    function flatten(items) {
        return items.reduce(function (acc, files) { return __spread(acc, (Array.isArray(files) ? flatten(files) : [files])); }, []);
    }
    function fromDataTransferItem(item) {
        var file = item.getAsFile();
        if (!file) {
            return Promise.reject(item + " is not a File");
        }
        var fwp = toFileWithPath(file);
        return Promise.resolve(fwp);
    }
    // https://developer.mozilla.org/en-US/docs/Web/API/FileSystemEntry
    function fromEntry(entry) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, entry.isDirectory ? fromDirEntry(entry) : fromFileEntry(entry)];
            });
        });
    }
    // https://developer.mozilla.org/en-US/docs/Web/API/FileSystemDirectoryEntry
    function fromDirEntry(entry) {
        var reader = entry.createReader();
        return new Promise(function (resolve, reject) {
            var entries = [];
            function readEntries() {
                var _this = this;
                // https://developer.mozilla.org/en-US/docs/Web/API/FileSystemDirectoryEntry/createReader
                // https://developer.mozilla.org/en-US/docs/Web/API/FileSystemDirectoryReader/readEntries
                reader.readEntries(function (batch) { return __awaiter(_this, void 0, void 0, function () {
                    var files, err_1, items;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!!batch.length) return [3 /*break*/, 5];
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                return [4 /*yield*/, Promise.all(entries)];
                            case 2:
                                files = _a.sent();
                                resolve(files);
                                return [3 /*break*/, 4];
                            case 3:
                                err_1 = _a.sent();
                                reject(err_1);
                                return [3 /*break*/, 4];
                            case 4: return [3 /*break*/, 6];
                            case 5:
                                items = Promise.all(batch.map(fromEntry));
                                entries.push(items);
                                // Continue reading
                                readEntries();
                                _a.label = 6;
                            case 6: return [2 /*return*/];
                        }
                    });
                }); }, function (err) {
                    reject(err);
                });
            }
            readEntries();
        });
    }
    // https://developer.mozilla.org/en-US/docs/Web/API/FileSystemFileEntry
    function fromFileEntry(entry) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        entry.file(function (file) {
                            var fwp = toFileWithPath(file, entry.fullPath);
                            resolve(fwp);
                        }, function (err) {
                            reject(err);
                        });
                    })];
            });
        });
    }

    var _default = function (file, acceptedFiles) {
      if (file && acceptedFiles) {
        var acceptedFilesArray = Array.isArray(acceptedFiles) ? acceptedFiles : acceptedFiles.split(',');
        var fileName = file.name || '';
        var mimeType = (file.type || '').toLowerCase();
        var baseMimeType = mimeType.replace(/\/.*$/, '');
        return acceptedFilesArray.some(function (type) {
          var validType = type.trim().toLowerCase();

          if (validType.charAt(0) === '.') {
            return fileName.toLowerCase().endsWith(validType);
          } else if (validType.endsWith('/*')) {
            // This is something like a image/* mime type
            return baseMimeType === validType.replace(/\/.*$/, '');
          }

          return mimeType === validType;
        });
      }

      return true;
    };

    function _slicedToArray$1(arr, i) { return _arrayWithHoles$1(arr) || _iterableToArrayLimit$1(arr, i) || _unsupportedIterableToArray$1(arr, i) || _nonIterableRest$1(); }

    function _nonIterableRest$1() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

    function _unsupportedIterableToArray$1(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$1(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$1(o, minLen); }

    function _arrayLikeToArray$1(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

    function _iterableToArrayLimit$1(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

    function _arrayWithHoles$1(arr) { if (Array.isArray(arr)) return arr; }

    var FILE_INVALID_TYPE = 'file-invalid-type';
    var FILE_TOO_LARGE = 'file-too-large';
    var FILE_TOO_SMALL = 'file-too-small';
    var TOO_MANY_FILES = 'too-many-files';

    var getInvalidTypeRejectionErr = function getInvalidTypeRejectionErr(accept) {
      accept = Array.isArray(accept) && accept.length === 1 ? accept[0] : accept;
      var messageSuffix = Array.isArray(accept) ? "one of ".concat(accept.join(', ')) : accept;
      return {
        code: FILE_INVALID_TYPE,
        message: "File type must be ".concat(messageSuffix)
      };
    };
    var getTooLargeRejectionErr = function getTooLargeRejectionErr(maxSize) {
      return {
        code: FILE_TOO_LARGE,
        message: "File is larger than ".concat(maxSize, " bytes")
      };
    };
    var getTooSmallRejectionErr = function getTooSmallRejectionErr(minSize) {
      return {
        code: FILE_TOO_SMALL,
        message: "File is smaller than ".concat(minSize, " bytes")
      };
    };
    var TOO_MANY_FILES_REJECTION = {
      code: TOO_MANY_FILES,
      message: 'Too many files'
    }; // Firefox versions prior to 53 return a bogus MIME type for every file drag, so dragovers with
    // that MIME type will always be accepted

    function fileAccepted(file, accept) {
      var isAcceptable = file.type === 'application/x-moz-file' || _default(file, accept);
      return [isAcceptable, isAcceptable ? null : getInvalidTypeRejectionErr(accept)];
    }
    function fileMatchSize(file, minSize, maxSize) {
      if (isDefined(file.size)) {
        if (isDefined(minSize) && isDefined(maxSize)) {
          if (file.size > maxSize) return [false, getTooLargeRejectionErr(maxSize)];
          if (file.size < minSize) return [false, getTooSmallRejectionErr(minSize)];
        } else if (isDefined(minSize) && file.size < minSize) return [false, getTooSmallRejectionErr(minSize)];else if (isDefined(maxSize) && file.size > maxSize) return [false, getTooLargeRejectionErr(maxSize)];
      }

      return [true, null];
    }

    function isDefined(value) {
      return value !== undefined && value !== null;
    }

    function allFilesAccepted(_ref) {
      var files = _ref.files,
          accept = _ref.accept,
          minSize = _ref.minSize,
          maxSize = _ref.maxSize,
          multiple = _ref.multiple,
          maxFiles = _ref.maxFiles;

      if (!multiple && files.length > 1 || multiple && maxFiles >= 1 && files.length > maxFiles) {
        return false;
      }

      return files.every(function (file) {
        var _fileAccepted = fileAccepted(file, accept),
            _fileAccepted2 = _slicedToArray$1(_fileAccepted, 1),
            accepted = _fileAccepted2[0];

        var _fileMatchSize = fileMatchSize(file, minSize, maxSize),
            _fileMatchSize2 = _slicedToArray$1(_fileMatchSize, 1),
            sizeMatch = _fileMatchSize2[0];

        return accepted && sizeMatch;
      });
    } // React's synthetic events has event.isPropagationStopped,
    // but to remain compatibility with other libs (Preact) fall back
    // to check event.cancelBubble

    function isPropagationStopped(event) {
      if (typeof event.isPropagationStopped === 'function') {
        return event.isPropagationStopped();
      } else if (typeof event.cancelBubble !== 'undefined') {
        return event.cancelBubble;
      }

      return false;
    }
    function isEvtWithFiles(event) {
      if (!event.dataTransfer) {
        return !!event.target && !!event.target.files;
      } // https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/types
      // https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Recommended_drag_types#file


      return Array.prototype.some.call(event.dataTransfer.types, function (type) {
        return type === 'Files' || type === 'application/x-moz-file';
      });
    }

    function onDocumentDragOver(event) {
      event.preventDefault();
    }

    function isIe(userAgent) {
      return userAgent.indexOf('MSIE') !== -1 || userAgent.indexOf('Trident/') !== -1;
    }

    function isEdge(userAgent) {
      return userAgent.indexOf('Edge/') !== -1;
    }

    function isIeOrEdge() {
      var userAgent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window.navigator.userAgent;
      return isIe(userAgent) || isEdge(userAgent);
    }
    /**
     * This is intended to be used to compose event handlers
     * They are executed in order until one of them calls `event.isPropagationStopped()`.
     * Note that the check is done on the first invoke too,
     * meaning that if propagation was stopped before invoking the fns,
     * no handlers will be executed.
     *
     * @param {Function} fns the event hanlder functions
     * @return {Function} the event handler to add to an element
     */

    function composeEventHandlers() {
      for (var _len = arguments.length, fns = new Array(_len), _key = 0; _key < _len; _key++) {
        fns[_key] = arguments[_key];
      }

      return function (event) {
        for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
          args[_key2 - 1] = arguments[_key2];
        }

        return fns.some(function (fn) {
          if (!isPropagationStopped(event) && fn) {
            fn.apply(void 0, [event].concat(args));
          }

          return isPropagationStopped(event);
        });
      };
    }

    var _excluded = ["children"],
        _excluded2 = ["open"],
        _excluded3 = ["refKey", "onKeyDown", "onFocus", "onBlur", "onClick", "onDragEnter", "onDragOver", "onDragLeave", "onDrop"],
        _excluded4 = ["refKey", "onChange", "onClick"];

    function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

    function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

    function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

    function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

    function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

    function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

    function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

    function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

    function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

    function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

    function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

    function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

    function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

    function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

    function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
    /**
     * Convenience wrapper component for the `useDropzone` hook
     *
     * ```jsx
     * <Dropzone>
     *   {({getRootProps, getInputProps}) => (
     *     <div {...getRootProps()}>
     *       <input {...getInputProps()} />
     *       <p>Drag 'n' drop some files here, or click to select files</p>
     *     </div>
     *   )}
     * </Dropzone>
     * ```
     */

    var Dropzone = /*#__PURE__*/react.exports.forwardRef(function (_ref, ref) {
      var children = _ref.children,
          params = _objectWithoutProperties(_ref, _excluded);

      var _useDropzone = useDropzone(params),
          open = _useDropzone.open,
          props = _objectWithoutProperties(_useDropzone, _excluded2);

      react.exports.useImperativeHandle(ref, function () {
        return {
          open: open
        };
      }, [open]); // TODO: Figure out why react-styleguidist cannot create docs if we don't return a jsx element

      return /*#__PURE__*/React$1.createElement(react.exports.Fragment, null, children(_objectSpread(_objectSpread({}, props), {}, {
        open: open
      })));
    });
    Dropzone.displayName = 'Dropzone'; // Add default props for react-docgen

    var defaultProps = {
      disabled: false,
      getFilesFromEvent: fromEvent,
      maxSize: Infinity,
      minSize: 0,
      multiple: true,
      maxFiles: 0,
      preventDropOnDocument: true,
      noClick: false,
      noKeyboard: false,
      noDrag: false,
      noDragEventsBubbling: false,
      validator: null
    };
    Dropzone.defaultProps = defaultProps;
    Dropzone.propTypes = {
      /**
       * Render function that exposes the dropzone state and prop getter fns
       *
       * @param {object} params
       * @param {Function} params.getRootProps Returns the props you should apply to the root drop container you render
       * @param {Function} params.getInputProps Returns the props you should apply to hidden file input you render
       * @param {Function} params.open Open the native file selection dialog
       * @param {boolean} params.isFocused Dropzone area is in focus
       * @param {boolean} params.isFileDialogActive File dialog is opened
       * @param {boolean} params.isDragActive Active drag is in progress
       * @param {boolean} params.isDragAccept Dragged files are accepted
       * @param {boolean} params.isDragReject Some dragged files are rejected
       * @param {File[]} params.draggedFiles Files in active drag
       * @param {File[]} params.acceptedFiles Accepted files
       * @param {FileRejection[]} params.fileRejections Rejected files and why they were rejected
       */
      children: PropTypes.func,

      /**
       * Set accepted file types.
       * See https://github.com/okonet/attr-accept for more information.
       * Keep in mind that mime type determination is not reliable across platforms. CSV files,
       * for example, are reported as text/plain under macOS but as application/vnd.ms-excel under
       * Windows. In some cases there might not be a mime type set at all.
       * See: https://github.com/react-dropzone/react-dropzone/issues/276
       */
      accept: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),

      /**
       * Allow drag 'n' drop (or selection from the file dialog) of multiple files
       */
      multiple: PropTypes.bool,

      /**
       * If false, allow dropped items to take over the current browser window
       */
      preventDropOnDocument: PropTypes.bool,

      /**
       * If true, disables click to open the native file selection dialog
       */
      noClick: PropTypes.bool,

      /**
       * If true, disables SPACE/ENTER to open the native file selection dialog.
       * Note that it also stops tracking the focus state.
       */
      noKeyboard: PropTypes.bool,

      /**
       * If true, disables drag 'n' drop
       */
      noDrag: PropTypes.bool,

      /**
       * If true, stops drag event propagation to parents
       */
      noDragEventsBubbling: PropTypes.bool,

      /**
       * Minimum file size (in bytes)
       */
      minSize: PropTypes.number,

      /**
       * Maximum file size (in bytes)
       */
      maxSize: PropTypes.number,

      /**
       * Maximum accepted number of files
       * The default value is 0 which means there is no limitation to how many files are accepted.
       */
      maxFiles: PropTypes.number,

      /**
       * Enable/disable the dropzone
       */
      disabled: PropTypes.bool,

      /**
       * Use this to provide a custom file aggregator
       *
       * @param {(DragEvent|Event)} event A drag event or input change event (if files were selected via the file dialog)
       */
      getFilesFromEvent: PropTypes.func,

      /**
       * Cb for when closing the file dialog with no selection
       */
      onFileDialogCancel: PropTypes.func,

      /**
       * Cb for when the `dragenter` event occurs.
       *
       * @param {DragEvent} event
       */
      onDragEnter: PropTypes.func,

      /**
       * Cb for when the `dragleave` event occurs
       *
       * @param {DragEvent} event
       */
      onDragLeave: PropTypes.func,

      /**
       * Cb for when the `dragover` event occurs
       *
       * @param {DragEvent} event
       */
      onDragOver: PropTypes.func,

      /**
       * Cb for when the `drop` event occurs.
       * Note that this callback is invoked after the `getFilesFromEvent` callback is done.
       *
       * Files are accepted or rejected based on the `accept`, `multiple`, `minSize` and `maxSize` props.
       * `accept` must be a valid [MIME type](http://www.iana.org/assignments/media-types/media-types.xhtml) according to [input element specification](https://www.w3.org/wiki/HTML/Elements/input/file) or a valid file extension.
       * If `multiple` is set to false and additional files are dropped,
       * all files besides the first will be rejected.
       * Any file which does not have a size in the [`minSize`, `maxSize`] range, will be rejected as well.
       *
       * Note that the `onDrop` callback will always be invoked regardless if the dropped files were accepted or rejected.
       * If you'd like to react to a specific scenario, use the `onDropAccepted`/`onDropRejected` props.
       *
       * `onDrop` will provide you with an array of [File](https://developer.mozilla.org/en-US/docs/Web/API/File) objects which you can then process and send to a server.
       * For example, with [SuperAgent](https://github.com/visionmedia/superagent) as a http/ajax library:
       *
       * ```js
       * function onDrop(acceptedFiles) {
       *   const req = request.post('/upload')
       *   acceptedFiles.forEach(file => {
       *     req.attach(file.name, file)
       *   })
       *   req.end(callback)
       * }
       * ```
       *
       * @param {File[]} acceptedFiles
       * @param {FileRejection[]} fileRejections
       * @param {(DragEvent|Event)} event A drag event or input change event (if files were selected via the file dialog)
       */
      onDrop: PropTypes.func,

      /**
       * Cb for when the `drop` event occurs.
       * Note that if no files are accepted, this callback is not invoked.
       *
       * @param {File[]} files
       * @param {(DragEvent|Event)} event
       */
      onDropAccepted: PropTypes.func,

      /**
       * Cb for when the `drop` event occurs.
       * Note that if no files are rejected, this callback is not invoked.
       *
       * @param {FileRejection[]} fileRejections
       * @param {(DragEvent|Event)} event
       */
      onDropRejected: PropTypes.func,

      /**
       * Custom validation function 
       * @param {File} file
       * @returns {FileError|FileError[]}
       */
      validator: PropTypes.func
    };
    /**
     * A function that is invoked for the `dragenter`,
     * `dragover` and `dragleave` events.
     * It is not invoked if the items are not files (such as link, text, etc.).
     *
     * @callback dragCb
     * @param {DragEvent} event
     */

    /**
     * A function that is invoked for the `drop` or input change event.
     * It is not invoked if the items are not files (such as link, text, etc.).
     *
     * @callback dropCb
     * @param {File[]} acceptedFiles List of accepted files
     * @param {FileRejection[]} fileRejections List of rejected files and why they were rejected
     * @param {(DragEvent|Event)} event A drag event or input change event (if files were selected via the file dialog)
     */

    /**
     * A function that is invoked for the `drop` or input change event.
     * It is not invoked if the items are files (such as link, text, etc.).
     *
     * @callback dropAcceptedCb
     * @param {File[]} files List of accepted files that meet the given criteria
     * (`accept`, `multiple`, `minSize`, `maxSize`)
     * @param {(DragEvent|Event)} event A drag event or input change event (if files were selected via the file dialog)
     */

    /**
     * A function that is invoked for the `drop` or input change event.
     *
     * @callback dropRejectedCb
     * @param {File[]} files List of rejected files that do not meet the given criteria
     * (`accept`, `multiple`, `minSize`, `maxSize`)
     * @param {(DragEvent|Event)} event A drag event or input change event (if files were selected via the file dialog)
     */

    /**
     * A function that is used aggregate files,
     * in a asynchronous fashion, from drag or input change events.
     *
     * @callback getFilesFromEvent
     * @param {(DragEvent|Event)} event A drag event or input change event (if files were selected via the file dialog)
     * @returns {(File[]|Promise<File[]>)}
     */

    /**
     * An object with the current dropzone state and some helper functions.
     *
     * @typedef {object} DropzoneState
     * @property {Function} getRootProps Returns the props you should apply to the root drop container you render
     * @property {Function} getInputProps Returns the props you should apply to hidden file input you render
     * @property {Function} open Open the native file selection dialog
     * @property {boolean} isFocused Dropzone area is in focus
     * @property {boolean} isFileDialogActive File dialog is opened
     * @property {boolean} isDragActive Active drag is in progress
     * @property {boolean} isDragAccept Dragged files are accepted
     * @property {boolean} isDragReject Some dragged files are rejected
     * @property {File[]} draggedFiles Files in active drag
     * @property {File[]} acceptedFiles Accepted files
     * @property {FileRejection[]} fileRejections Rejected files and why they were rejected
     */

    var initialState = {
      isFocused: false,
      isFileDialogActive: false,
      isDragActive: false,
      isDragAccept: false,
      isDragReject: false,
      draggedFiles: [],
      acceptedFiles: [],
      fileRejections: []
    };
    /**
     * A React hook that creates a drag 'n' drop area.
     *
     * ```jsx
     * function MyDropzone(props) {
     *   const {getRootProps, getInputProps} = useDropzone({
     *     onDrop: acceptedFiles => {
     *       // do something with the File objects, e.g. upload to some server
     *     }
     *   });
     *   return (
     *     <div {...getRootProps()}>
     *       <input {...getInputProps()} />
     *       <p>Drag and drop some files here, or click to select files</p>
     *     </div>
     *   )
     * }
     * ```
     *
     * @function useDropzone
     *
     * @param {object} props
     * @param {string|string[]} [props.accept] Set accepted file types.
     * See https://github.com/okonet/attr-accept for more information.
     * Keep in mind that mime type determination is not reliable across platforms. CSV files,
     * for example, are reported as text/plain under macOS but as application/vnd.ms-excel under
     * Windows. In some cases there might not be a mime type set at all.
     * See: https://github.com/react-dropzone/react-dropzone/issues/276
     * @param {boolean} [props.multiple=true] Allow drag 'n' drop (or selection from the file dialog) of multiple files
     * @param {boolean} [props.preventDropOnDocument=true] If false, allow dropped items to take over the current browser window
     * @param {boolean} [props.noClick=false] If true, disables click to open the native file selection dialog
     * @param {boolean} [props.noKeyboard=false] If true, disables SPACE/ENTER to open the native file selection dialog.
     * Note that it also stops tracking the focus state.
     * @param {boolean} [props.noDrag=false] If true, disables drag 'n' drop
     * @param {boolean} [props.noDragEventsBubbling=false] If true, stops drag event propagation to parents
     * @param {number} [props.minSize=0] Minimum file size (in bytes)
     * @param {number} [props.maxSize=Infinity] Maximum file size (in bytes)
     * @param {boolean} [props.disabled=false] Enable/disable the dropzone
     * @param {getFilesFromEvent} [props.getFilesFromEvent] Use this to provide a custom file aggregator
     * @param {Function} [props.onFileDialogCancel] Cb for when closing the file dialog with no selection
     * @param {dragCb} [props.onDragEnter] Cb for when the `dragenter` event occurs.
     * @param {dragCb} [props.onDragLeave] Cb for when the `dragleave` event occurs
     * @param {dragCb} [props.onDragOver] Cb for when the `dragover` event occurs
     * @param {dropCb} [props.onDrop] Cb for when the `drop` event occurs.
     * Note that this callback is invoked after the `getFilesFromEvent` callback is done.
     *
     * Files are accepted or rejected based on the `accept`, `multiple`, `minSize` and `maxSize` props.
     * `accept` must be a valid [MIME type](http://www.iana.org/assignments/media-types/media-types.xhtml) according to [input element specification](https://www.w3.org/wiki/HTML/Elements/input/file) or a valid file extension.
     * If `multiple` is set to false and additional files are dropped,
     * all files besides the first will be rejected.
     * Any file which does not have a size in the [`minSize`, `maxSize`] range, will be rejected as well.
     *
     * Note that the `onDrop` callback will always be invoked regardless if the dropped files were accepted or rejected.
     * If you'd like to react to a specific scenario, use the `onDropAccepted`/`onDropRejected` props.
     *
     * `onDrop` will provide you with an array of [File](https://developer.mozilla.org/en-US/docs/Web/API/File) objects which you can then process and send to a server.
     * For example, with [SuperAgent](https://github.com/visionmedia/superagent) as a http/ajax library:
     *
     * ```js
     * function onDrop(acceptedFiles) {
     *   const req = request.post('/upload')
     *   acceptedFiles.forEach(file => {
     *     req.attach(file.name, file)
     *   })
     *   req.end(callback)
     * }
     * ```
     * @param {dropAcceptedCb} [props.onDropAccepted]
     * @param {dropRejectedCb} [props.onDropRejected]
     *
     * @returns {DropzoneState}
     */

    function useDropzone() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var _defaultProps$options = _objectSpread(_objectSpread({}, defaultProps), options),
          accept = _defaultProps$options.accept,
          disabled = _defaultProps$options.disabled,
          getFilesFromEvent = _defaultProps$options.getFilesFromEvent,
          maxSize = _defaultProps$options.maxSize,
          minSize = _defaultProps$options.minSize,
          multiple = _defaultProps$options.multiple,
          maxFiles = _defaultProps$options.maxFiles,
          onDragEnter = _defaultProps$options.onDragEnter,
          onDragLeave = _defaultProps$options.onDragLeave,
          onDragOver = _defaultProps$options.onDragOver,
          onDrop = _defaultProps$options.onDrop,
          onDropAccepted = _defaultProps$options.onDropAccepted,
          onDropRejected = _defaultProps$options.onDropRejected,
          onFileDialogCancel = _defaultProps$options.onFileDialogCancel,
          preventDropOnDocument = _defaultProps$options.preventDropOnDocument,
          noClick = _defaultProps$options.noClick,
          noKeyboard = _defaultProps$options.noKeyboard,
          noDrag = _defaultProps$options.noDrag,
          noDragEventsBubbling = _defaultProps$options.noDragEventsBubbling,
          validator = _defaultProps$options.validator;

      var rootRef = react.exports.useRef(null);
      var inputRef = react.exports.useRef(null);

      var _useReducer = react.exports.useReducer(reducer, initialState),
          _useReducer2 = _slicedToArray(_useReducer, 2),
          state = _useReducer2[0],
          dispatch = _useReducer2[1];

      var isFocused = state.isFocused,
          isFileDialogActive = state.isFileDialogActive,
          draggedFiles = state.draggedFiles; // Fn for opening the file dialog programmatically

      var openFileDialog = react.exports.useCallback(function () {
        if (inputRef.current) {
          dispatch({
            type: 'openDialog'
          });
          inputRef.current.value = null;
          inputRef.current.click();
        }
      }, [dispatch]); // Update file dialog active state when the window is focused on

      var onWindowFocus = function onWindowFocus() {
        // Execute the timeout only if the file dialog is opened in the browser
        if (isFileDialogActive) {
          setTimeout(function () {
            if (inputRef.current) {
              var files = inputRef.current.files;

              if (!files.length) {
                dispatch({
                  type: 'closeDialog'
                });

                if (typeof onFileDialogCancel === 'function') {
                  onFileDialogCancel();
                }
              }
            }
          }, 300);
        }
      };

      react.exports.useEffect(function () {
        window.addEventListener('focus', onWindowFocus, false);
        return function () {
          window.removeEventListener('focus', onWindowFocus, false);
        };
      }, [inputRef, isFileDialogActive, onFileDialogCancel]); // Cb to open the file dialog when SPACE/ENTER occurs on the dropzone

      var onKeyDownCb = react.exports.useCallback(function (event) {
        // Ignore keyboard events bubbling up the DOM tree
        if (!rootRef.current || !rootRef.current.isEqualNode(event.target)) {
          return;
        }

        if (event.keyCode === 32 || event.keyCode === 13) {
          event.preventDefault();
          openFileDialog();
        }
      }, [rootRef, inputRef]); // Update focus state for the dropzone

      var onFocusCb = react.exports.useCallback(function () {
        dispatch({
          type: 'focus'
        });
      }, []);
      var onBlurCb = react.exports.useCallback(function () {
        dispatch({
          type: 'blur'
        });
      }, []); // Cb to open the file dialog when click occurs on the dropzone

      var onClickCb = react.exports.useCallback(function () {
        if (noClick) {
          return;
        } // In IE11/Edge the file-browser dialog is blocking, therefore, use setTimeout()
        // to ensure React can handle state changes
        // See: https://github.com/react-dropzone/react-dropzone/issues/450


        if (isIeOrEdge()) {
          setTimeout(openFileDialog, 0);
        } else {
          openFileDialog();
        }
      }, [inputRef, noClick]);
      var dragTargetsRef = react.exports.useRef([]);

      var onDocumentDrop = function onDocumentDrop(event) {
        if (rootRef.current && rootRef.current.contains(event.target)) {
          // If we intercepted an event for our instance, let it propagate down to the instance's onDrop handler
          return;
        }

        event.preventDefault();
        dragTargetsRef.current = [];
      };

      react.exports.useEffect(function () {
        if (preventDropOnDocument) {
          document.addEventListener('dragover', onDocumentDragOver, false);
          document.addEventListener('drop', onDocumentDrop, false);
        }

        return function () {
          if (preventDropOnDocument) {
            document.removeEventListener('dragover', onDocumentDragOver);
            document.removeEventListener('drop', onDocumentDrop);
          }
        };
      }, [rootRef, preventDropOnDocument]);
      var onDragEnterCb = react.exports.useCallback(function (event) {
        event.preventDefault(); // Persist here because we need the event later after getFilesFromEvent() is done

        event.persist();
        stopPropagation(event);
        dragTargetsRef.current = [].concat(_toConsumableArray(dragTargetsRef.current), [event.target]);

        if (isEvtWithFiles(event)) {
          Promise.resolve(getFilesFromEvent(event)).then(function (draggedFiles) {
            if (isPropagationStopped(event) && !noDragEventsBubbling) {
              return;
            }

            dispatch({
              draggedFiles: draggedFiles,
              isDragActive: true,
              type: 'setDraggedFiles'
            });

            if (onDragEnter) {
              onDragEnter(event);
            }
          });
        }
      }, [getFilesFromEvent, onDragEnter, noDragEventsBubbling]);
      var onDragOverCb = react.exports.useCallback(function (event) {
        event.preventDefault();
        event.persist();
        stopPropagation(event);
        var hasFiles = isEvtWithFiles(event);

        if (hasFiles && event.dataTransfer) {
          try {
            event.dataTransfer.dropEffect = 'copy';
          } catch (_unused) {}
          /* eslint-disable-line no-empty */

        }

        if (hasFiles && onDragOver) {
          onDragOver(event);
        }

        return false;
      }, [onDragOver, noDragEventsBubbling]);
      var onDragLeaveCb = react.exports.useCallback(function (event) {
        event.preventDefault();
        event.persist();
        stopPropagation(event); // Only deactivate once the dropzone and all children have been left

        var targets = dragTargetsRef.current.filter(function (target) {
          return rootRef.current && rootRef.current.contains(target);
        }); // Make sure to remove a target present multiple times only once
        // (Firefox may fire dragenter/dragleave multiple times on the same element)

        var targetIdx = targets.indexOf(event.target);

        if (targetIdx !== -1) {
          targets.splice(targetIdx, 1);
        }

        dragTargetsRef.current = targets;

        if (targets.length > 0) {
          return;
        }

        dispatch({
          isDragActive: false,
          type: 'setDraggedFiles',
          draggedFiles: []
        });

        if (isEvtWithFiles(event) && onDragLeave) {
          onDragLeave(event);
        }
      }, [rootRef, onDragLeave, noDragEventsBubbling]);
      var onDropCb = react.exports.useCallback(function (event) {
        event.preventDefault(); // Persist here because we need the event later after getFilesFromEvent() is done

        event.persist();
        stopPropagation(event);
        dragTargetsRef.current = [];

        if (isEvtWithFiles(event)) {
          Promise.resolve(getFilesFromEvent(event)).then(function (files) {
            if (isPropagationStopped(event) && !noDragEventsBubbling) {
              return;
            }

            var acceptedFiles = [];
            var fileRejections = [];
            files.forEach(function (file) {
              var _fileAccepted = fileAccepted(file, accept),
                  _fileAccepted2 = _slicedToArray(_fileAccepted, 2),
                  accepted = _fileAccepted2[0],
                  acceptError = _fileAccepted2[1];

              var _fileMatchSize = fileMatchSize(file, minSize, maxSize),
                  _fileMatchSize2 = _slicedToArray(_fileMatchSize, 2),
                  sizeMatch = _fileMatchSize2[0],
                  sizeError = _fileMatchSize2[1];

              var customErrors = validator ? validator(file) : null;

              if (accepted && sizeMatch && !customErrors) {
                acceptedFiles.push(file);
              } else {
                var errors = [acceptError, sizeError];

                if (customErrors) {
                  errors = errors.concat(customErrors);
                }

                fileRejections.push({
                  file: file,
                  errors: errors.filter(function (e) {
                    return e;
                  })
                });
              }
            });

            if (!multiple && acceptedFiles.length > 1 || multiple && maxFiles >= 1 && acceptedFiles.length > maxFiles) {
              // Reject everything and empty accepted files
              acceptedFiles.forEach(function (file) {
                fileRejections.push({
                  file: file,
                  errors: [TOO_MANY_FILES_REJECTION]
                });
              });
              acceptedFiles.splice(0);
            }

            dispatch({
              acceptedFiles: acceptedFiles,
              fileRejections: fileRejections,
              type: 'setFiles'
            });

            if (onDrop) {
              onDrop(acceptedFiles, fileRejections, event);
            }

            if (fileRejections.length > 0 && onDropRejected) {
              onDropRejected(fileRejections, event);
            }

            if (acceptedFiles.length > 0 && onDropAccepted) {
              onDropAccepted(acceptedFiles, event);
            }
          });
        }

        dispatch({
          type: 'reset'
        });
      }, [multiple, accept, minSize, maxSize, maxFiles, getFilesFromEvent, onDrop, onDropAccepted, onDropRejected, noDragEventsBubbling, validator]);

      var composeHandler = function composeHandler(fn) {
        return disabled ? null : fn;
      };

      var composeKeyboardHandler = function composeKeyboardHandler(fn) {
        return noKeyboard ? null : composeHandler(fn);
      };

      var composeDragHandler = function composeDragHandler(fn) {
        return noDrag ? null : composeHandler(fn);
      };

      var stopPropagation = function stopPropagation(event) {
        if (noDragEventsBubbling) {
          event.stopPropagation();
        }
      };

      var getRootProps = react.exports.useMemo(function () {
        return function () {
          var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
              _ref2$refKey = _ref2.refKey,
              refKey = _ref2$refKey === void 0 ? 'ref' : _ref2$refKey,
              onKeyDown = _ref2.onKeyDown,
              onFocus = _ref2.onFocus,
              onBlur = _ref2.onBlur,
              onClick = _ref2.onClick,
              onDragEnter = _ref2.onDragEnter,
              onDragOver = _ref2.onDragOver,
              onDragLeave = _ref2.onDragLeave,
              onDrop = _ref2.onDrop,
              rest = _objectWithoutProperties(_ref2, _excluded3);

          return _objectSpread(_objectSpread(_defineProperty({
            onKeyDown: composeKeyboardHandler(composeEventHandlers(onKeyDown, onKeyDownCb)),
            onFocus: composeKeyboardHandler(composeEventHandlers(onFocus, onFocusCb)),
            onBlur: composeKeyboardHandler(composeEventHandlers(onBlur, onBlurCb)),
            onClick: composeHandler(composeEventHandlers(onClick, onClickCb)),
            onDragEnter: composeDragHandler(composeEventHandlers(onDragEnter, onDragEnterCb)),
            onDragOver: composeDragHandler(composeEventHandlers(onDragOver, onDragOverCb)),
            onDragLeave: composeDragHandler(composeEventHandlers(onDragLeave, onDragLeaveCb)),
            onDrop: composeDragHandler(composeEventHandlers(onDrop, onDropCb))
          }, refKey, rootRef), !disabled && !noKeyboard ? {
            tabIndex: 0
          } : {}), rest);
        };
      }, [rootRef, onKeyDownCb, onFocusCb, onBlurCb, onClickCb, onDragEnterCb, onDragOverCb, onDragLeaveCb, onDropCb, noKeyboard, noDrag, disabled]);
      var onInputElementClick = react.exports.useCallback(function (event) {
        event.stopPropagation();
      }, []);
      var getInputProps = react.exports.useMemo(function () {
        return function () {
          var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
              _ref3$refKey = _ref3.refKey,
              refKey = _ref3$refKey === void 0 ? 'ref' : _ref3$refKey,
              onChange = _ref3.onChange,
              onClick = _ref3.onClick,
              rest = _objectWithoutProperties(_ref3, _excluded4);

          var inputProps = _defineProperty({
            accept: accept,
            multiple: multiple,
            type: 'file',
            style: {
              display: 'none'
            },
            onChange: composeHandler(composeEventHandlers(onChange, onDropCb)),
            onClick: composeHandler(composeEventHandlers(onClick, onInputElementClick)),
            autoComplete: 'off',
            tabIndex: -1
          }, refKey, inputRef);

          return _objectSpread(_objectSpread({}, inputProps), rest);
        };
      }, [inputRef, accept, multiple, onDropCb, disabled]);
      var fileCount = draggedFiles.length;
      var isDragAccept = fileCount > 0 && allFilesAccepted({
        files: draggedFiles,
        accept: accept,
        minSize: minSize,
        maxSize: maxSize,
        multiple: multiple,
        maxFiles: maxFiles
      });
      var isDragReject = fileCount > 0 && !isDragAccept;
      return _objectSpread(_objectSpread({}, state), {}, {
        isDragAccept: isDragAccept,
        isDragReject: isDragReject,
        isFocused: isFocused && !disabled,
        getRootProps: getRootProps,
        getInputProps: getInputProps,
        rootRef: rootRef,
        inputRef: inputRef,
        open: composeHandler(openFileDialog)
      });
    }

    function reducer(state, action) {
      /* istanbul ignore next */
      switch (action.type) {
        case 'focus':
          return _objectSpread(_objectSpread({}, state), {}, {
            isFocused: true
          });

        case 'blur':
          return _objectSpread(_objectSpread({}, state), {}, {
            isFocused: false
          });

        case 'openDialog':
          return _objectSpread(_objectSpread({}, state), {}, {
            isFileDialogActive: true
          });

        case 'closeDialog':
          return _objectSpread(_objectSpread({}, state), {}, {
            isFileDialogActive: false
          });

        case 'setDraggedFiles':
          /* eslint no-case-declarations: 0 */
          var isDragActive = action.isDragActive,
              draggedFiles = action.draggedFiles;
          return _objectSpread(_objectSpread({}, state), {}, {
            draggedFiles: draggedFiles,
            isDragActive: isDragActive
          });

        case 'setFiles':
          return _objectSpread(_objectSpread({}, state), {}, {
            acceptedFiles: action.acceptedFiles,
            fileRejections: action.fileRejections
          });

        case 'reset':
          return _objectSpread({}, initialState);

        default:
          return state;
      }
    }

    const { useCallback } = React;
    const e$4 = React.createElement;

    const MyDropzone = props => {
        const onDrop = useCallback( files => {
            console.log( files );

            files.forEach( file => {
                const reader = new FileReader();

                reader.onabort = () => console.log( 'file reading was aborted' );
                reader.onerror = () => console.log( 'file reading has failed' );
                reader.onload = () => {
                    const binaryStr = reader.result;
                    console.log( binaryStr );
                };
                reader.readAsArrayBuffer( file );
            });
        }, [] );

        const { getRootProps, getInputProps } = useDropzone({ onDrop });

        return e$4( 'div', { ...getRootProps() }, [
            e$4( 'input', { ...getInputProps() } )
            , e$4( 'p', {}, 'Drop Source Files Here' )
        ])
    };

    const e$3 = React.createElement;

    const Input = ( props ) => {
        const { name, label, type, value, onChange } = props;

        return e$3( 'div', { className: 'field' }, [
            e$3( 'label', { className: 'label' }, label )
            , e$3( 'div', { className: 'control' }, [
                e$3( 'input', { className: 'input', name, type, value, placeholder: label, onChange } )
            ])
        ])
    };

    const { useState } = React;
    const e$2 = React.createElement;

    const Form = () => {
        const [ formData, setFormData ] = useState( {} );
        const [ submitting, setSubmitting ] = useState( false );

        const onSubmit = event => {
            event.preventDefault();

            setSubmitting( true );
            console.log( formData );
        };

        const onChange = event => {
            const isCheckbox = event.target.type == 'checkbox';

            setFormData({
                ...formData
                , [event.target.name]: isCheckbox ? event.target.checked : event.target.value
            });
        };

        return e$2( 'form', { className: 'form', onSubmit }, [
            e$2( FileParser, { name: 'fileinput', label: 'Upload Source Information', formData, setFormData } )
            , e$2( MyDropzone, { formData, setFormData } )
            , e$2( 'p', { className: 'title is-3' }, 'General' )
            , e$2( 'div', { className: 'columns' }, [
                e$2( 'div', { className: 'column' }, [
                    e$2( Input, { name: 'crn', type: 'text', label: 'Case Number', value: (formData['crn'] || ''), onChange } )
                ])
                , e$2( 'div', { className: 'column' }, [
                    e$2( Input, { name: 'oa_crn', type: 'text', label: 'Other Agency Case Number', value: (formData['oa_crn'] || ''), onChange } )
                ])
                , e$2( 'div', { className: 'column' }, [
                    e$2( Input, { name: 'examiner', type: 'text', label: 'Examiner', value: (formData['examiner'] || ''), onChange } )
                ])
                , e$2( 'div', { className: 'column' }, [
                    e$2( Input, { name: 'reportdate', type: 'date', label: 'Date of Report', value: (formData['reportdate'] || ''), onChange } )
                ])
            ])
            , e$2( 'div', { className: 'columns' }, [
                e$2( 'div', { className: 'column is-3' }, [
                    e$2( Input, { name: 'capacity', type: 'number', label: 'Capacity', value: (formData['capacity'] || ''), onChange } )
                ])
                , e$2( 'div', { className: 'column is-3' }, [
                    e$2( 'label', { className: 'label' }, 'Capacity Unit' )
                    , e$2( 'div', { className: 'select', name: 'unit' }, e$2( 'select', {}, [
                        e$2( 'option', { value: 'mb' }, 'MB' )
                        , e$2( 'option', { value: 'gb' }, 'GB' )
                        , e$2( 'option', { value: 'tb' }, 'TB' )
                    ]) )
                ])
            ])
            , e$2( 'div', { className: 'columns' }, [
                e$2( 'div', { className: 'column is-3' }, [
                    e$2( Input, { name: 'auth_type', type: 'text', label: 'Authorization Type', value: (formData['auth_type'] || ''), onChange } )
                ])
                , e$2( 'div', { className: 'column is-3' }, [
                    e$2( Input, { name: 'auth_ref', type: 'text', label: 'Authorization Reference', value: (formData['auth_ref'] || ''), onChange } )
                ])
                , e$2( 'div', { className: 'column is-6' }, [
                    e$2( Input, { name: 'owner', type: 'text', label: 'Owner Name', value: (formData['owner'] || ''), onChange } )
                ])
            ])
            , e$2( 'p', { className: 'title is-3' }, 'Evidence' )
            , e$2( 'div', { className: 'columns' }, [
                e$2( 'div', { className: 'column is-3' }, [
                    e$2( Input, { name: 'evid_num', type: 'text', label: 'Evidence Number', value: (formData['evid_num'] || ''), onChange } )
                ])
                , e$2( 'div', { className: 'column is-3' }, [
                    e$2( Input, { name: 'evid_receivedate', type: 'date', label: 'Date Evidence Received', value: (formData['evid_receivedate'] || ''), onChange } )
                ])
                , e$2( 'div', { className: 'column is-3' }, [
                    e$2( Input, { name: 'evid_receivefrom', type: 'text', label: 'Evidence Received From', value: (formData['evid_receivefrom'] || ''), onChange } )
                ])
            ])
            , e$2( 'div', { className: 'columns' }, [
                e$2( 'div', { className: 'column is-3' }, [
                    e$2( Input, { name: 'evid_labnum', type: 'text', label: 'Lab Evidence Number', value: (formData['evid_labnum'] || ''), onChange } )
                ])
                , e$2( 'div', { className: 'column is-3' }, [
                    e$2( Input, { name: 'exam_complete', type: 'date', label: 'Exam Completed Date', value: (formData['exam_complete'] || ''), onChange } )
                ])
            ])
            , e$2( 'p', { className: 'title is-3' }, 'Device Information' )
            , e$2( 'div', { className: 'columns' }, [
                e$2( 'div', { className: 'column' }, [
                    e$2( Input, { name: 'dev_make', type: 'text', label: 'Make', value: (formData['dev_make'] || ''), onChange } )
                ])
                , e$2( 'div', { className: 'column' }, [
                    e$2( Input, { name: 'dev_model_name', type: 'text', label: 'Model Name', value: (formData['dev_model_name'] || ''), onChange } )
                ])
                , e$2( 'div', { className: 'column' }, [
                    e$2( Input, { name: 'dev_model_code', type: 'text', label: 'Model Code', value: (formData['dev_model_code'] || ''), onChange } )
                ])
                , e$2( 'div', { className: 'column' }, [
                    e$2( Input, { name: 'dev_color', type: 'text', label: 'Color', value: (formData['dev_color'] || ''), onChange } )
                ])
            ])
            , e$2( 'div', { className: 'columns' }, [
                e$2( 'div', { className: 'column' }, [
                    e$2( Input, { name: 'defects', type: 'text', label: 'Defects/Comments', value: (formData['defects'] || ''), onChange } )
                ])
            ])
            , e$2( 'div', { className: 'box' }, [
                e$2( 'div', { className: 'columns' }, [
                    e$2( 'div', { className: 'column is-2' }, [
                        e$2( 'strong', { className: 'title is-4' }, 'Identifier 1' )
                    ])
                    , e$2( 'div', { className: 'column is-2' }, [
                        e$2( 'label', { className: 'label' }, 'Identifier Type' )
                        , e$2( 'div', { className: 'select' }, e$2( 'select', {}, [
                            e$2( 'option', { value: 'default' }, '-- Identifier Type --' )
                            , e$2( 'option', { value: 'imei' }, 'IMEI' )
                            , e$2( 'option', { value: 'meid' }, 'MEID' )
                            , e$2( 'option', { value: 'sn' }, 'S/N' )
                        ]) )
                    ])
                    , e$2( 'div', { className: 'column is-4' }, [
                        e$2( Input, { name: 'dev_id0', type: 'text', label: 'Identifier', value: (formData['dev_id0'] || ''), onChange } )
                    ])
                    , e$2( 'div', { className: 'column is-4' }, [
                        e$2( 'button', { className: 'button is-danger' }, [
                            e$2( 'span', { className: 'icon' }, e$2( 'i', { className: 'fa-solid fa-trash fa-lg' } ) )
                        ])
                    ])
                ])
            ])
            , e$2( 'div', { className: 'box' }, [
                e$2( 'div', { className: 'columns' }, [
                    e$2( 'div', { className: 'column is-2' }, [
                        e$2( 'strong', { className: 'title is-4' }, 'Identifier 2' )
                    ])
                    , e$2( 'div', { className: 'column is-2' }, [
                        e$2( 'label', { className: 'label' }, 'Identifier Type' )
                        , e$2( 'div', { className: 'select' }, e$2( 'select', {}, [
                            e$2( 'option', { value: 'default' }, '-- Identifier Type --' )
                            , e$2( 'option', { value: 'imei' }, 'IMEI' )
                            , e$2( 'option', { value: 'meid' }, 'MEID' )
                            , e$2( 'option', { value: 'sn' }, 'S/N' )
                        ]) )
                    ])
                    , e$2( 'div', { className: 'column is-4' }, [
                        e$2( Input, { name: 'dev_id0', type: 'text', label: 'Identifier', value: (formData['dev_id0'] || ''), onChange } )
                    ])
                    , e$2( 'div', { className: 'column is-4' }, [
                        e$2( 'button', { className: 'button is-danger' }, [
                            e$2( 'span', { className: 'icon' }, e$2( 'i', { className: 'fa-solid fa-trash fa-lg' } ) )
                        ])
                    ])
                ])
            ])
            , e$2( 'div', {}, [
                e$2( 'button', { className: 'button is-primary' }, [
                    e$2( 'span', { className: 'icon' }, e$2( 'i', { className: 'fa-solid fa-plus fa-lg' } ) )
                    , e$2( 'span', {}, 'Add Identifier' )
                ])
            ])
            , e$2( 'p', { className: 'title is-3' }, 'Device State' )
            , e$2( 'div', { className: 'columns' }, [
                e$2( 'div', { className: 'column is-2' }, [
                    e$2( 'label', { className: 'checkbox' }, [
                        e$2( 'input', { type: 'checkbox', name: 'devstate_power', checked: formData['devstate_power'] } )
                        , 'Powered on?'
                    ])
                ])
                , e$2( 'div', { className: 'column is-2' }, [
                    e$2( 'label', { className: 'checkbox' }, [
                        e$2( 'input', { type: 'checkbox', name: 'devstate_airplane', checked: formData['devstate_airplane'] } )
                        , 'Airplane mode on?'
                    ])
                ])
                , e$2( 'div', { className: 'column is-2' }, [
                    e$2( 'label', { className: 'checkbox' }, [
                        e$2( 'input', { type: 'checkbox', name: 'devstate_wifi', checked: formData['devstate_wifi'] } )
                        , 'WiFi enabled?'
                    ])
                ])
            ])
            , e$2( 'div', { className: 'columns' }, [
                e$2( 'div', { className: 'column is-2' }, [
                    e$2( 'label', { className: 'checkbox' }, [
                        e$2( 'input', { type: 'checkbox', name: 'devstate_locked', checked: formData['devstate_locked'] } )
                        , 'Device locked?'
                    ])
                ])
                , e$2( 'div', { className: 'column is-4' }, [
                    e$2( Input, { name: 'devstate_locktype', type: 'text', label: 'Lock Type', value: (formData['devstate_locktype'] || ''), onChange } )
                ])
            ])
            , e$2( 'p', { className: 'title is-3' }, 'Acquisition' )
            , e$2( 'div', { className: 'columns' }, [
                e$2( 'div', { className: 'column is-1' }, [
                    e$2( 'label', { className: 'checkbox' }, [
                        e$2( 'input', { type: 'checkbox', name: 'acq_axiom', checked: formData['acq_axiom'] } )
                        , 'Axiom'
                    ])
                ])
                , e$2( 'div', { className: 'column is-1' }, [
                    e$2( 'label', { className: 'checkbox' }, [
                        e$2( 'input', { type: 'checkbox', name: 'acq_cellebrite', checked: formData['acq_cellebrite'] } )
                        , 'Cellebrite'
                    ])
                ])
                , e$2( 'div', { className: 'column is-1' }, [
                    e$2( 'label', { className: 'checkbox' }, [
                        e$2( 'input', { type: 'checkbox', name: 'acq_dvrexaminer', checked: formData['acq_dvrexaminer'] } )
                        , 'DVR Examiner'
                    ])
                ])
                , e$2( 'div', { className: 'column is-1' }, [
                    e$2( 'label', { className: 'checkbox' }, [
                        e$2( 'input', { type: 'checkbox', name: 'acq_duplicator', checked: formData['acq_duplicator'] } )
                        , 'Forensic Duplicator'
                    ])
                ])
                , e$2( 'div', { className: 'column is-1' }, [
                    e$2( 'label', { className: 'checkbox' }, [
                        e$2( 'input', { type: 'checkbox', name: 'acq_ftkimager', checked: formData['acq_ftkimager'] } )
                        , 'FTK Imager'
                    ])
                ])
                , e$2( 'div', { className: 'column is-1' }, [
                    e$2( 'label', { className: 'checkbox' }, [
                        e$2( 'input', { type: 'checkbox', name: 'acq_graykey', checked: formData['acq_graykey'] } )
                        , 'GrayKey'
                    ])
                ])
                , e$2( 'div', { className: 'column is-1' }, [
                    e$2( 'label', { className: 'checkbox' }, [
                        e$2( 'input', { type: 'checkbox', name: 'acq_macquisition', checked: formData['acq_macquisition'] } )
                        , 'Macquisition'
                    ])
                ])
                , e$2( 'div', { className: 'column is-1' }, [
                    e$2( 'label', { className: 'checkbox' }, [
                        e$2( 'input', { type: 'checkbox', name: 'acq_manual', checked: formData['acq_manual'] } )
                        , 'Manual'
                    ])
                ])
                , e$2( 'div', { className: 'column is-1' }, [
                    e$2( 'label', { className: 'checkbox' }, [
                        e$2( 'input', { type: 'checkbox', name: 'acq_memcap', checked: formData['acq_memcap'] } )
                        , 'Memory Capture (Specify Tool)'
                    ])
                ])
                , e$2( 'div', { className: 'column is-1' }, [
                    e$2( 'label', { className: 'checkbox' }, [
                        e$2( 'input', { type: 'checkbox', name: 'acq_paladin', checked: formData['acq_paladin'] } )
                        , 'Paladin'
                    ])
                ])
                , e$2( 'div', { className: 'column is-1' }, [
                    e$2( 'label', { className: 'checkbox' }, [
                        e$2( 'input', { type: 'checkbox', name: 'acq_photos', checked: formData['acq_photos'] } )
                        , 'Photos'
                    ])
                ])
                , e$2( 'div', { className: 'column is-1' }, [
                    e$2( 'label', { className: 'checkbox' }, [
                        e$2( 'input', { type: 'checkbox', name: 'acq_targeted', checked: formData['acq_targeted'] } )
                        , 'Targeted (Specify Tool)'
                    ])
                ])
            ])
            , e$2( 'div', { className: 'columns' }, [
                e$2( 'div', { className: 'column is-4' }, [
                    e$2( Input, { name: 'acq_notes', type: 'text', label: 'Acquisition Note', value: (formData['acq_notes'] || ''), onChange } )
                ])
                , e$2( 'div', { className: 'column is-4' }, [
                    e$2( Input, { name: 'acq_pw', type: 'text', label: 'Passcode', value: (formData['acq_pw'] || ''), onChange } )
                ])
            ])
            , e$2( 'p', { className: 'title is-3' }, 'Processing' )
            , e$2( 'div', { className: 'columns' }, [
                e$2( 'div', { className: 'column is-1' }, [
                    e$2( 'label', { className: 'checkbox' }, [
                        e$2( 'input', { type: 'checkbox', name: 'proc_axiom', checked: formData['proc_axiom'] } )
                        , 'Axiom'
                    ])
                ])
                , e$2( 'div', { className: 'column is-1' }, [
                    e$2( 'label', { className: 'checkbox' }, [
                        e$2( 'input', { type: 'checkbox', name: 'proc_cellebrite', checked: formData['proc_cellebrite'] } )
                        , 'Cellebrite'
                    ])
                ])
            ])
            , e$2( 'div', { className: 'columns' }, [
                e$2( 'div', { className: 'column is-4' }, [
                    e$2( Input, { name: 'proc_notes', type: 'text', label: 'Processing Note', value: (formData['proc_notes'] || ''), onChange } )
                ])
            ])
            , e$2( 'div', {}, [
                e$2( 'button', { className: 'button is-primary' }, [
                    e$2( 'span', { className: 'icon' }, e$2( 'i', { className: 'fa-solid fa-hard-drive fa-lg' } ) )
                    , e$2( 'span', {}, 'Start Related Device Report' )
                ])
            ])
            , e$2( 'div', {}, [
                e$2( 'button', { type: 'submit', className: 'button is-success' }, [
                    e$2( 'span', { className: 'icon' }, e$2( 'i', { className: 'fa-solid fa-file-word fa-lg' } ) )
                    , e$2( 'span', {}, 'Generate Report' )
                ])
            ])
        ])
    };

    const e$1 = React$1.createElement;

    function Footer() {
        return e$1( 'footer', { className: 'footer' }, [
            e$1( 'div', { className: 'content has-text-centered' }, 'Footer' )
        ])
    }

    React;
    const e = React.createElement;

    const App = () => {
        return e( 'div', {}, [
            , e( 'section', { className: 'section' }, [
                e( 'h1', { className: 'title' }, 'DFU Report Builder' )
                , e( 'p', { className: 'subtitle' }, 'Drop source files below to autopopulate data entry form.' )
            ])
            , e( 'section', { className: 'section' }, [
                e( 'div', { className: 'container' }, e( Form ) )
            ])
            , e( Footer )
        ])
    };

    ReactDOM.render( React.createElement( App ), document.getElementById( 'root' ) );

})();
//# sourceMappingURL=index.js.map
