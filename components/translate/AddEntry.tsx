import {
  Alert,
  Button,
  Center,
  Checkbox,
  Divider,
  Loader,
  Modal,
  NumberInput,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm, UseFormReturnType } from "@mantine/form";
import ModalButton from "components/general/ModalButton";
import { useState } from "react";
import { FcCheckmark, FcPlus } from "react-icons/fc";
import { defaultNewEntry } from "data/data";
import { StringWithSuggestions } from "types/general";
import { css } from "styled-components";
import { titleCase } from "functions/text";
import IconTitle from "components/general/IconTitle";
import { TbAlertCircle, TbNewSection } from "react-icons/tb";
import { gql, useMutation } from "@apollo/client";
import { Entry } from "prisma/generated/type-graphql";
import { createMutationVariablesFromFormData } from "functions/graphql";
import GraphQLError from "components/general/GraphQLError";

const CREATE_ONE_ENTRY = gql`
  mutation CreateOneEntry($data: EntryCreateInput!) {
    createOneEntry(data: $data) {
      id
      platforms {
        id
        android
        backend
        ios
        web
      }
      translations {
        id
        enUS
        nbNO
        svSE
        frFR
        esES
        fiFI
        itIT
        caES
        ptPT
      }
    }
  }
`;

const CREATE_ONE_ENTRY_VARIABLES = {
  id: "NEW_ENTRY_3",
  translations: {
    create: {
      enUS: "Example",
      nbNO: "Eksempel",
    },
  },
  platforms: {
    create: {},
  },
};

export default function AddEntry({ defaultOpen = false }) {
  const form = useForm({
    initialValues: defaultNewEntry,

    validate: {},
  });
  const [addEntry, { data, loading, error }] = useMutation(CREATE_ONE_ENTRY);
  const [open, setOpen] = useState(defaultOpen);

  function closeModal() {
    setOpen(false);
  }
  function openModal() {
    setOpen(true);
  }
  const gap = "0.75em";

  return (
    <ModalButton
      color="dark"
      leftIcon={<FcPlus />}
      onClick={openModal}
      modal={
        <Modal
          size="xl"
          withFocusReturn
          centered
          opened={open}
          onClose={closeModal}
          title={<IconTitle icon={<TbNewSection />}>Add Entry</IconTitle>}
        >
          <form
            onSubmit={form.onSubmit((values) => {
              // console.log({
              //   correct: CREATE_ONE_ENTRY_VARIABLES,
              //   actual: createMutationVariablesFromFormData(values),
              // });

              addEntry({
                variables: {
                  // data: CREATE_ONE_ENTRY_VARIABLES,
                  data: createMutationVariablesFromFormData(values),
                },
              });
            })}
            css={css`
              display: flex;
              flex-direction: column;
              gap: ${gap};
            `}
          >
            {Object.keys(defaultNewEntry).map((name, i) => {
              return (
                <AutoInput
                  autoFocus={i === 0}
                  key={name}
                  name={name}
                  gap={gap}
                  value={form.values[name]}
                  form={form}
                />
              );
            })}
            <Center>
              <Button color="dark" type="submit" leftIcon={<FcCheckmark />}>
                Add
              </Button>
            </Center>
            {loading && <Loader />}
            <GraphQLError error={error} />

            <pre>{JSON.stringify(data, null, 2)}</pre>
          </form>
        </Modal>
      }
    >
      Add entry
    </ModalButton>
  );
}

function AutoInput<T>({
  name,
  value,
  form,
  autoFocus = false,
  gap = "0.25em",
}: {
  name: keyof T | StringWithSuggestions;
  value: T[keyof T] | StringWithSuggestions | Record<string, any>;
  form: UseFormReturnType<T>;
  autoFocus?: boolean;
  gap?: string;
}) {
  const nameString = String(name);

  if (typeof value === "object") {
    if (value === null || Object.keys(value).length === 0) return null;
    const subNames = value ? Object.keys(value) : [];
    return (
      <div>
        <Divider
          label={
            <Text size="md" weight="bold">
              {titleCase(nameString)}
            </Text>
          }
        />
        <div
          css={css`
            display: flex;
            flex-direction: column;
            gap: ${gap};
            padding-left: 20px;
          `}
        >
          {subNames?.map((subName, i) => {
            const nestedName = `${nameString}.${subName}`;
            return (
              <AutoInput
                autoFocus={i === 0}
                key={nestedName}
                name={nestedName}
                value={value?.[nestedName]}
                form={form}
              />
            );
          })}
        </div>
      </div>
    );
  }

  const sharedProps = {
    key: nameString,
    name: nameString,
    label: titleCase(nameString.split(".").pop() ?? ""),
    "data-autofocus": autoFocus,
  };

  if (typeof value === "boolean") {
    return (
      <Checkbox
        {...form?.getInputProps(nameString, { type: "checkbox" })}
        {...sharedProps}
        // checked={form.values[name as keyof Entry]}
        // onChange={form.setFieldValue}
      />
    );
  }

  if (typeof value === "number") {
    return (
      <NumberInput {...sharedProps} {...form?.getInputProps(nameString)} />
    );
  }

  return <TextInput {...sharedProps} {...form?.getInputProps(nameString)} />;
}
