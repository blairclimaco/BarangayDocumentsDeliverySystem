<?php
/**
 * Shared Footer Template
 * 
 * Include this at the bottom of each page:
 * <?php include 'includes/footer.php'; ?>
 */

$extraFooterScripts = isset($extraFooterScripts) ? $extraFooterScripts : '';
?>
    <script src="assets/js/script.js"></script>
    <?php echo $extraFooterScripts; ?>
</body>
</html>
