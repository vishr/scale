# Scale
A load balancer

## Features
* Supports http and https protocols

## Installation
```sh
  $ npm i gat -g
```

## Usage
```sh
  $ gat -h
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
```

## Configuration
```sh
  $ scale -e config

```yaml
  servers:
  - name: s1
    protocol: http
    hostname: httpbin.org
  - name: s2
    protocol: http
    hostname: stackoverflow.com
  - name: s3
    protocol: https
    hostname: github.com
  technique: random
  root: /Users/vrana/.scale
  port: 4141
```