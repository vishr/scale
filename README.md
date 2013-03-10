# Scale
A load balancer

## Features
* Supports http and https protocols

## Installation
```sh
  $ npm i scale -g
```

## Usage
```sh
  $ scale -h
    Usage: scale [options] [command]

    Commands:

      config                 show config
      start                  start scale
      stop                   stop scale
      restart                restart scale
      *                      unknown command

    Options:

      -h, --help     output usage information
      -V, --version  output the version number
      -e, --edit     edit config

  $ scale start
  info: starting scale on port 4141

  $ scale config      # show config

  $ scale -e config   # edit config
```

## Configuration
```yaml
  # Root directory to store scale data
  root: $HOME/.scale

  # Port on which scale runs
  port: 1431

  # List of servers to balance load
  servers:
    - name:
      protocol:   # http/https
      hostname:
      port:

  # Routing technique
  technique:    # random/roundrobin
```

**Example** config.yml
```yaml
  servers:
    - name: s1
      protocol: http
      hostname: httpbin.org
    - name: s2
      protocol: http
      hostname: stackoverflow.com
    - name: s3
      protocol: http
      hostname: www.yahoo.com
  technique: random
```

## Caveats
* Scale is in very very early stage, please use is just for testing and development, seriously!