// React Imports
import {useState, useEffect, ChangeEvent} from "react";
import {useMutation, useQuery} from "@tanstack/react-query";

// MUI Imports
import {Grid, Box, Stack, TextField, InputAdornment} from "@mui/material";

// Icons
import AddIcon from "@mui/icons-material/Add";

// Components
import StaffTypography from "../Typography/StaffTypography";
import BoxButton from "../Button/BoxButton";
import FormDialog from "../Dialog/FormDialog";
import OutlinedTextField from "../TextFields/OutlinedTextField";
import BasicSelect from "../Select/Select";

// Utils Imports
import {createItem, getAllItems} from "../../services/itemApi";
import {fetchEventTypes} from "../../services/eventTypesApi";
import {
  formatAndCapitalizeString,
  isValueExistsInObjectArray,
} from "../../utils/Common";
import {FormDataType, Item, DonationEventItems} from "../../utils/Types";
import _ from "lodash";

type Step2FormProps = {
  formData: FormDataType;
  showMissingFields: boolean;
  handleData: (key: string, value: any) => void;
};

type InputField = {
  key: keyof DonationEventItems;
  label: string;
};

const itemInputFields: InputField[] = [
  {
    key: "minQty",
    label: "Minimum Quantity",
  },
  {
    key: "targetQty",
    label: "Target Quantity",
  },
  {
    key: "pointsPerUnit",
    label: "Cash Per ",
  },
];

