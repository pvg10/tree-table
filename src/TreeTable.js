import React, { forwardRef, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import moment from "moment";
import { useForm } from "react-hook-form";
import InputLabel from "@material-ui/core/InputLabel";
import Modal from "@material-ui/core/Modal";
import MaterialTable from "material-table";
import AddBox from "@material-ui/icons/AddBox";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import Grid from "@material-ui/core/Grid";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import { TextField } from "@material-ui/core";
import Remove from "@material-ui/icons/Remove";
import SaveAlt from "@material-ui/icons/SaveAlt";
import Search from "@material-ui/icons/Search";
import ViewColumn from "@material-ui/icons/ViewColumn";
import { Button } from "@material-ui/core";
import Select from "@material-ui/core/Select";
import axios from "axios";
import uniqid from "uniqid";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import _ from "lodash";
import "./style.scss";

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};
const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    // border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

//
function TreeTable(props) {
  const options = { filtering: true, selection: true };
  // const { classes } = props;

  const style = {
    display: "flex",
    flexDirection: "column",
    // height: "100vh",
  };
  const [createdOn, setCreatedOn] = useState(new Date());

  const [tableData, setData] = useState([
    {
      id: 1,
      description: "Assets",
      account: "",
      created_on: "",
      created_by: "",
      currency: "",
    },
    {
      id: 2,
      description: "Cash and Cash Resources",
      account: "",
      created_on: "",
      created_by: "",
      currency: "",
      parentId: 1,
    },
    {
      id: 3,
      description: "External Accounting",
      account: "",
      created_on: "",
      created_by: "",
      currency: "",
      parentId: 2,
    },
    {
      id: 4,
      description: "Cash Reserve",
      account: 1023333,
      created_on: "20/09/2021",
      created_by: "Company A",
      currency: "CHF",
      parentId: 3,
    },
    {
      id: 5,
      description: "Values Undergoing Collection",
      account: 1023333,
      created_on: "20/09/2021",
      created_by: "Company B",
      currency: "CHF",
      parentId: 3,
    },
    {
      id: 6,
      description: "Bank Account Number",
      account: 1023333,
      created_on: "20/09/2021",
      created_by: "Company C",
      currency: "EUR",
      parentId: 3,
    },
  ]);
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const [alertShow, setAlert] = useState(false);
  const [modalStyle] = useState(getModalStyle);
  const [type, setType] = useState("add");
  const [selectedRow, setSelecteRow] = useState([]);
  const [currencyVal, setCurrency] = useState("EUR");
  const [account, setAccount] = useState("");
  const [description, setDescription] = useState("");
  const [createdBy, setCreated] = useState("");
  const [alertType, setAlertType] = useState("sucess");

  const { register, handleSubmit } = useForm();
  useEffect(() => {
    axios
      .get("https://my-json-server.typicode.com/pvg10/tree-data/data")
      .then((response) => {
        // //console.log(response.data, "get");
        //console.log(uniqid()); // -> 4n5pxq24kpiob12og9

        setData(response.data);
      })
      .catch((error) => {
        //console.log(error);
        setAlert(true);
        setAlertType("error");
        setMessage("Something went wrong");
      });
  }, []);
  const deleteRow = () => {
    if (selectedRow.length > 0) {
      let diffArr = _.difference(tableData, selectedRow);
      // //console.log(selectedRow, "delete");
      setData(diffArr);
      setMessage("Row deleted successfully");
      setAlert(true);
      setAlertType("success");
      setSelecteRow([])
    } else {
      setMessage("Please Select row to delete");
      setAlert(true);
      setAlertType("error");
    }
  };
  //console.log(tableData, "tableData");

  function rand() {
    return Math.round(Math.random() * 20) - 10;
  }

  function resetForm() {
    setAccount("");
    setDescription("");
    setCreated("");
    setCurrency("EUR");
    setCreatedOn(new Date(moment()));
  }

  function getModalStyle() {
    const top = 50 + rand();
    const left = 50 + rand();

    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    resetForm();
    setOpen(false);
    setAlert(false);
  };
  const selectedRows = () => {
    let message = "";
    let type = "";
    if (selectedRow.length > 0) {
      message = `You have selected ${selectedRow.length} rows`;
      type = "info";
    } else {
      message = "Please Select Rows";
      type = "error";
    }
    setAlert(true);
    setAlertType(type);
    setMessage(message);
  };
  const submitForm = (data) => {
    //console.log("data", createdOn.toLocaleDateString());
    selectedRow.length > 0 && (selectedRow[0].tableData.checked = false);

    let parentId = {};
    if (selectedRow.length > 0) {
      selectedRow[0].tableData.checked = false;
      parentId = { parentId: selectedRow[0].id };
    } else {
      parentId = {};
    }
    if (description == "") {
      setAlert(true);
      setAlertType("error");
      setMessage("Please Fill the Description field");
      return;
    }
    let method = "post";
    let data1 = {};
    let url = "https://my-json-server.typicode.com/pvg10/tree-data/data";
    if (type == "Add") {
      url = "https://my-json-server.typicode.com/pvg10/tree-data/data";
      method = "post";
      data1 = {
        id: Math.random(),
        created_by: createdBy,
        description: description,
        account: account,
        created_on: createdOn.toLocaleDateString(),
        currency: currencyVal,
        ...parentId,
      };
      setAlertType("success");
      setMessage("Row added successfully");
    } else {
      url = `https://my-json-server.typicode.com/pvg10/tree-data/data/${selectedRow[0].id}`;
      method = "put";
      data1 = {
        ...selectedRow[0],
        ...{ created_by: createdBy },
        ...{ description: description },
        ...{ account: account },
        ...{ created_on: createdOn.toLocaleDateString() },
        ...{ currency: currencyVal },
        // parentId : 3
      };
      setAlertType("success");
      setMessage("Field updated successfully");
    }

    let obj = {
      method: method,
      url: url,
      data: data1,
    };

    axios(obj)
      .then((response) => {
        //console.log(response.data);
        let dt = response.data;
        _.remove(tableData, function (n) {
          return n.id == dt.id;
        });

        setData([dt, ...tableData]);
        setSelecteRow([]);
        handleClose();
        setAlert(true);
      })
      .catch((error) => {
        //console.log(error);
        setAlert(true);
        setAlertType("error");
        setMessage("Something went wrong");
      });
  };
  const handleDateChange = (date) => {
    setCreatedOn(date);
  };
  const body = (
    <div style={modalStyle} className={classes.paper}>
      <h2 id="simple-modal-title" className="text-centre">
        {type} Rows
      </h2>
      <form onSubmit={handleSubmit(submitForm)}>
        <div id="simple-modal-description">
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <TextField
                id="description"
                label="Description*"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={description}
                onChange={(e) => {
                  //console.log(e, "change");
                  setDescription(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                id="standard-helperText"
                label="Created By"
                value={createdBy}
                fullWidth
                InputLabelProps={{ shrink: true }}
                onChange={(e) => {
                  setCreated(e.target.value);
                }}
              />
            </Grid>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Grid item xs={6}>
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="MM/dd/yyyy"
                  margin="normal"
                  id="date-picker-inline"
                  label="Date picker inline"
                  value={createdOn}
                  onChange={handleDateChange}
                  InputLabelProps={{ shrink: true }}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                />
              </Grid>
            </MuiPickersUtilsProvider>
            <Grid item xs={6}>
              <TextField
                id="account"
                label="Account"
                type="number"
                value={account}
                onChange={(e) => setAccount(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <InputLabel id="demo-simple-select-helper-label">
                Currency
              </InputLabel>
              <Select
                id="demo-simple-select"
                value={currencyVal}
                native
                fullWidth
                // value={age}
                inputProps={{
                  name: "name",
                }}
                onChange={(e) => {
                  //console.log("change", e.target.value);
                  setCurrency(e.target.value);
                }}
              >
                <option value={"CHF"}>CH</option>
                <option value={"EUR"}>EUR</option>
              </Select>
            </Grid>
          </Grid>

          <div className="text-center mt-15">
            <Button variant="contained" color="primary" type={"submit"}>
              {type == "Edit" ? "Update" : "Submit"}
            </Button>
            <Button variant="contained" color="secondary" onClick={handleClose}>
              Close
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
  const editPopup = () => {
    if (selectedRow.length > 0) {
      let dt =
        selectedRow[0].created_on !== ""
          ? moment(selectedRow[0].created_on, "DD/MM/YYYY").format("YYYY/MM/DD")
          : moment();
      setType("Edit");
      setAccount(selectedRow[0].account);
      setDescription(selectedRow[0].description);
      setCreated(selectedRow[0].created_by);
      setCurrency(selectedRow[0].currency);
      setCreatedOn(new Date(dt));
      handleOpen();
    } else {
      setMessage("Please Select Checkbox to edit row");
      setAlertType("error");
      setAlert(true);
    }
  };

  return (
    <div>
      <div
        style={{
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
        }}
      >
        <h2>Tree Table</h2>
      </div>
      <MaterialTable
        title=""
        icons={tableIcons}
        data={tableData}
        columns={[
          { title: "Description", field: "description" },
          {
            title: "Account",
            field: "account",
            render: (rowData) => {
              return <span style={{ color: "blue" }}>{rowData.account}</span>;
            },
          },
          { title: "Created on", field: "created_on" },
          { title: "Created by", field: "created_by" },
          { title: "Currency", field: "currency" },
          {
            title: "",
            field: "delete",
            cellStyle: {
              width: "5%",
            },
            render: () => (
              <Button
                variant="contained"
                color="secondary"
                onClick={(e) => {
                  deleteRow();
                }}
                style={{
                  width: "50px",
                  textTransform: "capitalize",
                }}
              >
                Delete
              </Button>
            ),
          },
        ]}
        parentChildData={(row, rows) => rows.find((a) => a.id === row.parentId)}
        onSelectionChange={(rows) => {
          //console.log("rows", rows);
          setSelecteRow(rows);
          setCurrency((rows.length > 0 && rows[0].currency) || "EUR");
        }}
        options={{
          selection: true,
          showTextRowsSelected: false,
          search: false,
          toolbar: false,
          paging: false,
          defaultExpanded: true,
          headerStyle: {
            fontSize: 15,
            background: "#ededed",
            borderRight: "1px solid lightgrey",
            color: "#000",
          },
          cellStyle: {
            borderLeft: "1px solid lightgrey",
            borderRight: "1px solid lightgrey",
          },
        }}
      />
      <div className="text-center mt-15">
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            //console.log(selectedRow, "selectedRow");
            resetForm();
            setType("Add");
            handleOpen();
          }}
        >
          Add
        </Button>
        <Button variant="contained" color="primary" onClick={editPopup}>
          Edit
        </Button>
        <Button variant="contained" color="primary" onClick={selectedRows}>
          Submit
        </Button>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={alertShow}
        autoHideDuration={4000}
        onClose={handleClose}
      >
        <MuiAlert onClose={handleClose} severity={alertType}>
          {message}
        </MuiAlert>
      </Snackbar>
    </div>
  );
}
export default TreeTable;
