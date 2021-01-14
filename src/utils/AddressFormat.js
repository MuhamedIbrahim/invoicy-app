import React from 'react';

const AddressFormat = ({address}) => {
    const format = address?.split(',');
    if(format?.length > 0) {
        return format.map((item, index) => (
            <React.Fragment key={index}>
                {item}{index !== format.length - 1 ? ',' : null}{index !== format.length - 1 ? <br /> : null}
            </React.Fragment>
        ));
    } else {
        return '';
    }
}

export default AddressFormat