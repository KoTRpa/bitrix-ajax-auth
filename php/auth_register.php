<?require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/modules/main/include/prolog_before.php");?>
<?define("NO_KEEP_STATISTIC", true);?>

<?
/**
 * error codes:
 * 10 - something wrong whith service input ($_REQUEST is empty or $_REQUEST['mode'] is undefined etc.)
 * 11 - user already authorized
 * 12 - user input incorrect, additional output 'fields' required
 * 13-19 reserved
 * >=20 - it's your own =)
 */

// xss check
if (!isset($_REQUEST['sessid']) || empty($_REQUEST['sessid']) || !check_bitrix_sessid())
    json_exit(array('success' => false, 'error' => 'wrong sessid', 'error_code' => 10));

// mode check
if (!isset($_REQUEST['mode']) || empty($_REQUEST['mode']))
    json_exit(array('success' => false, 'error' => 'empty mode', 'error_code' => 10));

// exit if user is authorized
if($USER->IsAuthorized())
    json_exit(array('success' => false, 'error' => 'auth already', 'error_code' => 11));

// dermine what action perform
switch ($_REQUEST['mode'])
{
    // auth
    case 'auth':
        // exit if no credentials (login and password)
        if (!isset($_POST['login']) || !isset($_POST['password']) || empty($_POST['login']) || empty($_POST['password']))
        {
            $empty_fields = array();
            if (!isset($_POST['login']) || empty($_POST['login']))
                $empty_fields[] = 'login';
            
            if (!isset($_POST['password']) || empty($_POST['password']))
                $empty_fields[] = 'password';

            json_exit(array('success' => false, 'error' => 'Не заполнены поля', 'error_code' => 12, 'fields' => $empty_fields));
        }

        // try to auth user
        $user = $USER->Login($_POST['login'], $_POST['password']);

        if ($user === true) // user exist, password ok, can proceed
            json_exit(array('success' => true));
        else // something went wrong. exit with error message (login or password incorrect)
            json_exit(array(
                'success' => false, 
                'error' => strip_tags($user['MESSAGE']), 
                'error_code' => 12, 
                'fields' => array('login', 'password'), 
                'user' => $user,
            ));

        break;

    // register
    case 'register':
        // check all credentials
        if (!isset($_POST['login']) || !isset($_POST['password']) || !isset($_POST['password_confirm']) 
                    || empty($_POST['login']) || empty($_POST['password']) || empty($_POST['password_confirm'])
                    || $_POST['password'] !== $_POST['password_confirm'])
        {
            $empty_fields = array();

            // check login not empty
            if (!isset($_POST['login']) || empty($_POST['login']))
                $empty_fields[] = 'login';
            
            // check password not empty
            if (!isset($_POST['password']) || empty($_POST['password']))
                $empty_fields[] = 'password';

            // check password_confirm not empty and equals to password
            if (!isset($_POST['password_confirm']) || empty($_POST['password_confirm']) || $_POST['password'] !== $_POST['password_confirm'])
                $empty_fields[] = 'password_confirm';

            json_exit(array(
                'success' => false, 
                'error' => 'Исправьте ошибки в подсвеченных полях!', 
                'error_code' => 12, 
                'fields' => $empty_fields
            ));
        }

        // try to register user. if success user automatic authorized 
        // and site admin recieve a mail
        $user = $USER->Register(
            $_POST['login'], // string USER_LOGIN,
            '', // string USER_NAME,
            '', // string USER_LAST_NAME,
            $_POST['password'], // string USER_PASSWORD,
            $_POST['password_confirm'], //string USER_CONFIRM_PASSWORD,
            $_POST['login'] // string USER_EMAIL
        );


        if($user['TYPE'] == 'OK')
            json_exit(array('success' => true, 'user' => $user, 'msg' => strip_tags($user['MESSAGE'])));
        else // login duplicate or other errors
            json_exit(array(
                'success' => false, 
                'error' => strip_tags($user['MESSAGE']), 
                'error_code' => 12, 
                'fields' => array('login'), 
                'user' => $user
            ));

        break;

    // password reset
    case 'password_reset':
        if (!isset($_POST['login']) || empty($_POST['login']))
            json_exit(array('success' => false, 'error' => 'Не заполнено поле', 'error_code' => 12));

        // send email to user with link for reset password
        $user = $USER->SendPassword($_POST['login'], '');

        if($user['TYPE'] == 'OK')
            json_exit(array('success' => true, 'user' => $user, 'msg' => strip_tags($user['MESSAGE'])));
        else 
            json_exit(array('success' => false, 'error' => strip_tags($user['MESSAGE']), 'error_code' => 12, 'fields' => array('login'), 'user' => $user));

        break;

    default:
        json_exit(array('success' => false, 'error' => 'mode is undefined'));

}