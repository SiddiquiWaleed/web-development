<?php
    $command = escapeshellcmd('python main.py wallet.key 12345 Height Tortoise Pact Aspect Vacant April Earn Fossil Manage Fit Cute Advice');
    $output = exec($command);     
    echo $output;        
?>