export default function Step2Form(props: Step2FormProps) {
  const {formData, handleData, showMissingFields} = props;
  const {donationEventItems} = formData;

  // === For Event Type Selection === //
  const [menuEventTypes, setMenuEventTypes] = useState([]);
  const [selectMenuEventType, setSelectedEventType] = useState<string>("");

  const {data: eventTypesData, isLoading: eventTypesIsLoading} = useQuery({
    queryKey: ["eventTypes"],
    queryFn: fetchEventTypes,
  });

  useEffect(() => {
    if (!eventTypesIsLoading && eventTypesData) {
      const eventTypes = eventTypesData.data.eventTypes.map(
        ({id, name}: {id: number; name: string}) => ({
          label: name,
          value: id,
        })
      );

      setMenuEventTypes(eventTypes);
    }
  }, [eventTypesData, eventTypesIsLoading]);
  // === For Event Type Selection === //

  // === For Item View and Create ===
  const [items, setItems] = useState<Item[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const menuItems = [
    {label: "Kilogram", value: "kilogram"},
    {label: "Litre", value: "litre"},
    {label: "Dollar", value: "dollar"},
    {label: "Hour", value: "hour"},
    {label: "Unit", value: "unit"},
  ];
  const [selectMenuItems, setSelectedMenuItems] = useState<string>("");

  const {
    data: itemsData,
    isLoading: itemsIsLoading,
    refetch: itemsRefetch,
  } = useQuery({
    queryKey: ["items"],
    queryFn: getAllItems,
  });

  useEffect(() => {
    if (!itemsIsLoading && itemsData) {
      setItems(itemsData.data.items);
    }
  }, [itemsData, itemsIsLoading]);

  const toggleDonationEventItem = (item: Item) => {
    const isItemInDonationEvent = donationEventItems?.some(
      (donationEventItem) => _.isEqual(donationEventItem.item, item)
    );

    if (isItemInDonationEvent) {
      handleData(
        "donationEventItems",
        donationEventItems.filter(
          (donationEventItem) => !_.isEqual(donationEventItem.item, item)
        )
      );
    } else {
      const newDonationEventItem: DonationEventItems = {
        minQty: 0,
        targetQty: 0,
        pointsPerUnit: 0,
        currentQty: 0,
        item: item,
      };
      handleData("donationEventItems", [
        ...donationEventItems,
        newDonationEventItem,
      ]);
    }
  };

  const {mutateAsync: createItemMutateAsync} = useMutation({
    mutationKey: ["createItem"],
    // mutationFn: Performing the actual API call
    mutationFn: ({
      name,
      unit,
      eventTypeId,
    }: {
      name: string;
      unit: string;
      eventTypeId: number;
    }) => {
      return createItem(name, unit, eventTypeId);
    },
    // Execution after successful API call
    onSuccess: (response) => {
      if (response && response.data.item) {
        itemsRefetch();
        return true;
      }
      return false;
    },
    onError: (error: any) => {
      console.error("Error creating item: ", error);
      setErrorMessage("An error occurred while creating the item.");
    },
  });

  const handleItemFormSubmit = async (formData: any): Promise<boolean> => {
    setErrorMessage("");
    const {item, unit, category} = formData;
    const sanitisedItem = formatAndCapitalizeString(item); // Sanitize input to safeguard duplicate creation of event type
    const existingItems = itemsData.data.items;
    const isItemExists = isValueExistsInObjectArray(
      existingItems,
      "name",
      sanitisedItem
    );

    if (item === "" || unit === "" || category === "") {
      setErrorMessage("Please fill in all the required fields");
      return false;
    }

    if (isItemExists) {
      setErrorMessage("This item already exists!");
      return false;
    }
    return createItemMutateAsync({
      name: sanitisedItem,
      unit: unit,
      eventTypeId: parseInt(category) as number,
    });
  };
  // === For Item View and Create ===

  const handleItemFieldChange =
    (
      itemKey: keyof DonationEventItems,
      donationEventItem: DonationEventItems
    ) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const updatedDonationEventItems = donationEventItems.map((item) => {
        if (item === donationEventItem) {
          return {
            ...item,
            [itemKey]: parseFloat(event.target.value),
          };
        }
        return item;
      });
      handleData("donationEventItems", updatedDonationEventItems);
    };

  return (
    <>
      {/* Item Creation Dialog */}
      <Box
        display="flex"
        alignItems="center"
      >
        <StaffTypography
          type="title"
          size={1.5}
          text={`4. Choose items`}
          customStyles={{marginRight: 4}}
        />
        <FormDialog
          buttonName="Add"
          buttonIcon={<AddIcon />}
          dialogTitle="Create a New Item"
          leftActionButtonName="Cancel"
          rightActionButtonName="Add"
          errorMessage={errorMessage}
          formComponent={
            <Box>
              <OutlinedTextField
                id={"create-item"}
                name="item"
                label="Item"
                helperText="Please enter non-numerical values"
                regExpression={/^[a-zA-Z\s]+$/}
              />
              <BasicSelect
                name="unit"
                labelId="select-item-label"
                label="Unit"
                selectId="select-item-id"
                menuItems={menuItems}
                selectValue={selectMenuItems}
                onChange={setSelectedMenuItems}
              />
              <BasicSelect
                name="category"
                labelId="select-category-label"
                label="Category"
                selectId="select-category-id"
                menuItems={menuEventTypes}
                selectValue={selectMenuEventType}
                onChange={setSelectedEventType}
              />
            </Box>
          }
          handleFormSubmit={handleItemFormSubmit}
        ></FormDialog>
      </Box>
      {/* Item Creation Dialog */}
      {itemsIsLoading ? (
        <Box>Loading Items</Box>
      ) : (
        <Grid
          container
          rowSpacing={2}
          textAlign="center"
        >
          {items &&
            items.map((item: any) => (
              <Grid
                item
                key={item.id}
                xs={6}
                sm={4}
                lg={3}
                xl={2}
              >
                <BoxButton
                  key={item.id}
                  handleClick={() => toggleDonationEventItem(item)}
                  color="primary"
                  size="small"
                  name={item.name}
                  isSelected={
                    donationEventItems
                      ? donationEventItems.some((donationEventItem) =>
                          _.isEqual(donationEventItem.item, item)
                        )
                      : false
                  }
                  customStyles={{
                    marginTop: "0",
                  }}
                ></BoxButton>
              </Grid>
            ))}
        </Grid>
      )}
      {showMissingFields && donationEventItems.length === 0 && (
        <StaffTypography
          type="helperText"
          size={1.5}
          text="Please choose at least 1 item"
        />
      )}
      {donationEventItems.length > 0 && (
        <StaffTypography
          type="title"
          size={1.5}
          text="5. Fill up the information for each donation item"
        />
      )}
      <Grid
        container
        justifyContent="space-evenly"
      >
        {donationEventItems &&
          donationEventItems.map(function (donationEventItem, index) {
            return (
              <Grid
                item
                sx={{marginBottom: "1rem"}}
                key={index}
              >
                <Box
                  component="form"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  sx={{
                    width: 400,
                    m: "auto",
                    "& > :not(style)": {m: "1rem", p: "1rem"},
                    boxShadow: 5,
                    borderRadius: 2,
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <Stack spacing={5}>
                    <StaffTypography
                      type="title"
                      size={1.5}
                      text={
                        "Item " +
                        (index + 1) +
                        ": " +
                        donationEventItem.item.name
                      }
                    />
                    {itemInputFields.map(
                      ({key, label}: InputField, itemFieldIndex: number) => (
                        <TextField
                          key={itemFieldIndex}
                          label={
                            key !== "pointsPerUnit"
                              ? label
                              : label + donationEventItem.item.unit
                          }
                          type="number"
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                {key !== "pointsPerUnit" &&
                                  donationEventItem.item.unit}
                              </InputAdornment>
                            ),
                          }}
                          InputLabelProps={{shrink: true}}
                          sx={{width: 350}}
                          value={donationEventItem[key]}
                          onChange={handleItemFieldChange(
                            key,
                            donationEventItem
                          )}
                          error={
                            showMissingFields &&
                            (!donationEventItem[key] ||
                              (donationEventItem[key] as number) <= 0)
                          }
                          helperText={
                            showMissingFields &&
                            (!donationEventItem[key] ||
                              (donationEventItem[key] as number) <= 0) &&
                            "Please enter a number that is greater than 0"
                          }
                        />
                      )
                    )}
                  </Stack>
                </Box>
              </Grid>
            );
          })}
      </Grid>
    </>
  );
}
