<?php
$db    = new PDO('mysql:host=localhost;dbname=tugeil;charset=utf8', 'root', '');
//$start = $_REQUEST['from'] / 1000;
//$end   = $_REQUEST['to'] / 1000;
//$sql   = sprintf('SELECT * FROM tugeil_events WHERE `datetime` BETWEEN %s and %s',
//    $db->quote(date('Y-m-d', $start)), $db->quote(date('Y-m-d', $end)));
$sql   = 'SELECT * FROM tugeil_events;';
$out = array();
foreach($db->query($sql) as $row) {
    $out[] = array(
        'id' => $row['id'],
        'title' => $row['title'],
        'startsAt' => $row['startsAt'],
        'endsAt' => $row['endsAt'],
        'location' => $row['location'],
        'link' => $row['link'],
        'draggable' => $row['draggable'],
        'resizable' => $row['resizable']
    );
}

echo json_encode(array('success' => 1, 'result' => $out));
exit;