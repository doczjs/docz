#!/usr/bin/env node

const { cp, rm, mkdir } = require('shelljs')

const DIST = 'dist/'

rm('-rf', DIST)
mkdir('-p', DIST)
cp('-R', 'templates/', DIST)
