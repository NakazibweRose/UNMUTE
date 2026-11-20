from django.test import SimpleTestCase

from ussd.views import ussd_menu


class UssdMenuTests(SimpleTestCase):
    def test_first_screen_asks_language(self):
        self.assertIn('1. English', ussd_menu(''))

    def test_english_main_menu(self):
        self.assertIn('Learn UgSL', ussd_menu('1'))

    def test_luganda_main_menu(self):
        self.assertIn('Yiga UgSL', ussd_menu('2'))

    def test_lesson_is_terminal(self):
        out = ussd_menu('1*1*1')
        self.assertTrue(out.startswith('END'))
        self.assertIn('Greetings', out)

    def test_back_returns_to_main_menu_with_option_5(self):
        out = ussd_menu('1*1*0')
        self.assertTrue(out.startswith('CON'))
        self.assertIn('5. Change language', out)

    def test_change_language_switches_and_returns_to_main(self):
        # EN main -> 5 (change) -> 2 (Luganda) -> Luganda main menu.
        # This path was dead code before the fix.
        out = ussd_menu('1*5*2')
        self.assertTrue(out.startswith('CON'))
        self.assertIn('Yiga UgSL', out)

    def test_invalid_selection(self):
        self.assertTrue(ussd_menu('9').startswith('END'))
