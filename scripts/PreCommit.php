<?php

exec('git diff --cached --name-status --diff-filter=ACM', $output);
foreach ($output as $file) {
    $fileName = '../'.trim(substr($file, 1));
    /**
     * PHP file.
     */
    $ext = pathinfo($fileName, PATHINFO_EXTENSION);
    if ('php' === $ext) {
        /**
         * Check for error.
         */
        $lint_output = [];
        exec('php -l '.$fileName, $lint_output, $return);
        if (0 === $return) {
            /*
             * PHP-CS-Fixer && add it back
             */
            echo 'Checking PSR-2 & Symfony conformity of '.trim(substr($file, 1))."\n";
            exec("php-cs-fixer fix {$fileName} --rules=@PSR2,@Symfony --using-cache=no");
            exec("git add $fileName");
        } else {
            echo "\nYour commit has php syntax error(s).\nYou MUST fix them before you commit.\n";
            echo "See the error massage(s) below.\n\n---------------------";
            echo implode("\n", $lint_output), "\n---------------------\n";
            exit(1);
        }
        // * JS file
    } elseif ('js' === $ext && !strpos($fileName, 'dist/')) {
        // * JS Standard && add it back
        echo 'Formatting '.trim(substr($file, 1))."\n";
        exec("npx semistandard --fix $fileName");
        exec("git add $fileName");
    }
    echo "\n";
}
exit(0);
