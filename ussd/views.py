from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt


def response(message):
    return HttpResponse(message, content_type='text/plain')


@csrf_exempt
def ussd_callback(request):
    if request.method != 'POST':
        return response('END Invalid request.')

    text = request.POST.get('text', '').strip()

    # First screen: choose language
    if text == '':
        return response(
            'CON Welcome to UNMUTE!\n'
            '1. English\n'
            '2. Luganda'
        )

    inputs = text.split('*')

    # Language selection
    if inputs[0] == '1':
        language = 'EN'
    elif inputs[0] == '2':
        language = 'LG'
    else:
        return response('END Invalid selection. Please try again.')

    # Main menu
    if len(inputs) == 1:
        if language == 'EN':
            return response(
                'CON Welcome to UNMUTE!\n'
                '1. Learn UgSL\n'
                '2. Communication help\n'
                '3. Learning support\n'
                '4. About UNMUTE\n'
                '5. Change language'
            )

        return response(
            'CON Tukwanirizza ku UNMUTE!\n'
            '1. Yiga UgSL\n'
            '2. Obuyambi mu mpuliziganya\n'
            '3. Obuyambi mu kuyiga\n'
            '4. Ebikwata ku UNMUTE\n'
            '5. Kyusa olulimi'
        )

    # Change language
    if inputs[1] == '5':
        return response(
            'CON Choose language\n'
            '1. English\n'
            '2. Luganda'
        )

    # Language change
    if inputs[0] == '1' and inputs[1] == '5':
        if len(inputs) == 2:
            return response(
                'CON Choose language\n'
                '1. English\n'
                '2. Luganda'
            )

        if inputs[2] == '1':
            return response(
                'CON Welcome to UNMUTE!\n'
                '1. Learn UgSL\n'
                '2. Communication help\n'
                '3. Learning support\n'
                '4. About UNMUTE'
            )

        if inputs[2] == '2':
            return response(
                'CON Tukwanirizza ku UNMUTE!\n'
                '1. Yiga UgSL\n'
                '2. Obuyambi mu mpuliziganya\n'
                '3. Obuyambi mu kuyiga\n'
                '4. Ebikwata ku UNMUTE'
            )

    # Learn UgSL
    if inputs[1] == '1':
        if len(inputs) == 2:
            if language == 'EN':
                return response(
                    'CON Learn UgSL:\n'
                    '1. Greetings\n'
                    '2. Family\n'
                    '3. School\n'
                    '4. Community\n'
                    '0. Back'
                )

            return response(
                'CON Yiga UgSL:\n'
                '1. Okulamusa\n'
                '2. Amaka\n'
                '3. Essomero\n'
                '4. Ekitundu\n'
                '0. Ddayo'
            )

        if inputs[2] == '0':
            return response(
                'CON 1. Learn UgSL\n'
                '2. Communication help\n'
                '3. Learning support\n'
                '4. About UNMUTE'
            )

        lessons = {
            '1': ('Greetings', 'Okulamusa'),
            '2': ('Family', 'Amaka'),
            '3': ('School', 'Essomero'),
            '4': ('Community', 'Ekitundu'),
        }

        lesson = lessons.get(inputs[2])

        if lesson:
            if language == 'EN':
                return response(
                    f'END {lesson[0]} lesson is available on '
                    'the UNMUTE learning platform. '
                    'Visit the platform to watch UgSL videos '
                    'and practise.'
                )

            return response(
                f'END Essomo {lesson[1]} lisangibwa ku UNMUTE. '
                'Genda ku mukutu gwa UNMUTE okulaba vidiyo '
                'n’okwegezaamu.'
            )

    # Communication help
    if inputs[1] == '2':
        if language == 'EN':
            return response(
                'END Communication tip: Be patient, face the '
                'person, maintain visual attention and use '
                'clear gestures or writing when needed.'
            )

        return response(
            'END Mu mpuliziganya: Ba mugumiikiriza, '
            'yolekera omuntu, mukwatagane amaaso era '
            'kozesa obubonero oba okuwandiika bwe kiba kyetaagisa.'
        )

    # Learning support
    if inputs[1] == '3':
        if language == 'EN':
            return response(
                'END UNMUTE supports learning through UgSL '
                'videos, lessons, practice and accessible '
                'communication resources.'
            )

        return response(
            'END UNMUTE eyamba okuyiga ng’eyita mu vidiyo '
            'za UgSL, amasomo, okwegezaamu n’ebikozesebwa '
            'mu mpuliziganya.'
        )

    # About UNMUTE
    if inputs[1] == '4':
        if language == 'EN':
            return response(
                'END UNMUTE: Every voice. Every sign. '
                'Every story. We promote inclusive learning '
                'and communication for Deaf and hearing communities.'
            )

        return response(
            'END UNMUTE: Buli ddoboozi. Buli kabonero. '
            'Buli lugero. Tuyamba abantu okuyiga n’empuliziganya '
            'nga bonna bali mu kifo ekimu.'
        )

    return response('END Invalid selection. Please try again.')