# sentinel
Watches a folder and does things when criteria is met.

## Setting up as a service

Sentinel can run as a service using many daemon managers. Here are some recommendations:

### windows
nssm

### Linux / Mac
forever

## Configuration
Sentinel can be configured using JSON, JSON5, YML or even JavaScript files for configuration.
You specifiy the input format by simply naming your default config file with the respective
extension (.json, .json5, .yml or .js).

You can specify where Sentinel should get it's config by setting the environment variable
```SENTINEL_CONFIG_DIR``` to the folder your configuration file is located, otherwise Sentinel will
look for a folder called config in the root of it's current folder.

## Container and orchistration considerations
Because Sentinel can get configuration from anywhere, you can simply provide it a config dir through
docker environment settings, but Sentinel can go further than that.  If you specify a standard 
```NODE_ENV``` environment variable, you can also tell sentinel to switch config between specific
environment configurations within an indentical configuration folder shared throughout your
platform.

For example, if you set ```NODE_ENV``` to 'production' sentinel will look for a config file called
'production', if you set it to 'development' ir will look for a file called 'development', and so
forth.  In this way, you can both configure Sentinel instances to configure themselves differently
through the environment and distribute identical files (using ```NODE_ENV```) or just use different
folders through ```SENTINEL_CONFIG_DIR```.  It's up to you.

## Debuggging
Sentinel supports extensive debugging in case something goes wrong.  Configure debugging through
the ```DEBUG``` environment variable, or set the debug path in configuration options.

If you set the debug path to "*", everything that happens will be outputted.  If you only want to
log a particular set of events, use wildcards.  For example, if you only want to debug sentinel
watch functions, use "sentinel:watch:*".  If you only want to watch sentinel triggers, use
"sentinel:trigger:*", etc. Here is a complete list of debug paths and what they do...

#### sentinel
Any application level events like loading, starting and stopping.

#### sentinel:watch
Any watch events that took place

## Configuration options

Examples are given in YML for simplicity.

