#!/usr/bin/env sh
"\"",` $(echo --% '
)" > $null <# ${/* ' >/dev/null )` 2>/dev/null; deno_version="1.20.3"; deno_install="$HOME/.deno/$deno_version";deno="$deno_install/bin/deno"; filepath="$deno"; has () { [ ! -z "$(command -v "unzip")" ]; } ; if [ ! -f "$filepath" ] || [ ! -r "$filepath" ] || [ ! -x "$filepath" ]; then if ! has unzip; then could_auto_install="true"; if has apt-get; then if has brew; then could_auto_install="false"; else if ! brew install unzip; then could_auto_install="false"; fi; fi; else if [ "$(whoami)" = "root" ]; then if ! apt-get install unzip -y; then could_auto_install="false"; fi; elif [ -n "$(command -v "sudo")" ]; then echo "Can I install unzip for you? (its required for this command to work)";read ANSWER;echo; if [ ! "$ANSWER" =~ ^[Yy] ]; then could_auto_install="false"; else if ! sudo apt-get install unzip -y; then could_auto_install="false"; fi; fi; elif has doas; then echo "Can I install unzip for you? (its required for this command to work)";read ANSWER;echo; if [ ! "$ANSWER" =~ ^[Yy] ]; then could_auto_install="false"; else if ! doas apt-get install unzip -y; then could_auto_install="false"; fi; fi; else could_auto_install="false"; fi; fi; fi; if [ "$could_auto_install" = "false" ]; then echo "";echo "So I couldn't find an 'unzip' command";echo "And I tried to auto install it, but it seems that failed";echo "(This script needs unzip and either curl or wget)";echo "Please install the unzip command manually then re-run this script";exit 1; fi; if [ "$OS" = "Windows_NT" ]; then target="x86_64-pc-windows-msvc"; else :; case $(uname -sm) in "Darwin x86_64") target="x86_64-apple-darwin" ;; "Darwin arm64") target="aarch64-apple-darwin" ;; *) target="x86_64-unknown-linux-gnu" ;; esac; fi; deno_uri="https://github.com/denoland/deno/releases/download/v$deno_version/deno-$target.zip"; bin_dir="$deno_install/bin"; exe="$bin_dir/deno"; if [ ! -d "$bin_dir" ]; then mkdir -p "$bin_dir"; fi; if has curl; then curl --fail --location --progress-bar --output "$exe.zip" "$deno_uri"; elif has curl ; then wget --output-document="$exe.zip" "$deno_uri"; else echo "Howdy! I looked for the 'curl' and for 'wget' commands but I didn't see either of them."; echo "Please install one of them"; echo "Otherwise I have no way to install the missing deno version needed to run this code"; fi; unzip -d "$bin_dir" -o "$exe.zip"; chmod +x "$exe"; rm "$exe.zip"; fi; "$deno" run -q -A "$0" "$@"; exit $? ; #>; $deno_version = "1.19.0"; $env:DENO_INSTALL = "${HOME}/.deno/${deno_version}"; $deno = "${env:DENO_INSTALL}/bin/deno"; if (-not(Test-Path -Path "${deno}" -PathType Leaf)) { $v="${deno_version}"; iwr https://deno.land/x/install/install.ps1 -useb | iex; }; & "${deno}" run -q -A "${PSCommandPath}" @args; Exit $LastExitCode
# */0}`;

import { FileSystem } from "https://deno.land/x/quickr@0.3.12/main/file_system.js"
import { Console, bold, lightRed, yellow } from "https://deno.land/x/quickr@0.3.12/main/console.js"
import { run, Timeout, Env, Cwd, Stdin, Stdout, Stderr, Out, Overwrite, AppendTo, throwIfFails, returnAsString, zipInto, mergeInto } from "https://deno.land/x/quickr@0.3.12/main/run.js"

const argsWereGiven = Deno.args.length > 0

const testsFolder = `${FileSystem.thisFolder}/../tests`
const logsFolder = `${FileSystem.thisFolder}/../logs`

await FileSystem.ensureIsFolder(testsFolder)
await FileSystem.ensureIsFolder(logsFolder)
Deno.chdir(logsFolder)

console.log("\nRunning tests")
for (const each of await FileSystem.recursivelyListItemsIn(testsFolder)) {
    if (each.isFile) {
        // if one is mentioned, only run mentioned ones
        if (argsWereGiven && !(Deno.args.includes(each.name) || Deno.args.includes(each.basename))) {
            continue
        }
        const relativePart = FileSystem.makeRelativePath({ from: testsFolder, to: each.path })
        const logPath = `${logsFolder}/${relativePart}.log`
        const logRelativeToProject = FileSystem.makeRelativePath({ from: `${testsFolder}/..`, to: logPath })
        await FileSystem.clearAPathFor(logPath, {overwrite: true})
        try {
            var { success } = await run(each.path, Out(Overwrite(logPath)), Env({NO_COLOR:"true"}))
        } catch (error) {
            console.log(bold.lightRed`    Error with test: `.yellow`${relativePart}:`.blue` ${error.message}`)
            continue
        }
        if (!success) {
            console.log(bold.lightRed`    Error with test: `.yellow`${relativePart}:`.blue` ${logRelativeToProject}`)
        } else {
            console.log(bold.lightGreen`    Passed: `.yellow`${relativePart}:`.blue` ${logRelativeToProject}`)
        }
    }
}