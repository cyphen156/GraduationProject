import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';

class JoiningGroups extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          open: false
        }

        this.handleClickOpen = this.handleClickOpen.bind(this)
        this.handleClose = this.handleClose.bind(this);
    }

    handleClickOpen() {
        this.setState({
          open: true
        });
    }

    handleClose() {
        this.setState({
          open: false
        })
    }

    render() {
        return (
            <div>
                <Button variant="contained" color="secondary" onClick={this.handleClickOpen}>
                    참가</Button>
                <Dialog onClose={this.handleClose} open={this.state.open}>
                    <DialogTitle onClose={this.handleClose}>
                        그룹 참가</DialogTitle>
                        <DialogContent>
                        <Typography gutterBottom>
                            선택한 그룹에 참가하시겠습니까?
                      </Typography>
                   </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="primary" onClick={(e) => {}}>참가</Button>
                        <Button variant="outlined" color="primary" onClick={this.handleClose}>취소</Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}

export default JoiningGroups;