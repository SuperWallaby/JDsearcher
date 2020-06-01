import React from "react";
import { JDtypho, JDalign, JDbutton } from "@janda-com/front";

interface CounterProp {
    count: number;
    handleCount: (flag: boolean, target: any) => any;
    key?: string;
    label?: string;
    centerLabel?: string;
    maxCount?: number;
}


const Counter: React.FC<CounterProp> = ({ handleCount, centerLabel, key, count, label, maxCount }) => {
    return <JDalign className="JDcounter" flex={{
        vCenter: true
    }}>
        {label && <JDtypho className="JDcounter__label" weight={600} mr="large">{label}</JDtypho>}
        <JDalign className="JDcounter__inner">
            <JDbutton disabled={count === 0} thema="grey1" mode="flat" className="JDcounter__btn" onClick={() => { handleCount(false, key) }}>-</JDbutton>
            <JDbutton thema="grey1" mode="flat" className="JDcounter__count">
                {centerLabel || count}
                {maxCount && <JDtypho size="superTiny">/{maxCount}</JDtypho>}
            </JDbutton>
            <JDbutton disabled={maxCount ? maxCount <= count : false} thema="grey1" mode="flat" className="counter__btn" onClick={() => { handleCount(true, key) }}>+</JDbutton>
        </JDalign>
    </JDalign>
}
export default Counter;