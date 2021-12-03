export default {
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
}
