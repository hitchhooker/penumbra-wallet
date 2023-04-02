#!/bin/bash

if ! [ -x "$(command -v cairosvg)" ]; then
	echo 'Error: cairosvg is not installed.' >&2
	echo 'Please install cairosvg using pip install cairosvg' >&2
	exit 1
fi

curl https://raw.githubusercontent.com/hitchhooker/antumbra/main/public/antumbra.svg --output penumbra-logo.svg

# Generate icons with black background using cairosvg
cairosvg penumbra-logo.svg -o icon16.png -W 16 -H 16 --output-width 16
cairosvg penumbra-logo.svg -o icon48.png -W 48 -H 48 --output-width 48
cairosvg penumbra-logo.svg -o icon128.png -W 128 -H 128 --output-width 128
