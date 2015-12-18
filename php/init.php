<?
    function json_exit($data = array())
    {
        header('Content-Type: application/json');
        exit(json_encode($data));
    }