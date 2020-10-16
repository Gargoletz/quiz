import React, { useContext } from 'react';
import Quiz from './Quiz';
import Dictionary from './Dictionary';
import LoginScreen from './login/LoginScreen';
import AppContext from '../AppContext';
import { CONNECTED } from '../logic/Firebase';
import Loading from './generic/Loading';
import Settings from './Settings'
import Groups from './Groups';

export default function AppContent(props) {
    let context = useContext(AppContext);
    if (context?.conected) {
        if (context?.user != undefined) {
            switch (context?.screen) {
                case 0:
                    return <Quiz />
                case 1:
                    return <Dictionary />
                case 2:
                    return <Groups />
                case 3:
                    return <Settings />
            }
        }
        else {
            return <LoginScreen />
        }
    }
    else {
        return <Loading />
    }
}
