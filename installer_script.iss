; Inno Setup Installer Script for MAXX OS
[Setup]
AppName=MAXX OS
AppVersion=1.0.0
DefaultDirName={autopf}\MAXX OS
DefaultGroupName=MAXX OS
OutputDir=dist
OutputBaseFilename=MAXX_OS_Setup
Compression=lzma
SolidCompression=yes
ArchitecturesInstallIn64BitMode=x64

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked

[Files]
Source: "dist\app\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs

[Icons]
Name: "{group}\MAXX OS"; Filename: "{app}\MAXX_OS.exe"
Name: "{autodesktop}\MAXX OS"; Filename: "{app}\MAXX_OS.exe"; Tasks: desktopicon

[Run]
Filename: "{app}\MAXX_OS.exe"; Description: "{cm:LaunchProgram,MAXX OS}"; Flags: nowait postinstall skipifsilent
