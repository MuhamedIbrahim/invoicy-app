import React from 'react';
import style from './SaveResult.module.css';

//icons
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';

const SaveResult = React.memo(({type, fire}) => {
    return (
        <div className={[style.save, fire ? style.save_active : style.save_inactive].join(' ')}>
            <div className={[style.save__content, style[`save__content_${type}`]].join(' ')}>
                {type === 'success' ?
                    <p>
                        <CheckCircleOutlineIcon />
                        Successfully saved.
                    </p>
                :
                    <p>
                        <ErrorOutlineIcon />
                        Error occured while saving.
                    </p>
                }
            </div>
        </div>
    );
});

export default SaveResult;