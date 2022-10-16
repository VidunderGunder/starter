import {
  Box,
  Button,
  Code,
  Group,
  LoadingOverlay,
  Table,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { ComponentPropsWithoutRef, useState } from "react";
import { gql, OperationVariables, useQuery } from "@apollo/client";
import { css } from "styled-components";
import { defaultNewEntry, languages, locales, platforms } from "data/data";
import { Entry as EntryType } from "prisma/generated/type-graphql";
import { TbCheck, TbDownload, TbSearch, TbUpload } from "react-icons/tb";
import FlagIcon from "components/icons/FlagIcon";
import PlatformIcon from "components/icons/PlatformIcon";
import { FcPlus } from "react-icons/fc";
import { FaTimesCircle } from "react-icons/fa";
import Entry from "components/general/Entry";
import { TranslateFilterButton } from "./TranslateFilter";
import { FilterColumn } from "components/general/Filter";
import { removeSymbols } from "functions/text";
import { formatLocale } from "functions/locale";
import ScrollTrigger from "components/general/ScrollTrigger";
import ErrorAlert from "components/general/ErrorAlert";
import AddEntry from "./AddEntry";

type Width = string | number | undefined;

function getCellCSS(width?: Width) {
  if (width === undefined) return css``;
  const value = typeof width === "number" ? `${width}px` : width;
  return css`
    min-width: ${value};
    width: ${value};
    max-width: ${value};
  `;
}

function TD({
  cellWidth,
  children,
  ...props
}: { cellWidth?: Width } & ComponentPropsWithoutRef<"td">) {
  return (
    <td css={getCellCSS(cellWidth)} {...props}>
      {children}
    </td>
  );
}

function TDPlatform({
  children,
  ...props
}: ComponentPropsWithoutRef<typeof TD>) {
  return <TD {...props}>{children}</TD>;
}

function TDTranslation({
  children,
  ...props
}: Omit<ComponentPropsWithoutRef<typeof TD>, "children"> & {
  children: string;
}) {
  return (
    <TD
      {...props}
      css={css`
        vertical-align: top;
      `}
    >
      <Entry>{children}</Entry>
    </TD>
  );
}

function getFilterQueryVariables({
  selectedColumns,
  currentData,
  page = 0,
  take = 50,
}: {
  selectedColumns?: FilterColumn[];
  currentData?: any;
  page?: number;
  take?: number;
}): OperationVariables {
  const _take = take + page * take;
  const lastId = currentData?.entries?.[currentData?.entries?.length - 1]?.id;
  const cursor = lastId ? { id: lastId } : undefined;
  if (selectedColumns === undefined)
    return {
      take: _take,
      cursor,
    };

  const platformArgs: Record<
    typeof platforms[number],
    {
      [key: string]: any;
    }
  > = {};

  platforms.forEach((platform) => {
    platformArgs[platform.toLowerCase()] =
      selectedColumns?.find(
        (c) => c.name.toLowerCase() === platform.toLowerCase()
      ) !== undefined
        ? { equals: true }
        : {};
  });

  return {
    where: {
      platforms:
        Object.values(platformArgs).length > 0
          ? {
              is: platformArgs,
            }
          : null,
      id: cursor ? { not: { equals: lastId } } : undefined,
    },
    cursor,
    take: _take,
  };
}

function getEntriesQuery(_locales: string[]) {
  return gql`
  query Entries($where: EntryWhereInput, $take: Int, $cursor: EntryWhereUniqueInput, $skip: Int) {
    entries(where: $where, take: $take, cursor: $cursor, skip: $skip) {
      id
      translationsId
      platformsId
      platforms {
        id
        android
        ios
        web
        backend
      }
      translations {
        id
        ${(_locales === undefined || _locales.length === 0
          ? locales
          : _locales
        ).map((locale) => `${removeSymbols(locale)}`)}
      }
    }
  }
`;
}

export default function Explorer({
  indexWidth = 250,
  platformWidth = 10,
  localeWidth = 500,
  headerColor = "#f5f5f5",
  headerBgColor = "#26262b",
  fetchAmount = 10,
  ...props
}: {
  indexWidth?: Width;
  platformWidth?: Width;
  localeWidth?: Width;
  headerColor?: string;
  headerBgColor?: string;
  fetchAmount?: number;
} & Omit<ComponentPropsWithoutRef<typeof Box>, "children">) {
  const [selectedColumns, setSelectedColumns] = useState<FilterColumn[]>();
  const selectedLocales =
    selectedColumns
      ?.filter((c) => c.category === "language")
      .map((c) => String(c.id)) ?? locales.map((l) => removeSymbols(l));
  const query = getEntriesQuery(selectedLocales);

  const [page, setPage] = useState(0);
  const { data, loading, error, refetch, fetchMore, previousData } = useQuery(
    query,
    {
      variables: getFilterQueryVariables({ selectedColumns, page }),
    }
  );

  if (error) return <ErrorAlert error={error} />;

  let entries = (data?.entries ?? previousData?.entries ?? []) as EntryType[];

  async function onApplyFilter(_selectedColumns: FilterColumn[]) {
    setSelectedColumns(_selectedColumns);
    await refetch(
      getFilterQueryVariables({
        selectedColumns: _selectedColumns,
        currentData: data,
      })
    );
    setPage(0);
  }

  return (
    <Box
      css={css`
        height: 100%;
        position: relative;
        padding-bottom: 150px;
      `}
      {...props}
    >
      <LoadingOverlay
        visible={loading}
        overlayBlur={1.5}
        css={css`
          position: fixed;
          width: 100%;
          height: 100%;
          * {
            background: none;
          }
        `}
      >
        <Box>
          <Text>Getting more...</Text>
        </Box>
      </LoadingOverlay>
      <div
        css={css`
          z-index: 2;
          position: fixed;
          display: flex;
          align-items: end;
          justify-content: end;
          width: 100%;
          height: 100%;
          padding: 1em;
          pointer-events: none;
          & > * {
            pointer-events: all;
            filter: drop-shadow(0.075em 0.125em 0.1em rgba(0, 0, 0, 0.125));
          }
        `}
      >
        <Group position="right" spacing={7}>
          <AddEntry />
          <TranslateFilterButton
            selectedColumns={selectedColumns}
            onApply={onApplyFilter}
          />
          <Button color="dark" leftIcon={<FaTimesCircle color="#f55b56" />}>
            Remove
          </Button>
          <TextInput
            css={css`
              width: 100%;
            `}
            icon={<TbSearch />}
            placeholder="Search..."
          />
          <Button.Group
            css={css`
              width: 100%;
            `}
          >
            <Button fullWidth color="red" leftIcon={<TbUpload />}>
              Import
            </Button>
            <Button fullWidth color="dark" leftIcon={<TbDownload />}>
              Export
            </Button>
          </Button.Group>
        </Group>
      </div>
      <Table
        highlightOnHover
        css={css`
          thead {
            z-index: 1;
            position: sticky;
            top: 0;
            background-color: ${headerBgColor};
            tr th {
              color: ${headerColor};
            }
            box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);
            color: ${headerColor};
          }
          * {
            border: none;
          }
        `}
      >
        <thead>
          <tr>
            <th>
              <Text>Key</Text>
            </th>
            {platforms.map((platform) => (
              <th key={platform} align="center">
                <Tooltip offset={10} label={platform} color={headerBgColor}>
                  <span
                    css={css`
                      display: flex;
                      justify-content: center;
                      align-items: center;
                    `}
                  >
                    <PlatformIcon platform={platform.toLocaleLowerCase()} />
                  </span>
                </Tooltip>
              </th>
            ))}
            {selectedLocales.map((locale) => {
              locale = formatLocale(locale, "xx-XX");
              return (
                <th key={locale}>
                  <span
                    css={css`
                      display: flex;
                      align-items: center;
                      gap: 0.5rem;
                      color: ${headerColor};
                    `}
                  >
                    <FlagIcon country={locale} />
                    <Text>{languages[locale]}</Text>
                  </span>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {entries?.map((entry) => {
            return (
              <tr key={entry.id}>
                <TD cellWidth={indexWidth}>
                  <Code>{entry.id}</Code>
                </TD>
                {platforms.map((platform) => (
                  <TDPlatform key={platform} cellWidth={platformWidth}>
                    {/* @ts-ignore */}
                    {entry.platforms?.[platform.toLowerCase()] ? (
                      <span
                        css={css`
                          display: flex;
                          justify-content: center;
                        `}
                      >
                        <TbCheck />
                      </span>
                    ) : (
                      ""
                    )}
                  </TDPlatform>
                ))}
                {selectedLocales.map((locale) => (
                  <TDTranslation key={locale} cellWidth={localeWidth}>
                    {/* @ts-ignore */}
                    {entry.translations?.[locale.replace("-", "")]}
                  </TDTranslation>
                ))}
              </tr>
            );
          })}
        </tbody>
      </Table>
      <ScrollTrigger
        onTrigger={async () => {
          const newPage = page + 1;
          await fetchMore({
            ...getFilterQueryVariables({
              selectedColumns,
              currentData: data,
              page: newPage,
            }),
          });
          setPage(newPage);
        }}
      />
    </Box>
  );
}
