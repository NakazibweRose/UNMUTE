from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt


WELCOME = (
    'CON Welcome to UNMUTE!\n'
    '1. English\n'
    '2. Luganda'
)

MAIN_MENU = {
    'EN': (
        'CON Welcome to UNMUTE!\n'
        '1. Learn UgSL\n'
        '2. Communication help\n'
        '3. Learning support\n'
        '4. About UNMUTE\n'
        '5. Change language'
    ),
    'LG': (
        'CON Tukwanirizza ku UNMUTE!\n'
        '1. Yiga UgSL\n'
        '2. Obuyambi mu mpuliziganya\n'
        '3. Obuyambi mu kuyiga\n'
        '4. Ebikwata ku UNMUTE\n'
        '5. Kyusa olulimi'
    ),
}

LEARN_MENU = {
    'EN': (
        'CON Learn UgSL:\n'
        '1. Greetings\n'
        '2. Family\n'
        '3. School\n'
        '4. Community\n'
        '0. Back'
    ),
    'LG': (
        'CON Yiga UgSL:\n'
        '1. Okulamusa\n'
        '2. Amaka\n'
        '3. Essomero\n'
        '4. Ekitundu\n'
        '0. Ddayo'
    ),
}

# token -> (English name, Luganda name)
LESSONS = {
    '1': ('Greetings', 'Okulamusa'),
    '2': ('Family', 'Amaka'),
    '3': ('School', 'Essomero'),
    '4': ('Community', 'Ekitundu'),
}

# Main-menu items that end the session with an info message.
INFO = {
    '2': {  # Communication help
        'EN': (
            'END Communication tip: Be patient, face the person, '
            'maintain visual attention and use clear gestures or '
            'writing when needed.'
        ),
        'LG': (
            'END Mu mpuliziganya: Ba mugumiikiriza, yolekera omuntu, '
            'mukwatagane amaaso era kozesa obubonero oba okuwandiika '
            'bwe kiba kyetaagisa.'
        ),
    },
    '3': {  # Learning support
        'EN': (
            'END UNMUTE supports learning through UgSL videos, lessons, '
            'practice and accessible communication resources.'
        ),
        'LG': (
            'END UNMUTE eyamba okuyiga ng’eyita mu vidiyo za UgSL, '
            'amasomo, okwegezaamu n’ebikozesebwa mu mpuliziganya.'
        ),
    },
    '4': {  # About UNMUTE
        'EN': (
            'END UNMUTE: Every voice. Every sign. Every story. '
            'We promote inclusive learning and communication for '
            'Deaf and hearing communities.'
        ),
        'LG': (
            'END UNMUTE: Buli ddoboozi. Buli kabonero. Buli lugero. '
            'Tuyamba abantu okuyiga n’empuliziganya nga bonna bali '
            'mu kifo ekimu.'
        ),
    },
}

INVALID = 'END Invalid selection. Please try again.'


def _lesson_message(token, language):
    name = LESSONS[token][0 if language == 'EN' else 1]
    if language == 'EN':
        return (
            f'END {name} lesson is available on the UNMUTE learning '
            'platform. Visit the platform to watch UgSL videos and practise.'
        )
    return (
        f'END Essomo {name} lisangibwa ku UNMUTE. Genda ku mukutu gwa '
        'UNMUTE okulaba vidiyo n’okwegezaamu.'
    )


def ussd_menu(text):
    """Pure USSD state machine: '*'-joined input history -> response string.

    USSD is stateless, so the full input history is replayed each call.
    Walking it token by token (instead of indexing inputs[0]/inputs[1])
    makes 'Change language' truly reset to language selection and come
    back to the main menu in the newly chosen language.
    """
    parts = text.split('*') if text else []

    language = 'EN'
    screen = 'LANG'

    for token in parts:
        if screen == 'LANG':
            if token == '1':
                language, screen = 'EN', 'MAIN'
            elif token == '2':
                language, screen = 'LG', 'MAIN'
            else:
                return INVALID
        elif screen == 'MAIN':
            if token == '1':
                screen = 'LEARN'
            elif token == '5':
                screen = 'LANG'
            elif token in INFO:
                return INFO[token][language]
            else:
                return INVALID
        elif screen == 'LEARN':
            if token == '0':
                screen = 'MAIN'
            elif token in LESSONS:
                return _lesson_message(token, language)
            else:
                return INVALID

    if screen == 'MAIN':
        return MAIN_MENU[language]
    if screen == 'LEARN':
        return LEARN_MENU[language]
    return WELCOME


@csrf_exempt
def ussd_callback(request):
    if request.method != 'POST':
        return HttpResponse('END Invalid request.', content_type='text/plain')

    text = request.POST.get('text', '').strip()
    return HttpResponse(ussd_menu(text), content_type='text/plain')
