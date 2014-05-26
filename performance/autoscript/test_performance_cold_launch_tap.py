# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.

# Approximate runtime per 100 iterations: 40 minutes

import time

from gaiatest import GaiaTestCase

from gaiatest.apps.phone.app import Phone
from gaiatest.apps.messages.app import Messages
from gaiatest.apps.contacts.app import Contacts
from gaiatest.apps.browser.app import Browser
from gaiatest.apps.homescreen.app import Homescreen

from gaiatest.apps.camera.app import Camera
from gaiatest.apps.gallery.app import Gallery
from gaiatest.apps.fmradio.app import FmRadio
from gaiatest.apps.settings.app import Settings


class TestAppColdLaunch(GaiaTestCase):

    def setUp(self):
        GaiaTestCase.setUp(self)
        # self.connect_to_network()
        # curr_time = repr(time.time()).replace('.', '')

    def test_App_Cold_Launch(self):

        time.sleep (10)

        # Launch Dailer app (Location : 0-1)
        dialer_app_name = 'Phone'
        homescreen = Homescreen(self.marionette)
        self.apps.switch_to_displayed_app()
        self.assertTrue(homescreen.is_app_installed(dialer_app_name))
        dialer = homescreen.installed_app(dialer_app_name)
        dialer.tap_icon()
        time.sleep (5)
        self.device.touch_home_button()
        time.sleep (5)

        # Launch Messages app (Location : 0-2)
        msg_app_name = 'Messages'
        homescreen = Homescreen(self.marionette)
        self.apps.switch_to_displayed_app()
        self.assertTrue(homescreen.is_app_installed(msg_app_name))
        messages = homescreen.installed_app(msg_app_name)
        messages.tap_icon()
        time.sleep (5)
        self.device.touch_home_button()
        time.sleep (5)

        # Launch Contacts app (Location : 0-3)
        contacts_app_name = 'Contacts'
        homescreen = Homescreen(self.marionette)
        self.apps.switch_to_displayed_app()
        self.assertTrue(homescreen.is_app_installed(contacts_app_name))
        contacts = homescreen.installed_app(contacts_app_name)
        contacts.tap_icon()
        time.sleep (5)
        self.device.touch_home_button()
        time.sleep (5)

        # Launch Browser app (Location : 0-4)
        browser_app_name = 'Browser'
        homescreen = Homescreen(self.marionette)
        self.apps.switch_to_displayed_app()
        self.assertTrue(homescreen.is_app_installed(browser_app_name))
        browser = homescreen.installed_app(browser_app_name)
        browser.tap_icon()
        time.sleep (5)
        self.device.touch_home_button()
        time.sleep (5)

        # Launch Camera app (Location : 1-1)
        camera_app_name = 'Camera'
        homescreen = Homescreen(self.marionette)
        self.apps.switch_to_displayed_app()
        self.assertTrue(homescreen.is_app_installed(camera_app_name))
        camera = homescreen.installed_app(camera_app_name)
        camera.tap_icon()
        time.sleep (5)
        self.device.touch_home_button()
        time.sleep (5)

        # Launch Gallery app (Location : 1-2)
        gallery_app_name = 'Gallery'
        homescreen = Homescreen(self.marionette)
        self.apps.switch_to_displayed_app()
        self.assertTrue(homescreen.is_app_installed(gallery_app_name))
        gallery = homescreen.installed_app(gallery_app_name)
        gallery.tap_icon()
        time.sleep (5)
        self.device.touch_home_button()
        time.sleep (5)

        # Launch FM Radio app (Location : 1-3)
        fmradio_app_name = 'FM Radio'
        homescreen = Homescreen(self.marionette)
        self.apps.switch_to_displayed_app()
        self.assertTrue(homescreen.is_app_installed(fmradio_app_name))
        fmradio = homescreen.installed_app(fmradio_app_name)
        fmradio.tap_icon()
        time.sleep (5)
        self.device.touch_home_button()
        time.sleep (5)

        # Launch Settings app (Location : 1-4)
        settings_app_name = 'Settings'
        homescreen = Homescreen(self.marionette)
        self.apps.switch_to_displayed_app()
        self.assertTrue(homescreen.is_app_installed(settings_app_name))
        settings = homescreen.installed_app(settings_app_name)
        settings.tap_icon()
        time.sleep (5)
        self.device.touch_home_button()
        time.sleep (5)

        # Launch Marketplace app (Location : 2-1)
        mktplace_app_name = 'Marketplace'
        homescreen = Homescreen(self.marionette)
        self.apps.switch_to_displayed_app()
        self.assertTrue(homescreen.is_app_installed(mktplace_app_name))
        marketplace = homescreen.installed_app(mktplace_app_name)
        marketplace.tap_icon()
        time.sleep (5)
        self.device.touch_home_button()
        time.sleep (5)

        # Launch Calendar app (Location : 2-2)
        calendar_app_name = 'Calendar'
        homescreen = Homescreen(self.marionette)
        self.apps.switch_to_displayed_app()
        self.assertTrue(homescreen.is_app_installed(calendar_app_name))
        calendar = homescreen.installed_app(calendar_app_name)
        calendar.tap_icon()
        time.sleep (5)
        self.device.touch_home_button()
        time.sleep (5)

        # Launch Clock app (Location : 2-3)
        clock_app_name = 'Clock'
        homescreen = Homescreen(self.marionette)
        self.apps.switch_to_displayed_app()
        self.assertTrue(homescreen.is_app_installed(clock_app_name))
        clock = homescreen.installed_app(clock_app_name)
        clock.tap_icon()
        time.sleep (5)
        self.device.touch_home_button()
        time.sleep (5)

        # Launch Usage app (Location : 2-4)
        usage_app_name = 'Usage'
        homescreen = Homescreen(self.marionette)
        self.apps.switch_to_displayed_app()
        self.assertTrue(homescreen.is_app_installed(usage_app_name))
        usage = homescreen.installed_app(usage_app_name)
        usage.tap_icon()
        time.sleep (5)
        self.device.touch_home_button()
        time.sleep (5)

        # Launch E-mail app (Location : 3-1)
        email_app_name = 'E-Mail'
        homescreen = Homescreen(self.marionette)
        self.apps.switch_to_displayed_app()
        self.assertTrue(homescreen.is_app_installed(email_app_name))
        email = homescreen.installed_app(email_app_name)
        email.tap_icon()
        time.sleep (5)
        self.device.touch_home_button()
        time.sleep (5)

        # Launch Music app (Location : 3-2)
        music_app_name = 'Music'
        homescreen = Homescreen(self.marionette)
        self.apps.switch_to_displayed_app()
        self.assertTrue(homescreen.is_app_installed(music_app_name))
        music = homescreen.installed_app(music_app_name)
        music.tap_icon()
        time.sleep (5)
        self.device.touch_home_button()
        time.sleep (5)

        # Launch Video app (Location : 3-3)
        video_app_name = 'Video'
        homescreen = Homescreen(self.marionette)
        self.apps.switch_to_displayed_app()
        self.assertTrue(homescreen.is_app_installed(video_app_name))
        video = homescreen.installed_app(video_app_name)
        video.tap_icon()
        time.sleep (5)
        self.device.touch_home_button()
        time.sleep (5)





