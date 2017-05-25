// dependencies -------------------------------------------------------

import React       from 'react';
import Reflux      from 'reflux';
import pluralize   from 'pluralize';
import Actions     from './actions.js';
import UploadStore from './store.js';
import Results     from './validation-results.jsx';
import Spinner     from './spinner.jsx';
import ErrorLink   from './error-link.jsx';
import Summary     from './summary.jsx';

let Issues = React.createClass({

	mixins: [Reflux.connect(UploadStore)],

// life cycle events --------------------------------------------------

	render () {

		// short references
		let tree     = this.state.tree;
		let errors   = this.state.errors;
		let warnings = this.state.warnings;
		let dirName  = this.state.dirName;

		// counts
		let totalErrors = 0;
    	let totalWarnings = 0;
    	let warningCount,
    		errorCount;
	    if (errors !== 'Invalid') {
			totalErrors   = errors.length;
	        totalWarnings = warnings.length;
			warningCount = totalWarnings + ' ' + pluralize('Warning', totalWarnings);
			errorCount   = totalErrors   + ' ' + pluralize('Error', totalErrors);
		}
		let uploadResetLink = <span className="upload-reset-link" onClick={this._reset}>select your folder again</span>
		// messages
		let specLink        = <h5>Click to view details on <a href="http://bids.neuroimaging.io" target="_blank">BIDS specification</a></h5>;
		let notBIDSMessage  = <h4>This directory failed an initial Quick Test. This means the basic names and structure of the files and directories do not comply with BIDS specification. <span onClick={this._reset}>Select a new folder</span> and try again.</h4>;
		let warningsMessage = <h4>We found {warningCount} in your dataset.</h4>;
		let errorMessage    = <h4>Your dataset is not a valid BIDS dataset.</h4>;
		let noErrorMessage  = <h4>This is a valid BIDS dataset!</h4>;

		// determine message
		let message;
		if (errors === 'Invalid') {
			message = notBIDSMessage;
		} else if (errors.length > 0) {
			message = errorMessage;
		}  else if (warnings.length > 0) {
			message = warningsMessage;
		} else {
			message = noErrorMessage;
		}

		// loading animation
		let loading = <Spinner text="validating" active={this.state.uploadStatus === 'validating'}/>;

		// results
		let results = (
			<div className="well issues">
				<button type="button" className="close" aria-label="Close" onClick={this._reset}><span aria-hidden="true">&times;</span></button>
				<Summary />
				{message}
				{errors !== 'Invalid' ? <Results errors={errors} warnings={warnings} /> : null}
				{errors.length > 0 && errors !== 'Invalid' || warnings.length > 0 ? <ErrorLink dirName={dirName} errors={errors} warnings={warnings} /> : null}
				{specLink}
			</div>
		);

		return (
			<div>
				{this.state.uploadStatus === 'validating' ? loading : results}
			</div>
    	);
	},

// custom methods -----------------------------------------------------

	_upload: Actions.checkExists,

	_reset: function () {
		Actions.setInitialState();
	}

});


export default Issues;