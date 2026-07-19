# RawAccel Profile Manager

RawAccel Profile Manager is an application for centralized management of RawAccel profiles on Windows, integrated into the standard mouse tuning workflow.

## System Requirements

- Application settings directory: `%APPDATA%\RawAccelProfileManager`.
- RawAccel must be installed before using the application.
- On first launch, the initial setup Wizard guides the user through the required configuration steps.

## How It Works

1. To create or edit a profile, the application launches a child RawAccel window.
2. The corresponding profile (or a new profile template) is passed to RawAccel.
3. The user makes changes in the RawAccel UI and closes the window.
4. After the window is closed, the changes are automatically read and saved in RawAccel Profile Manager.

This provides editing through the native RawAccel interface while keeping profile storage and management centralized in one place.

## Automatic Profile Switching

- You can bind a specific profile to a specific application (for example, `cs2.exe -> CS2 Fast`).
- RawAccel Profile Manager tracks the start and exit of target processes.
- When a bound application starts, the corresponding profile is applied automatically.
- When the application exits, the default profile is applied automatically.

This mechanism removes the need for manual switching and ensures the correct settings are applied for each usage scenario.

## User Benefits

- Centralized storage of RawAccel profiles.
- Simplified profile creation, editing, and reuse.
- Near-seamless integration with RawAccel for precise tuning.
- Automatic profile application based on the active application.

## Author

Dmitry Osin <d@osin.pro>

Repository: `https://github.com/dmitry-osin/rawaccel-profile-manager`

## License

This project is licensed under the GNU Affero General Public License v3.0 (or any later version).

License text: [`LICENSE`](./LICENSE)
