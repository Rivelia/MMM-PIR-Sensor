/* global Module */

/* Magic Mirror
 * Module: MMM-PIR-Sensor
 *
 * By Paul-Vincent Roll http://paulvincentroll.com
 * MIT Licensed.
 */

Module.register('MMM-PIR-Sensor', {
	requiresVersion: '2.1.0',
	defaults: {
		sensorPin: 22,
		sensorState: 1,
		relayPin: false,
		relayState: 1,
		alwaysOnPin: false,
		alwaysOnState: 1,
		alwaysOffPin: false,
		alwaysOffState: 1,
		powerSaving: true,
		powerSavingOnDelay: 0,
		powerSavingOffDelay: 0,
		powerSavingNotification: false,
		powerSavingMessage: 'Monitor will be turn Off by PIR module',
		presenceIndicator: 'fa-bullseye',
		presenceIndicatorColor: 'red',
		presenceOffIndicator: null,
		presenceOffIndicatorColor: 'dimgray',
		runSimulator: false,
		hideModules: false,
	},

	userPresence: false,

	getStyles: function () {
		return ['font-awesome.css', 'MMM-PIR-Sensor.css'];
	},

	getDom: function () {
		var wrapper = document.createElement('i');
		if (this.userPresence) {
			if (
				this.config.presenceIndicator &&
				this.config.presenceIndicatorColor
			) {
				wrapper.className = 'fas ' + this.config.presenceIndicator;
				wrapper.style =
					'color: ' + this.config.presenceIndicatorColor + ';';
			}
		} else {
			if (
				this.config.presenceOffIndicator &&
				this.config.presenceOffIndicatorColor
			) {
				wrapper.className = 'fas ' + this.config.presenceOffIndicator;
				wrapper.style =
					'color: ' + this.config.presenceOffIndicatorColor + ';';
			}
		}
		return wrapper;
	},

	// Override socket notification handler.
	socketNotificationReceived: function (notification, payload) {
		switch (notification) {
			case 'USER_PRESENCE':
				this.userPresence = payload;
				this.sendNotification(notification, payload);
				if (
					payload === false &&
					this.config.powerSavingNotification === true
				) {
					this.sendNotification('SHOW_ALERT', {
						type: 'notification',
						message: this.config.powerSavingMessage,
					});
				}
				this.updateDom();
				break;
			case 'SHOW_ALERT':
				this.sendNotification(notification, payload);
				break;
			case 'SCREEN_HIDE':
				document.body.classList.add('screenHide');
				break;
			case 'SCREEN_SHOW':
				document.body.classList.remove('screenHide');
				break;
		}
	},

	notificationReceived: function (notification, payload) {
		if (notification === 'SCREEN_WAKEUP') {
			this.sendSocketNotification(notification, payload);
		}
	},

	start: function () {
		this.sendSocketNotification('CONFIG', this.config);
		Log.info('Starting module: ' + this.name);
	},
});
