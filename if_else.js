function if_(condition) {
    return ifStatementFactory(condition);
}

function ifStatementFactory(condition) {
    return function (statement) {
        return ifResolveFactory(condition ? statement : undefined);
    }
}

function ifResolveFactory(result) {
    
    function resolve() {
            if (result) {
                if (typeof(result) === "function") {
                    return result();
                }
                return result;
            }
        }
    
    resolve.else_ = function else_(statement) {
        if (!result) {
            result = statement;
        }
        return resolve;
    }
    
    resolve.else_if_ = function else_if_(condition) {
        if (!result) {
            return if_(condition);
        }
        else {
            return resolve;
        }
    }
    
    return resolve;
}
//------------------------------------------------------------------------------------------
function switch_(switchArg) {
    return caseResolveFactory(switchArg);
}

function caseStatementFactory(switchArg, caseVal, result) {
    return function (statement) {
        if (result) {
            return caseResolveFactory(switchArg, result)
        }
        return caseResolveFactory(switchArg, switchArg === caseVal ? statement : undefined);
    }
}

function caseResolveFactory(switchArg, result) {
    
    function resolve() {
        if (result) {
            if (typeof(result) === "function") {
                return result();
            }
            return result;
        }
    }
    
    resolve.case_ = function case_(caseVal) {
        return caseStatementFactory(switchArg, caseVal, result);
    }
    
    resolve.default_ = function default_(statement) {
        return caseResolveFactory(switchArg, result || statement)
    }
    
    return resolve;
}

module.exports = {
    if_,
    switch_
}