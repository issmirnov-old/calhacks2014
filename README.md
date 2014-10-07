# Jarvis

## Installation

1. Clone the repo
2. Install mraa: `echo "src mraa-upm http://iotdk.intel.com/repos/1.1/intelgalactic" > /etc/opkg/mraa-upm.conf; opkg update; opkg install libmraa0`
3. run npm install in the cloned folder
4. run with `nodemon main.js localhost 80`

Note - if port in use, disable default edison site. Last line in `/usr/lib/edison_config_tools/edison-config-server.js`



## The Idea

I have long been fascinated with the concept of a smart, networked personal assistant. An ideal system would intelligently respond to non hard coded voice commands, understand what I want, and perform the action. I knew I would have to get my feet wet and dive into hardware for this one.

## The Challenge

I've always been a software dev, experimenting with different parts of the stack, but never dropping down into hardware. As such, this was a challenging experience. All of my team mates had urgent work come up, so I worked alone. I had to learn how to use an intel Edison, teach myself NodeJS, and figure out how to network all the participating devices and parts to make it work.

## The Implementation

The system works as follows: I speak into my Android Wear device (Moto 360), and that voice command eventually triggers a desired action. As of right now, this means controlling power to three 120v devices.

### The Flow

1. I speak a phrase into my watch
2. AutoVoice catches it and triggers a tasker Task
3. Tasker initiates a HTTP POST to my node js server on the edison
4. The edison takes the request and sends it to wit.ai for processing
5. Once a result is back, the intent is extracted and a function called to process it
6. Depending on the intent, a different relay is switched on or off, allowing control of a 120V device.