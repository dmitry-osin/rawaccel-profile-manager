# RawAccel Profile Manager

[![Release](https://github.com/dmitry-osin/rawaccel-profile-manager/actions/workflows/release.yml/badge.svg)](https://github.com/dmitry-osin/rawaccel-profile-manager/actions/workflows/release.yml)

RawAccel Profile Manager is application that allows to manage RawAccel profiles and auto-switch profiles depends on
running application.

## Demo

![demo.gif](demo.gif)

## Important Things

- Application settings directory: `%APPDATA%\RawAccelProfileManager`.
- RawAccel must be installed before using the application also RawAccel Profile Manager will guide you through the all
  process from scratch.

## How It Works

1. To create or edit a profile, the application launches a child RawAccel window.
2. RawAccel Profile Manager passes concrete profile (or a new profile template) to RawAccel directory.
3. The user makes changes in the RawAccel UI and closes the window.
4. After RawAccel window is closed, RawAccel Profile Manager saved new version of config to own config storage.

This approach avoid any issues and inconsistent state of RawAccel config. Also it allows to bump version of RawAccel
original version and do not meet any issues with new config format.

## Automatic Profile Switching

- You can bind a specific profile to a specific application (for example, `cs2.exe -> CS2 Fast`).
- RawAccel Profile Manager watches start and exit of target processes.
- When a bound application starts corresponding profile is applied automatically.
- When the application exits, the default profile is applied automatically.

This mechanism removes the need for manual switching and ensures the correct settings are applied for each usage
scenario.

## Author

Dmitry Osin <d@osin.pro>

Repository: `https://github.com/dmitry-osin/rawaccel-profile-manager`

## License

This project is licensed under the GNU Affero General Public License v3.0 (or any later version).

License text: [`LICENSE`](./LICENSE)
