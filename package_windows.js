const electronInstaller = require( 'electron-winstaller' )

async function packageForWindows() {
    try {
        await electronInstaller.createWindowsInstaller({
            appDirectory: '.'
            , outputDirectory: './build/windows'
            , iconUrl: './ico.ico'
        })
    } catch( err ) {
        console.log( err )
    }
}

packageForWindows()
