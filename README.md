# sentinel
Watches a folder and does things when criteria is met.

## Setting up as a service

Sentinel can run as a service using many daemon managers. Here are some recommendations:

### windows
nssm

### Linux / Mac
forever

## Configuration
Sentinel can be configured using JSON or YML files. You can specify where it should get it's config
by setting the environment variable ```NODE_CONFIG_DIR``` to the folder your configuration file is
located, otherwise Sentinel will look for a folder called config in the root of it's current folder.

### Configuration options

Examples are given in YML for simplicity.

