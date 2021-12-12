const electronInstaller = require( 'electron-winstaller' )

async function packageForWindows() {
    try {
        await electronInstaller.createWindowsInstaller({
            appDirectory: './Digital Forensics Report Builder-win32-x64'
            , outputDirectory: './build/windows'
            , iconUrl: './ico.ico'
        })
    } catch( err ) {
        console.log( err )
    }
}

packageForWindows()
