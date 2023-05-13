// 로그인 화면 인풋
import React, {useRef} from "react";
import BordredInput from "./BordredInput";


function SignForm ({isSignUp, onSubmit, form, createChangeTextHandler}) {

    const passwordRef = useRef();
    const confirmPasswordRef = useRef();

    return (
        <>
            <BordredInput
                hasMarginBottom
                placeholder="이메일"
                value={form.email}
                onChangeText={createChangeTextHandler('email')}
                autoCapitalize="none"
                autoCorrect={false}
                autoCompleteType="email"
                keyboardType="email-address"
                returnKeyType="next"
                onSubmitEditing={()=> passwordRef.current.foucs()}
            />
            <BordredInput
                hasMarginBottom ={isSignUp}
                placeholder="비밀번호"
                secureTextEntry
                value={form.password}
                onChangeText={createChangeTextHandler('password')}
                ref={passwordRef}
                returnKeyType={isSignUp ? 'next' : 'done'}
                onSubmitEditing={()=> {
                    if(isSignUp){
                        confirmPasswordRef.current.foucs();
                    } else {
                        onSubmit();
                    }
                }}
            />
            {isSignUp && (
                <BordredInput
                    placeholder="비밀번호 확인"
                    secureTextEntry
                    value={form.confirmPassword}
                    onChangeText={createChangeTextHandler('confirmPassword')}
                    ref={confirmPasswordRef}
                    returnKeyType="done"
                    onSubmitEditing={onSubmit}
                />
            )}
        </>      
    ); 
}

export default SignForm;