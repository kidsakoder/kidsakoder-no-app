# Kidsakoder.no

Kidsakoder.no is based on the [Enonic XP platform](http://xp.readthedocs.io/en/stable/).

# Installation requirements
To run this site locally, you will have to install [Docker](https://docs.docker.com/install/) and [Docker Compose](https://docs.docker.com/compose/install/).

[Git](https://git-scm.com/) is also required, for setup of and contributing to this project.

# Installation
There are predefined scripts for initializing, running the Enonic Server and deploying this site as an Enonic XP app locally. These scripts require a unix shell. Please refer to the official [Docker documentation for Enonic XP](http://xp.readthedocs.io/en/stable/getstarted/docker.html) for installing these containers without using these scripts.

## Linux
Just use your terminal and distro of choice.

## Mac
[iTerm2](https://www.iterm2.com/) is recommended for Mac, but the default terminal works just as fine for running this project.

## Windows
It is recommended to install a unix-like shell for Windows, e.g. [Windows Subsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl/install-win10) (official from Microsoft), [Cygwin](https://cygwin.com/install.html) or [Babun](http://babun.github.io/) (Babun is pre-configured Cygwin with additional packages).

# Setup
- Start Docker
- Open your shell and do the following steps:
    1. Navigate to the root folder for this project
    2. Initialize: `./scripts/init.sh` or `make init`
    3. Start the server: `./scripts/run.sh` or `make start`
    4. Deploy / redeploy the kidsakoder.no app `./scripts/redeploy.sh` or `make restart`

Rerun step 4 to apply changes in the kidsakoder.no app, and run the following to apply changes to the server or docker config:
1. Stop the server: `./scripts/stop.sh` or `make stop`
2. Restart the server: `./scripts/run.sh` or `make restart`

To clean the project, use `make clean`.

# Run tests

```bash
make test
```
