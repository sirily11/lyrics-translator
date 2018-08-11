import {
	MDCTextField
} from '@material/textfield';
import mdcAutoInit from '@material/auto-init';
try {
    window.onload(function (e) {
        const username_field = new MDCTextField(document.querySelector('.mdc-text-field'));
    });
}catch (e) {

}



