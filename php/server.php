<?php
//https://github.com/joshcam/PHP-MySQLi-Database-Class
require_once 'MysqliDb.php';

class ajax_server {

    function __construct() {
        $this->db = new MysqliDb( "localhost", "root", "", "tugeil" );
    }
    public function calendarGetData() {
        //$start = $_REQUEST['from'] / 1000;
        //$end   = $_REQUEST['to'] / 1000;
        //$sql   = sprintf('SELECT * FROM tugeil_events WHERE `datetime` BETWEEN %s and %s',
        //    $db->quote(date('Y-m-d', $start)), $db->quote(date('Y-m-d', $end)));
        $events = $this->db->get( 'tugeil_events' ); //contains an Array of all users
        $out = array();
        foreach ( $events as $row ) {
            $out[] = array(
                'id' => $row['id'],
                'title' => $row['title'],
                'type' => $row['type'],
                'startsAt' => $row['startsAt'],
                'endsAt' => $row['endsAt'],
                'location' => $row['location'],
                'link' => $row['link'],
                'draggable' => $row['draggable'],
                'resizable' => $row['resizable'],
                'confirmed' => $row['confirmed'],
            );
        }

        echo json_encode( array( 'success' => 1, 'result' => $out ) );
        exit;

    }

    public function calendarSaveEvent( $data ) {
        $data = json_decode( $data['data'] );
        $data = (array)$data;
        $data = Array (
            'title' => $data['title'],
            'startsAt' => $data['startsAt'],
            'endsAt' => $data['startsAt'],
            'endsAt' => $data['endsAt'],
            'location' => $data['location'],
            'link' => $data['link'],
            'draggable' => $data['draggable'] ==="true",
            'resizable' => $data['resizable'] === "true"
        );
        $id = $this->db->insert ( 'tugeil_events', $data );
        if ( $id )
            echo 'user was created. Id=' . $id;
        else
            echo 'insert failed: ' . $this->db->getLastError();
    }
}


$ajax_functions = new ajax_server();
if ( isset( $_REQUEST["operation"] ) && strpos( $_REQUEST["operation"], "_" ) !== 0 && method_exists( $ajax_functions, $_REQUEST["operation"] ) ) {

    print_r( $ajax_functions->{$_REQUEST["operation"]}( $_REQUEST ) );
    die();
}
