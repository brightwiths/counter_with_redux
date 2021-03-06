import React, {useEffect} from 'react';
import s from './CounterDisplay.module.scss'
import '../../App.scss'
import {CustomButton} from '../CustomButton/CustomButton';
import {useHistory} from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux";
import {incValueAC, resetValueAC} from "../../bll/counter-reducer";
import {setClassAC, setIsIncButtonDisabledAC, setIsResetButtonDisabledAC} from "../../bll/display-reducer";
import {AppStateType} from "../../bll/store";

type CounterDisplayPropsType = {
  type: 'Counter2' | 'Counter21'
  startValue: number
  maxValue: number
  value: number
  isMessage: boolean
  isError: boolean
}

export function CounterDisplay(props: CounterDisplayPropsType) {

  const dispatch = useDispatch()
  const history = useHistory() //для изменение адреса

  const valueClass = useSelector<AppStateType, string>(state => state.display.valueClass)
  const isIncButtonDisabled = useSelector<AppStateType, boolean>(state => state.display.isIncButtonDisabled)
  const isResetButtonDisabled = useSelector<AppStateType, boolean>(state => state.display.isResetButtonDisabled)

  // Формирование разных цветов счётчика по условиям
  useEffect(() => {
    if (props.isError || (props.maxValue === props.value && !props.isMessage)) {
      dispatch(setClassAC(s.redValueColor))
    } else {
      dispatch(setClassAC(''))
    }
  }, [props.isMessage, props.isError, props.value, props.maxValue/*, setValueClass*/, dispatch])

  // блокировка кнопок Inc и Reset по условиям
  useEffect(() => {
      if (props.isMessage) {
        dispatch(setIsIncButtonDisabledAC(true))
        dispatch(setIsResetButtonDisabledAC(true))
      } else if (props.value === props.startValue) {
        dispatch(setIsIncButtonDisabledAC(false))
        dispatch(setIsResetButtonDisabledAC(true))
      } else if (props.maxValue === props.value) {
        dispatch(setIsIncButtonDisabledAC(true))
        dispatch(setIsResetButtonDisabledAC(false))
      } else {
        dispatch(setIsIncButtonDisabledAC(false))
        dispatch(setIsResetButtonDisabledAC(false))
      }
    },
    [props.isMessage, props.value, props.startValue, props.maxValue, dispatch])

  // разные сообщения в зависимости от наличия ошибки
  let messageText = (props.isError) ? 'Incorrect value!' : 'enter values and press set'

  //увеличить счётчик на один вверх
  const incButtonHandler = () => {
    dispatch(incValueAC())
  }

  //сбросить счётчик
  const resetButtonHandler = () => {
    dispatch(resetValueAC())
  }

  // set для Counter 2.1
  const setButtonHandler = () => {
    history.push('/counter2.1/settings')
  }

  if (props.type === 'Counter2') {
    return (
      <div className='mainContainer'>
        <div className='valueContainer'>
        <span className={`${s.value} ${valueClass}`}>
          {props.isMessage ? messageText : props.value}
        </span>
        </div>
        <div className='buttonContainer'>
          <CustomButton title="inc" disabled={isIncButtonDisabled} onClick={incButtonHandler}/>
          <CustomButton title="reset" disabled={isResetButtonDisabled} onClick={resetButtonHandler}/>
        </div>
      </div>
    )
  } else if (props.type === 'Counter21') {
    return (
      <div className='mainContainer'>
        <div className='valueContainer'>
        <span className={`${s.value} ${valueClass}`}>
          {props.isMessage ? messageText : props.value}
        </span>
        </div>
        <div className='buttonContainer'>
          <CustomButton title="inc" disabled={isIncButtonDisabled} onClick={incButtonHandler}/>
          <CustomButton title="reset" disabled={isResetButtonDisabled} onClick={resetButtonHandler}/>
          <CustomButton title="set" disabled={false} onClick={setButtonHandler}/>
        </div>
      </div>
    )
  } else {
    return <div>no type defined</div>
  }
}