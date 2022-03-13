(function () {
    'use strict';

    var devMode = false;
    var hidden = {
    	agency: "AGENCY NAME HERE",
    	agency_abbr: "AGENCY ABBR HERE",
    	lab_loc: "Digital Forensics Unit (Office of the Sheriff, Investigations Division, 27 East Vermijo Avenue, Colorado Springs, CO 80903)",
    	glossary: [
    		{
    			term: "Advanced Logical",
    			definition: "Logical extraction of data is performed, for the most part, through a designated API (Application Programming Interface), available from the device vendor. Just as the API allows commercial third-party apps to communicate with the device OS (operating system), it also enables forensically sound data extraction. Upon connection, the UFED loads the relevant vendor API to the device. The UFED then makes read-only API calls to request data from the phone. The phone replies to valid API requests to extract designated content items such as text messages (SMS), phonebook entries, pictures, etc. From a technical standpoint, API-based logical extraction is straightforward to implement and the results are provided in a readable format. However, the logical method is limited to the scope of content the specific vendor has made available through its API. Pictures taken via third-party app, for example, are likely stored in a folder that is different from the default. Therefore, the API will not see that they exist and will not make them available to a UFED logical extraction. To access this data, an examiner would need to access the file system and examine the data associated with the particular application in question. In addition, not all devices have a common interface to extract emails, and the API will not be applicable."
    		},
    		{
    			term: "Logical",
    			definition: "Logical extraction of data is performed, for the most part, through a designated API (Application Programming Interface), available from the device vendor. Just as the API allows commercial third-party apps to communicate with the device OS (operating system), it also enables forensically sound data extraction. Upon connection, the UFED loads the relevant vendor API to the device. The UFED then makes read-only API calls to request data from the phone. The phone replies to valid API requests to extract designated content items such as text messages (SMS), phonebook entries, pictures, etc. From a technical standpoint, API-based logical extraction is straightforward to implement and the results are provided in a readable format. However, the logical method is limited to the scope of content the specific vendor has made available through its API. Pictures taken via third-party app, for example, are likely stored in a folder that is different from the default. Therefore, the API will not see that they exist and will not make them available to a UFED logical extraction. To access this data, an examiner would need to access the file system and examine the data associated with the particular application in question. In addition, not all devices have a common interface to extract emails, and the API will not be applicable."
    		},
    		{
    			term: "Filesystem",
    			definition: "Another logical method extends the examiner’s reach to the phone’s live partition. Available with the UFED Ultimate license, a file system extraction uses different device-specific methods to copy the file system. While these are comparable to the API used in logical methods, they use different sets of built-in protocols, depending on the OS. The mix of protocols often differs from device family to device family. In some cases, not only with iOS devices as described above but also with Android and BlackBerry® models, it may be necessary to rely on device backup files to make available files, hidden files, and other data that is not necessarily accessible through the phone’s API. File system extraction. This can include some user deleted and hidden data contained within SQLite databases, including web history, email headers, EXIF data on images, and system data."
    		},
    		{
    			term: "Physical",
    			definition: "To allow the most comprehensive and detailed analysis of the device, Cellebrite’s physical extraction capability accesses the additional data layers, in both allocated and unallocated space, that construct the phone’s physical memory. These layers include three different groups of content pertinent to investigators: \"Logical\" content unavailable through API (e.g. call logs on smartphones and feature phones), deleted content the same text message shows up multiple times because garbage collection has not yet happened Physical extraction, and content that the phone collects without any user action (and sometimes without user knowledge). For example: wi-fi networks, GPS locations, web history, email headers and EXIF data on images, and system data. The physical extraction allows the examiner to access this data by creating a bit-for-bit copy of the mobile device’s flash memory. As with the file system extraction, the data within this copy can be decoded via UFED Physical Analyzer. Seeing where the data is located within the device’s memory enables the analyst to interpret the data."
    		}
    	],
    	returnToEvidenceStatement_noWaiver: "The device was re-sealed and placed back into Evidence.",
    	returnToEvidenceStatement_waiver: "The device was returned to {requester}."
    };
    var general = {
    	examiner: "NAME HERE/EID",
    	reportdate_fmt: "M/D/YY",
    	unit: "GB",
    	units: [
    		{
    			label: "B",
    			value: "B"
    		},
    		{
    			label: "KB",
    			value: "KB"
    		},
    		{
    			label: "MB",
    			value: "MB"
    		},
    		{
    			label: "GB",
    			value: "GB"
    		},
    		{
    			label: "TB",
    			value: "TB"
    		}
    	],
    	auth_type: "waiver",
    	auth_types: [
    		{
    			label: "Waiver",
    			value: "Waiver"
    		},
    		{
    			label: "Warrant",
    			value: "Warrant"
    		},
    		{
    			label: "Court Order",
    			value: "Court Order"
    		},
    		{
    			label: "No Expectation of Privacy",
    			value: "No Expectation of Privacy"
    		},
    		{
    			label: "Abandoned",
    			value: "Abandoned"
    		},
    		{
    			label: "Lost",
    			value: "Lost"
    		},
    		{
    			label: "Other",
    			value: "Other"
    		}
    	]
    };
    var evidence = {
    	evid_receivefrom: "Evidence Staff",
    	evid_receivedate_fmt: "M/D/YY",
    	exam_complete_fmt: "M/D/YY"
    };
    var device_information = {
    	defects: "(None.)"
    };
    var identifiers = {
    	types: [
    		{
    			label: "-- Identifier Type --",
    			value: "default"
    		},
    		{
    			label: "IMEI",
    			value: "IMEI"
    		},
    		{
    			label: "IMSI",
    			value: "IMSI"
    		},
    		{
    			label: "MEID",
    			value: "MEID"
    		},
    		{
    			label: "S/N",
    			value: "Serial Number"
    		},
    		{
    			label: "MSISDN",
    			value: "MSISDN"
    		},
    		{
    			label: "MAC",
    			value: "MAC"
    		},
    		{
    			label: "UDID",
    			value: "UDID"
    		},
    		{
    			label: "ECID",
    			value: "ECID"
    		},
    		{
    			label: "ICCID",
    			value: "ICCID"
    		},
    		{
    			label: "Apple ID",
    			value: "Apple ID"
    		},
    		{
    			label: "Android ID",
    			value: "Android ID"
    		},
    		{
    			label: "Advertising ID",
    			value: "Advertising ID"
    		},
    		{
    			label: "Bluetooth MAC",
    			value: "Bluetooth MAC"
    		},
    		{
    			label: "WiFi MAC",
    			value: "WiFi MAC"
    		},
    		{
    			label: "Email Address",
    			value: "Email Address"
    		},
    		{
    			label: "Device Name",
    			value: "Device Name"
    		}
    	]
    };
    var device_state = {
    	states: [
    		{
    			label: "Powered on?",
    			value: "Powered On",
    			group: "devstate"
    		},
    		{
    			label: "Airplane mode on?",
    			value: "Airplane Mode On",
    			group: "devstate"
    		},
    		{
    			label: "WiFi enabled?",
    			value: "WiFi Enabled",
    			group: "devstate"
    		},
    		{
    			label: "Device locked?",
    			value: "Locked",
    			group: "devstate"
    		}
    	]
    };
    var acquisition = {
    	methods: [
    		{
    			label: "Axiom",
    			value: "acq_axiom",
    			group: "acq_method",
    			col: 0
    		},
    		{
    			label: "Cellebrite Touch 2",
    			value: "Cellebrite Touch 2",
    			group: "acq_method",
    			col: 0
    		},
    		{
    			label: "Cellebrite 4PC",
    			value: "Cellebrite 4PC",
    			group: "acq_method",
    			col: 0
    		},
    		{
    			label: "DVR Examiner",
    			value: "DVR Examiner",
    			group: "acq_method",
    			col: 0
    		},
    		{
    			label: "GrayKey",
    			value: "GrayKey",
    			group: "acq_method",
    			col: 0
    		},
    		{
    			label: "Macquisition",
    			value: "Macquisition",
    			group: "acq_method",
    			col: 0
    		},
    		{
    			label: "Forensic Duplicator",
    			value: "Tableau TX1",
    			group: "acq_method",
    			col: 1
    		},
    		{
    			label: "FTK Imager",
    			value: "AccessData FTK Imager",
    			group: "acq_method",
    			col: 1
    		},
    		{
    			label: "Manual",
    			value: "Manual",
    			col: 1
    		},
    		{
    			label: "Memory Capture (Specify Tool)",
    			value: "Belkasoft RAMCapturer",
    			group: "acq_method",
    			col: 1
    		},
    		{
    			label: "Paladin",
    			value: "Sumuri Paladin",
    			group: "acq_method",
    			col: 1
    		},
    		{
    			label: "Targeted (Specify Tool)",
    			value: "KAPE",
    			group: "acq_method",
    			col: 1
    		},
    		{
    			label: "Photos",
    			value: "acq_photos",
    			group: "acq_method",
    			col: 2
    		}
    	],
    	types: [
    		{
    			label: "-- Select Type --",
    			value: "default"
    		},
    		{
    			label: "Logical",
    			value: "Logical"
    		},
    		{
    			label: "Advanced Logical",
    			value: "Advanced Logical"
    		},
    		{
    			label: "Filesystem",
    			value: "Filesystem"
    		},
    		{
    			label: "Partial Filesystem",
    			value: "Partial Filesystem"
    		},
    		{
    			label: "Partial Filesystem (AFU)",
    			value: "Partial Filesystem (AFU)"
    		},
    		{
    			label: "Partial Filesystem (BFU)",
    			value: "Partial Filesystem (BFU)"
    		},
    		{
    			label: "Physical",
    			value: "Physical"
    		}
    	],
    	hash_types: [
    		{
    			label: "MD5",
    			value: "MD5"
    		},
    		{
    			label: "SHA1",
    			value: "SHA1"
    		},
    		{
    			label: "SHA256",
    			value: "SHA256"
    		}
    	]
    };
    var processing = {
    	methods: [
    		{
    			label: "Autopsy",
    			value: "Autopsy",
    			group: "proc_method",
    			col: 0
    		},
    		{
    			label: "Axiom",
    			value: "Magnet Axiom",
    			group: "proc_method",
    			col: 0
    		},
    		{
    			label: "Cellebrite",
    			value: "Cellebrite Physical Analyzer",
    			group: "proc_method",
    			col: 0
    		},
    		{
    			label: "DVR Examiner",
    			value: "DVR Examiner",
    			group: "proc_method",
    			col: 0
    		}
    	]
    };
    var config = {
    	devMode: devMode,
    	hidden: hidden,
    	general: general,
    	evidence: evidence,
    	device_information: device_information,
    	identifiers: identifiers,
    	device_state: device_state,
    	acquisition: acquisition,
    	processing: processing
    };

    var constants = {
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
            , {
                source: 'ftk_imager'
                , type: 'txt'
                , regex: /AccessData® FTK® Imager/i
            }
        ]
    };

    function determineFileSource( lines, type ) {
        let n = 0;
        const parsers = constants.INDICATORS.filter( parser => parser.type == type );

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

    var csvParser = file => {
        return new Promise( ( resolve, reject ) => {
            let reader = new FileReader();

            reader.onload = async function() {
                determineFileSource( reader.result.split( '\n' ), 'csv' );

                reject();
            };

            reader.onerror = () => { reject( reader.error ); };

            reader.readAsText( file );
        })
    };

    var parseGraykeyPdfReport = data => {
        let updateFields = { acq_method: [ 'GrayKey' ] };
        let updateIds = [];

        data.forEach( ( line, idx ) => {
            const value = data[ idx + 1 ];

            if ( line.startsWith( 'GrayKey Software: OS Version:' ) ) { updateFields.acq_ver = line.split( ',' )[0].replace( /[^0-9\.]/g, '' ); }
            else if ( line.startsWith( 'Report generation time:' ) ) { updateFields.reportdate = line.split( ' ' )[3]; }
            else if ( line == 'Model' ) { updateFields.dev_model_name = value; }
            else if ( line == 'Unique Device ID (UDID)' ) { updateIds.push({ type: 'UDID', value }); }
            else if ( line == 'Serial Number' ) { updateIds.push({ type: 'Serial Number', value }); }
            else if ( line == 'Unique Chip ID (ECID)' ) { updateIds.push({ type: 'ECID', value }); }
            else if ( line == 'WiFi MAC Address' ) { updateIds.push({ type: 'WiFi MAC', value }); }
            else if ( line == 'Bluetooth MAC Address' ) { updateIds.push({ type: 'Bluetooth MAC', value }); }
            else if ( line == 'Phone Number' ) { updateIds.push({ type: 'MSISDN', value }); }
            else if ( line == 'IMEI' ) { updateIds.push({ type: 'IMEI', value }); }
            else if ( line == 'Owner Name' ) { updateFields.owner = value; }
            else if ( line == 'Accounts' ) { updateIds.push({ type: 'Email Address', value }); }
            else if ( line == 'Extraction Result Summary' ) {
                let mapped;

                if ( value == 'Partial BFU Filesystem' ) { mapped = 'Partial Filesystem (BFU)'; }

                updateFields.acq_type = mapped;
            }
            else if ( line == 'Extraction size' ) {
                updateFields.capacity = value.split( '(' )[0].replace( /[^0-9\.]/g, '' );
                if ( value.toLowerCase().indexOf( 'mb' ) >= 0 ) { updateFields.unit = 'MB'; }
                if ( value.toLowerCase().indexOf( 'gb' ) >= 0 ) { updateFields.unit = 'GB'; }
                if ( value.toLowerCase().indexOf( 'tb' ) >= 0 ) { updateFields.unit = 'TB'; }
            }
        });

        return { updateFields, updateIds }
    };

    var parseDvrExaminerPdfReport = data => {
        let updateFields = { acq_method: [ 'DVR Examiner' ], proc_method: [ 'DVR Examiner' ] };
        let updateIds = [];

        //console.log( data )

        data.forEach( ( line, idx ) => {
            const value = data[ idx + 1 ];

            if ( line == 'Export Completed:' ) { updateFields.reportdate = value.split( ' ' )[0]; }
            else if ( line == 'Output Formats:' ) { updateFields.proc_notes = value; }
            else if ( line == 'Total Clips Exported:' ) { updateFields.proc_notes = `${ updateFields.proc_notes } (${ value } clips.)`; }
            else if ( line == 'Estimated Export Size:' ) {
                updateFields.capacity = value.replace( /[^0-9\.]/g, '' );
                if ( value.toLowerCase().indexOf( 'mb' ) >= 0 ) { updateFields.unit = 'MB'; }
                if ( value.toLowerCase().indexOf( 'gb' ) >= 0 ) { updateFields.unit = 'GB'; }
                if ( value.toLowerCase().indexOf( 'tb' ) >= 0 ) { updateFields.unit = 'TB'; }
            }
            else if ( line.startsWith( 'DVR Examiner' ) && value == 'Version:' ) {
                updateFields.acq_ver = data[ idx + 2 ];
                updateFields.proc_ver = data[ idx + 2 ];
            }
            else if ( line == 'Case Number:' ) { updateFields.crn = value; }
            else if ( line == 'Examiner:' ) { updateFields.examiner = value; }
        });

        return { updateFields, updateIds }
    };

    var pdfParser = file => {
        return new Promise( ( resolve, reject ) => {
            let reader = new FileReader();

            reader.onload = async function() {
                const typedarray = new Uint8Array( reader.result );

                const pdf = await pdfjsLib.getDocument( typedarray ).promise;

                const concatPages = async total => {
                    let textNodes = [];

                    const next = async n => {
                        const page = await pdf.getPage( n );
                        textNodes = [ ...textNodes, ...(await page.getTextContent()).items.map( node => node.str ).filter( text => text.trim() ) ];

                        if ( n < total ) await next( n + 1 );
                    };

                    await next( 1 );
                    return textNodes
                };

                const text = await concatPages( pdf.numPages > 1 ? 2 : 1 );
                const source = determineFileSource( text, 'pdf' );

                if ( source == 'graykey' ) return resolve( parseGraykeyPdfReport( text ) )
                if ( source == 'dvr_examiner' ) return resolve( parseDvrExaminerPdfReport( text ) )

                reject();
            };

            reader.onerror = () => { reject( reader.error ); };

            reader.readAsArrayBuffer( file );
        })
    };

    var parseFtkImagerTxtReport = data => {
        let updateFields = { acq_method: [ 'AccessData FTK Imager' ] };
        let updateIds = [];

        //console.log( data )

        data.forEach( ( line, idx ) => {
            if ( line.startsWith( 'Created By AccessData® FTK® Imager' ) ) { updateFields.acq_ver = line.split( 'Imager' )[1].trim(); }
            else if ( line.startsWith( 'Case Number:' ) ) { updateFields.crn = line.split( ':' )[1].trim(); }
            else if ( line.startsWith( 'Evidence Number:' ) ) { updateFields.evid_num = line.split( ':' )[1].trim(); }
            else if ( line.startsWith( 'Unique description:' ) ) { updateFields.dev_model_code = line.split( ':' )[1].trim(); }
            else if ( line.startsWith( 'Examiner:' ) ) { updateFields.examiner = line.split( ':' )[1].trim(); }
            else if ( line.startsWith( 'Notes:' ) ) { updateFields.acq_notes = line.split( ':' )[1].trim(); }
            else if ( line.trim().startsWith( 'Source data size:' )  ) {
                updateFields.capacity = line.replace( /[^0-9\.]/g, '' );
                if ( line.toLowerCase().indexOf( 'mb' ) >= 0 ) { updateFields.unit = 'MB'; }
                if ( line.toLowerCase().indexOf( 'gb' ) >= 0 ) { updateFields.unit = 'GB'; }
                if ( line.toLowerCase().indexOf( 'tb' ) >= 0 ) { updateFields.unit = 'TB'; }
            }
            else if ( line.trim().startsWith( 'Drive Model:' ) ) { updateFields.dev_model_name = line.split( ':' )[1].trim(); }
            else if ( line.trim().startsWith( 'Drive Serial Number:' ) ) { updateIds.push({ type: 'Serial Number', value: line.split( ':' )[1].trim() }); }
            else if ( line.trim().startsWith( 'MD5 checksum:' ) ) {
                updateFields.acq_hash_type = 'MD5';
                updateFields.acq_hash = line.split( ':' )[1].trim();
            }
        } );

        return { updateFields, updateIds }
    };

    var txtParser = file => {
        return new Promise( ( resolve, reject ) => {
            let reader = new FileReader();

            reader.onload = async function() {
                const text = reader.result.split( '\n' );
                const source = determineFileSource( text, 'txt' );

                if ( source == 'ftk_imager' ) return resolve( parseFtkImagerTxtReport( text ) )

                reject();
            };

            reader.onerror = () => { reject( reader.error ); };

            reader.readAsText( file );
        })
    };

    var parseCellebriteXmlReport = data => {
        const { project } = data;

        let updateFields = { proc_method: [ 'Cellebrite Physical Analyzer' ] };
        let updateIds = [];

        //console.log( project )

        if ( project.extractionType == 'AdvancedLogical' ) updateFields.acq_type = 'Advanced Logical';

        // case information
        project.caseInformation.field.forEach( field => {
            if ( field.name == 'Examiner name' ) updateFields.examiner = field.text;
            if ( field.name == 'Authorization' ) updateFields.auth_type = field.text;
            if ( field.name == 'Requester Name' ) updateFields.requester = field.text;
            if ( field.name == 'Unit name' ) updateFields.acq_unit_name = field.text;
            if ( field.name == 'Extraction type' ) updateFields.extraction_type = field.text;
            if ( field.name == 'Case number' ) updateFields.crn = field.text;
            if ( field.name == 'Evidence number' ) updateFields.evid_num = field.text;
            if ( field.name == 'Lab evidence number' ) updateFields.evid_num_lab = field.text;
        });
        // metadata additional fields
        project.metadata.forEach( metadata => {
            // additional fields
            if ( metadata.section == 'Additional Fields' ) {
                metadata.item.forEach( field => {
                    if ( field.name == 'UFED_PA_Version' ) updateFields.proc_ver = field.text;
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
                    if ( field.name == 'DeviceInfoDetectedManufacturer' ) { updateFields.dev_make = field.text; }
                    else if ( field.name == 'DeviceInfoDetectedModel' ) { updateFields.dev_model_name = field.text; }
                    else if ( field.name == 'DeviceInfoAndroidID' ) { updateIds.push({ type: 'Android ID', value: field.text }); }
                    else if ( field.name == 'DeviceInfoAppleID' ) { updateIds.push({ type: 'Apple ID', value: field.text }); }
                    else if ( field.name == 'DeviceInfoAdvertisingID' ) { updateIds.push({ type: 'Advertising ID', value: field.text }); }
                    else if ( field.name == 'IMEI' ) { updateIds.push({ type: 'IMEI', value: field.text }); }
                    else if ( field.name == 'IMEI2' ) { updateIds.push({ type: 'IMEI', value: field.text }); }
                    else if ( field.name == 'DeviceInfoSerial' ) { updateIds.push({ type: 'Serial Number', value: field.text }); }
                    else if ( field.name == 'DeviceInfoDeviceName' ) { updateIds.push({ type: 'Device Name', value: field.text }); }
                    else if ( field.name == 'DeviceInfoBluetoothDeviceAddress' ) { updateIds.push({ type: 'Bluetooth MAC', value: field.text }); }
                    else if ( field.name == 'DeviceInfoStorageCapacity' ) {
                        updateFields.capacity = field.text;
                        updateFields.unit = 'B';
                    }
                    else if ( field.name == 'DeviceInfoWiFiMACAddress' ) { updateIds.push({ type: 'WiFi MAC', value: field.text }); }
                    else if ( field.name == 'DeviceInfoMACAddress' ) { updateIds.push({ type: 'MAC', value: field.text }); }
                    else if ( field.name == 'ICCID' ) { updateIds.push({ type: 'ICCID', value: field.text }); }
                    else if ( field.name == 'IMSI' ) { updateIds.push({ type: 'IMSI', value: field.text }); }
                    else if ( field.name == 'MEID' ) { updateIds.push({ type: 'MEID', value: field.text }); }
                    else if ( field.name == 'MSISDN' ) { updateIds.push({ type: 'MSISDN', value: field.text }); }
                    else if ( field.name == 'DeviceInfoDetectedPhoneModel' ) { updateFields.dev_model_name = field.text; }
                });
            }
        });

        return { updateFields, updateIds }
    };

    var xmlParser = file => {
        return new Promise( ( resolve, reject ) => {
            let reader = new FileReader();

            reader.onload = async function() {
                const data = parser.parse( reader.result, {
                    ignoreAttributes: false
                    , attributeNamePrefix: ''
                    , textNodeName: 'text'
                });

                const source = determineFileSource( reader.result.split( '\n' ), 'xml' );

                if ( source == 'cellebrite' ) resolve( parseCellebriteXmlReport( data ) );

                reject();
            };

            reader.onerror = () => { reject( reader.error ); };

            reader.readAsText( file );
        })
    };

    const { useEffect: useEffect$1, useState: useState$2 } = React;
    const e$4 = React.createElement;

    function FileParser({ name, label, formData, setFormData, identifiers, setIdentifiers }) {
        const [ message, setMessage ] = useState$2([ 'is-info', false ]);
        const [ filename, setFilename ] = useState$2( '' );
        
        const handleFile = async ev => {
            const file = ev.target.files[0];
            const { name, type, size } = file;

            setFilename( name );

            //console.log( `GOT FILE: ${ name }, ${ type }, ${ size }` )

            if ( type == 'application/pdf' ) { return pdfParser( file ) }
            else if ( type == 'text/csv' ) { return csvParser( file ) }
            else if ( type == 'text/plain' ) { return txtParser( file ) }
            else if ( type == 'text/xml' || type == 'application/xml' ) { return xmlParser( file ) }
            else { return Promise.reject() }
        };

        useEffect$1( () => {
            document.body.addEventListener( 'dragover', ev => {
                ev.preventDefault();
                ev.stopPropagation();

                return () => document.body.removeEventListener( 'dragover', ev )
            }, [] );

            document.body.addEventListener( 'drop', async ev => {
                ev.preventDefault();
                ev.stopPropagation();

                const files = Array.from( ev.dataTransfer.files );

                setMessage([ 'is-info', `Processing ${ files.length } file${ files.length > 1 ? 's' : '' }...` ]);

                Promise.allSettled( files.map( file => handleFile({ target: { files: [ file ] } }) ) ).then( promises => {
                    let updates = { ...formData };
                    let ids = [ ...identifiers ];
                    let failed = 0;
                    let messages = [];

                    promises.forEach( ( promise, idx ) => {
                        if ( promise.status != 'fulfilled' ) failed++;
                        messages.push( e$4( 'li', {}, [ e$4( 'strong', {}, promise.status == 'fulfilled' ? 'Completed: ' : 'Failed: ' ), e$4( 'span', {}, files[idx].name ) ] ) );
                    });

                    let messageStyle = 'is-danger';

                    if ( failed == 0 ) { messageStyle = 'is-success'; }
                    else if ( failed > 0 && failed < promises.length ) { messageStyle = 'is-warning'; }

                    setMessage([ messageStyle, e$4( 'div', {}, [ e$4( 'p', {}, 'Later files overwrite previous values.' ), e$4( 'ol', { style: { listStylePosition: 'inside' } }, messages ) ] ) ]);

                    promises.filter( promise => promise.status == 'fulfilled' ).map( promise => promise.value ).forEach( ({ updateFields, updateIds }) => {
                        // dumb hack for the checkboxes
                        if ( updateFields.devstate ) updateFields.devstate = [ ...updates.devstate, ...updateFields.devstate ];
                        if ( updateFields.acq_method ) updateFields.acq_method = [ ...updates.acq_method, ...updateFields.acq_method ];
                        if ( updateFields.proc_method ) updateFields.proc_method = [ ...updates.proc_method, ...updateFields.proc_method ];

                        updates = { ...updates, ...updateFields };
                        ids = [ ...ids, ...updateIds ];
                    });

                    setFormData( updates );
                    setIdentifiers( ids );
                });

                return () => document.body.removeEventListener( 'drop', ev )
            }, [] );
        });

        return e$4( 'div', {}, [
            message[1] ? e$4( 'article', { className: `message ${ message[0] }` }, e$4( 'div', { className: 'message-body' }, message[1] ) ) : ''
            , e$4( 'div', { className: 'field' }, [
                e$4( 'div', { className: 'file has-name is-fullwidth' }, [
                    e$4( 'label', { className: 'file-label' }, [
                        e$4( 'input', { className: 'file-input', type: 'file', name, onChange: handleFile } )
                        , e$4( 'span', { className: 'file-cta' }, [
                            e$4( 'span', { className: 'file-icon' }, [
                                e$4( 'i', { className: 'fas fa-upload' } )
                            ])
                            , e$4( 'span', { className: 'file-label' }, label )
                        ])
                        , e$4( 'span', { className: 'file-name' }, filename )
                    ])
                ])
            ])
        ])
    }

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

    const { useState: useState$1 } = React;
    const e$2 = React.createElement;

    const Form = props => {
        const [ message, setMessage ] = useState$1([ 'is-info', false ]);
        const { templates, config } = props;
        const [ formData, setFormData ] = useState$1({
            // application
            localized_timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
            , template: templates[0]
            // general
            , examiner: config.general.examiner
            , unit: config.general.unit
            , auth_type: config.general.auth_type
            // evidence
            , exam_complete: (new Date()).toISOString().split( 'T' )[0]
            , evid_receivefrom: config.evidence.evid_receivefrom
            // device information
            , defects: config.device_information.defects
            // device state
            , devstate: []
            // acquisition
            , acq_method: []
            // processing
            , proc_method: []
        });
        const [ identifiers, setIdentifiers ] = useState$1( [] );
        const [ submitting, setSubmitting ] = useState$1( false );

        const onSubmit = event => {
            event.preventDefault();

            setSubmitting( true );

            console.log( formData );

            if ( !formData.template ) formData.template = templates[0];
            
            fetch( '/generate', {
                method: 'post'
                , headers: { 'Content-Type': 'application/json' }
                , body: JSON.stringify({
                    ...formData
                    , identifiers
                })
            })
            .then( res => {
                if ( res.status == 200 ) {
                    res.json().then( data => {
                        if ( data.error ) return setMessage([ 'is-danger', `Error: ${ data.error }` ])

                        window.open( `/download/${ data.token }`, '_blank' );

                        setMessage([ 'is-success', `Report ${ data.token } complete!` ]);
                    });
                } else if ( res.status == 400 ) {
                    res.json().then( data => {
                        setMessage([ 'is-danger', `Error building report: ${ data.errors }` ]);
                    });
                } else if ( res.status == 500 ) {
                    try {
                        res.json().then( data => {
                            setMessage([ 'is-danger', `Server error: ${ data.error }` ]);
                        });
                    } catch ( err ) {
                        setMessage([ 'is-danger', 'Server error.' ]);
                    }
                } else {
                    setMessage([ 'is-danger', 'Server error.' ]);
                }

                setSubmitting( false );
            })
            .catch( err => {
                setMessage([ 'is-danger', `Unknown error: ${ err }` ]);
                setSubmitting( false );
            });
        };

        const handleIdentifierTypeChange = ( ev, identifier, idx ) => {
            let copied = [ ...identifiers ];

            copied[idx] = { ...identifier, type: ev.target.value };
            setIdentifiers( copied );
        };

        const handleIdentifierValueChange = ( ev, identifier, idx ) => {
            let copied = [ ...identifiers ];

            copied[idx] = { ...identifier, value: ev.target.value };
            setIdentifiers( copied );
        };

        const handleDeleteIdentifier = ( ev, identifier ) => {
            setIdentifiers( identifiers.filter( id => id != identifier ) );
        };

        const handleAddIdentifier = ev => {
            setIdentifiers( [ ...identifiers, { type: 'default', value: '' } ] );
        };

        const onChange = event => {
            let { name, type, value, checked } = event.target;
            let newValue = value;

            if ( type == 'checkbox' ) {
                // convert checkbox selections into arrays for their "groups"
                if ( name.endsWith( '[]' ) ) {
                    name = name.replace( /[\[\]]/g, '' );

                    if ( !formData.hasOwnProperty( name ) ) formData[name] = [];

                    newValue = [ ...formData[name] ];

                    checked
                        ? newValue.push( value )
                        : newValue = newValue.filter( ea => ea != value );
                } else {
                    value = checked;
                }
            }

            setFormData({
                ...formData
                , [name]: newValue
            });
        };

        const renderCb = cb => {
            return e$2( 'div', {}, [
                e$2( 'label', { className: 'checkbox' }, [
                    e$2( 'input', { type: 'checkbox', name: `${ cb.group }[]`, value: cb.value, checked: cb.group ? formData[cb.group].indexOf( cb.value ) >= 0 : formData[cb.value], onChange } )
                    , cb.label
                ])
                , e$2( 'br' )
            ])
        };

        return e$2( 'form', { className: 'form', onSubmit }, [
            e$2( FileParser, { name: 'fileinput', label: 'Upload Source Information', formData, setFormData, identifiers, setIdentifiers } )
            , e$2( 'div', { className: 'columns' }, [
                e$2( 'div', { className: 'column' }, [
                    e$2( 'label', { className: 'label' }, 'Document Template' )
                    , e$2( 'div', { className: 'select' }, e$2( 'select', { name: 'template', value: formData['template'] || templates[0], onChange }, templates.map( opt => e$2( 'option', { value: opt }, opt ) ) ) )
                ])
            ])
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
                    , e$2( 'div', { className: 'select' }, e$2( 'select', { name: 'unit', value: (formData['unit'] || 'mb'), onChange }, config.general.units.map( opt => e$2( 'option', { value: opt.value }, opt.label ) ) ) )
                ])
            ])
            , e$2( 'div', { className: 'columns' }, [
                e$2( 'div', { className: 'column is-3' }, [
                    e$2( 'label', { className: 'label' }, 'Authorization Type' )
                    , e$2( 'div', { className: 'select' }, e$2( 'select', { name: 'auth_type', value: (formData['auth_type'] || 'waiver'), onChange }, config.general.auth_types.map( opt => e$2( 'option', { value: opt.value }, opt.label ) ) ) )
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
                    e$2( Input, { name: 'requester', type: 'text', label: 'Requester', value: (formData['requester'] || ''), onChange } )
                ])
            ])
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
            , e$2( 'div', {}, identifiers.map( ( identifier, idx ) => {
                return e$2( 'div', { className: 'box' }, [
                    e$2( 'div', { className: 'columns' }, [
                        e$2( 'div', { className: 'column is-2' }, [
                            e$2( 'strong', { className: 'title is-4' }, `Identifier ${ idx }` )
                        ])
                        , e$2( 'div', { className: 'column is-2' }, [
                            e$2( 'label', { className: 'label' }, 'Identifier Type' )
                            , e$2( 'div', { className: 'select' }, e$2( 'select', { name: `dev_id${ idx }_type`, value: identifier.type, onChange: ev => handleIdentifierTypeChange( ev, identifier, idx ) }, config.identifiers.types.map( opt => e$2( 'option', { value: opt.value }, opt.label ) ) ) )
                        ])
                        , e$2( 'div', { className: 'column is-4' }, [
                            e$2( Input, { name: `dev_id${ idx }_val`, type: 'text', label: 'Identifier', value: identifier.value, onChange: ev => handleIdentifierValueChange( ev, identifier, idx ) } )
                        ])
                        , e$2( 'div', { className: 'column is-4' }, [
                            e$2( 'button', { className: 'button is-danger', type: 'button', onClick: ev => handleDeleteIdentifier( ev, identifier ) }, [
                                e$2( 'span', { className: 'icon' }, e$2( 'i', { className: 'fa-solid fa-trash fa-lg' } ) )
                            ])
                        ])
                    ])
                ])
            }) )
            , e$2( 'div', {}, [
                e$2( 'button', { className: 'button is-primary', type: 'button', onClick: handleAddIdentifier }, [
                    e$2( 'span', { className: 'icon' }, e$2( 'i', { className: 'fa-solid fa-plus fa-lg' } ) )
                    , e$2( 'span', {}, 'Add Identifier' )
                ])
            ])
            , e$2( 'p', { className: 'title is-3' }, 'Device State' )
            , e$2( 'div', { className: 'columns' }, e$2( 'div', { className: 'column is-3' }, config.device_state.states.map( renderCb ) ) )
            , e$2( 'div', { className: 'columns' }, [
                , e$2( 'div', { className: 'column is-4' }, [
                    e$2( Input, { name: 'devstate_locktype', type: 'text', label: 'Lock Type', value: (formData['devstate_locktype'] || ''), onChange } )
                ])
            ])
            , e$2( 'p', { className: 'title is-3' }, 'Acquisition' )
            , e$2( 'div', { className: 'columns' }, [ 0, 1, 2, 3, 4, 5, 6 ].map( colNum => e$2( 'div', { className: 'column is-narrow' }, config.acquisition.methods.filter( method => method.col == colNum ).map( renderCb ) ) ) )
            , e$2( 'div', { className: 'columns' }, [
                e$2( 'div', { className: 'column is-narrow' }, [
                    e$2( 'label', { className: 'label' }, 'Acquisition Type' )
                    , e$2( 'div', { className: 'select' }, e$2( 'select', { name: `acq_type`, value: formData['acq_type'], onChange }, config.acquisition.types.map( opt => e$2( 'option', { value: opt.value }, opt.label ) ) ) )
                ])
                , e$2( 'div', { className: 'column is-4' }, [
                    e$2( Input, { name: 'acq_notes', type: 'text', label: 'Acquisition Note', value: (formData['acq_notes'] || ''), onChange } )
                ])
                , e$2( 'div', { className: 'column is-3' }, [
                    e$2( Input, { name: 'acq_ver', type: 'text', label: 'Version', value: (formData['acq_ver'] || ''), onChange } )
                ])
                , e$2( 'div', { className: 'column is-3' }, [
                    e$2( Input, { name: 'acq_pw', type: 'text', label: 'Passcode', value: (formData['acq_pw'] || ''), onChange } )
                ])
            ])
            , e$2( 'div', { className: 'columns' }, [
                e$2( 'div', { className: 'column is-narrow' }, [
                    e$2( 'label', { className: 'label' }, 'Hash Algorithm' )
                    , e$2( 'div', { className: 'select' }, e$2( 'select', { name: `acq_hash_type`, value: formData['acq_hash_type'], onChange }, config.acquisition.hash_types.map( opt => e$2( 'option', { value: opt.value }, opt.label ) ) ) )
                ])
                , e$2( 'div', { className: 'column is-4' }, [
                    e$2( Input, { name: 'acq_hash', type: 'text', label: 'Hash', value: (formData['acq_hash'] || ''), onChange } )
                ])
            ])
            , e$2( 'p', { className: 'title is-3' }, 'Processing' )
            , e$2( 'div', { className: 'columns' }, [ 0, 1, 2, 3, 4, 5, 6 ].map( colNum => e$2( 'div', { className: 'column is-narrow' }, config.processing.methods.filter( method => method.col == colNum ).map( renderCb ) ) ) )
            , e$2( 'div', { className: 'columns' }, [
                e$2( 'div', { className: 'column is-4' }, [
                    e$2( Input, { name: 'proc_notes', type: 'text', label: 'Processing Note', value: (formData['proc_notes'] || ''), onChange } )
                ])
                , e$2( 'div', { className: 'column is-3' }, [
                    e$2( Input, { name: 'proc_ver', type: 'text', label: 'Version', value: (formData['proc_ver'] || ''), onChange } )
                ])
            ])
            , e$2( 'div', {}, [
                e$2( 'button', { className: 'button is-primary', type: 'button' }, [
                    e$2( 'span', { className: 'icon' }, e$2( 'i', { className: 'fa-solid fa-hard-drive fa-lg' } ) )
                    , e$2( 'span', {}, 'Start Related Device Report' )
                ])
            ])
            , e$2( 'div', {}, [
                e$2( 'button', { type: 'submit', className: `button is-success ${ submitting ? 'is-loading' : '' }` }, [
                    e$2( 'span', { className: 'icon' }, e$2( 'i', { className: 'fa-solid fa-file-word fa-lg' } ) )
                    , e$2( 'span', {}, 'Generate Report' )
                ])
            ])
            , message[1] ? e$2( 'article', { className: `message ${ message[0] }` }, e$2( 'div', { className: 'message-body' }, message[1] ) ) : ''
        ])
    };

    const e$1 = React.createElement;

    function Footer() {
        return e$1( 'footer', { className: 'footer' }, [
            e$1( 'div', { className: 'content has-text-centered' }, [
                e$1( 'a', { href: '/' }, 'Home' )
                , e$1( 'span', {}, ' | ' )
                , e$1( 'a', { href: '/configure' }, 'Configure' )
                , e$1( 'span', {}, ' | ' )
                , e$1( 'a', { href: '/passwords' }, 'Password List' )
                , e$1( 'span', {}, ' | ' )
                , e$1( 'a', { href: '/passwords/byowner' }, 'Passwords by Owner' )
                , e$1( 'br' )
                , e$1( 'span', {}, '© 2021 Universes Games' )
                , e$1( 'br' )
                , e$1( 'a', { href: 'mailto:rpsirois@gmail.com' }, 'Feedback' )
            ])
        ])
    }

    const { useEffect, useState } = React;
    const e = React.createElement;

    const App = props => {
        const [ loading, setLoading ] = useState( true );
        const [ templates, setTemplates ] = useState( [] );

        useEffect( () => {
            fetch( '/templates' )
            .then( res => {
                if ( !res.ok ) return setErrorMessage( 'There was a problem loading templates.' )

                res.json().then( data => {
                    setTemplates( data.files );
                    setLoading( false );
                });
            });
        }, [] );

        return e( 'div', {}, [
            e( 'div', { className: `modal ${ loading ? 'is-active' : '' }` }, [
                e( 'div', { className: 'modal-background' } )
                , e( 'div', { className: 'modal-content' }, e( 'figure', { className: 'image is-64x64 container' }, e( 'img', { src: '/img/gear.png', alt: 'Loading...' } ) ) )
            ])
            , e( 'section', { className: 'section' }, [
                e( 'h1', { className: 'title' }, 'DFU Report Builder' )
                , e( 'h2', { className: 'subtitle' }, 'Drop source files on this window to autopopulate data entry form.' )
                , e( 'div', { className: 'container' }, e( Form, { templates, config } ) )
            ])
            , e( Footer )
        ])
    };

    ReactDOM.render( React.createElement( App ), document.getElementById( 'root' ) );

})();
//# sourceMappingURL=app.js.map
