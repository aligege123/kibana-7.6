/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React, { Component } from 'react';
import {
  EuiBadge,
  EuiButton,
  EuiButtonIcon,
  EuiCallOut,
  EuiFlexGroup,
  EuiFlexItem,
  EuiInMemoryTable,
  EuiPageContent,
  EuiPageContentBody,
  EuiPageContentHeader,
  EuiPageContentHeaderSection,
  EuiSpacer,
  EuiText,
  EuiTitle,
  EuiToolTip,
  EuiInMemoryTableProps,
} from '@elastic/eui';
import { i18n } from '@kbn/i18n';
import { FormattedMessage } from '@kbn/i18n/react';
import moment from 'moment-timezone';
import _ from 'lodash';
import { toastNotifications } from 'ui/notify';
// eslint-disable-next-line @kbn/eslint/no-restricted-paths
import { SectionLoading } from '../../../../../../../../../src/plugins/es_ui_shared/public/components/section_loading';
import { ApiKey, ApiKeyToInvalidate } from '../../../../../common/model';
import { ApiKeysApi } from '../../../../lib/api_keys_api';
import { PermissionDenied } from './permission_denied';
import { EmptyPrompt } from './empty_prompt';
import { NotEnabled } from './not_enabled';
import { InvalidateProvider } from './invalidate_provider';

interface State {
  isLoadingApp: boolean;
  isLoadingTable: boolean;
  isAdmin: boolean;
  areApiKeysEnabled: boolean;
  apiKeys: ApiKey[];
  selectedItems: ApiKey[];
  permissionDenied: boolean;
  error: any;
}

const DATE_FORMAT = 'MMMM Do YYYY HH:mm:ss';

export class ApiKeysGridPage extends Component<any, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      isLoadingApp: true,
      isLoadingTable: false,
      isAdmin: false,
      areApiKeysEnabled: false,
      apiKeys: [],
      permissionDenied: false,
      selectedItems: [],
      error: undefined,
    };
  }

  public componentDidMount() {
    this.checkPrivileges();
  }

  public render() {
    const {
      permissionDenied,
      isLoadingApp,
      isLoadingTable,
      areApiKeysEnabled,
      isAdmin,
      error,
      apiKeys,
    } = this.state;

    if (permissionDenied) {
      return <PermissionDenied />;
    }

    if (isLoadingApp) {
      return (
        <EuiPageContent>
          <SectionLoading data-test-subj="apiKeysSectionLoading">
            <FormattedMessage
              id="xpack.security.management.apiKeys.table.loadingApiKeysDescription"
              defaultMessage="Loading API keys???"
            />
          </SectionLoading>
        </EuiPageContent>
      );
    }

    if (error) {
      const {
        body: { error: errorTitle, message, statusCode },
      } = error;

      return (
        <EuiPageContent>
          <EuiCallOut
            title={
              <FormattedMessage
                id="xpack.security.management.apiKeys.table.loadingApiKeysErrorTitle"
                defaultMessage="Error loading API keys"
              />
            }
            color="danger"
            iconType="alert"
            data-test-subj="apiKeysError"
          >
            {statusCode}: {errorTitle} - {message}
          </EuiCallOut>
        </EuiPageContent>
      );
    }

    if (!areApiKeysEnabled) {
      return (
        <EuiPageContent>
          <NotEnabled />
        </EuiPageContent>
      );
    }

    if (!isLoadingTable && apiKeys && apiKeys.length === 0) {
      return (
        <EuiPageContent>
          <EmptyPrompt isAdmin={isAdmin} />
        </EuiPageContent>
      );
    }

    const description = (
      <EuiText color="subdued" size="s" data-test-subj="apiKeysDescriptionText">
        <p>
          {isAdmin ? (
            <FormattedMessage
              id="xpack.security.management.apiKeys.table.apiKeysAllDescription"
              defaultMessage="View and invalidate API keys. An API key sends requests on behalf of a user."
            />
          ) : (
            <FormattedMessage
              id="xpack.security.management.apiKeys.table.apiKeysOwnDescription"
              defaultMessage="View and invalidate your API keys. An API key sends requests on your behalf."
            />
          )}
        </p>
      </EuiText>
    );

    return (
      <EuiPageContent>
        <EuiPageContentHeader>
          <EuiPageContentHeaderSection>
            <EuiTitle>
              <h2>
                <FormattedMessage
                  id="xpack.security.management.apiKeys.table.apiKeysTitle"
                  defaultMessage="API Keys"
                />
              </h2>
            </EuiTitle>
            {description}
          </EuiPageContentHeaderSection>
        </EuiPageContentHeader>

        <EuiPageContentBody>{this.renderTable()}</EuiPageContentBody>
      </EuiPageContent>
    );
  }

  private renderTable = () => {
    const { apiKeys, selectedItems, isLoadingTable, isAdmin } = this.state;

    const message = isLoadingTable ? (
      <FormattedMessage
        id="xpack.security.management.apiKeys.table.apiKeysTableLoadingMessage"
        defaultMessage="Loading API keys???"
      />
    ) : (
      undefined
    );

    const sorting = {
      sort: {
        field: 'expiration',
        direction: 'asc',
      },
    } as const;

    const pagination = {
      initialPageSize: 20,
      pageSizeOptions: [10, 20, 50],
    };

    const selection = {
      onSelectionChange: (newSelectedItems: ApiKey[]) => {
        this.setState({
          selectedItems: newSelectedItems,
        });
      },
    };

    const search: EuiInMemoryTableProps<ApiKey>['search'] = {
      toolsLeft: selectedItems.length ? (
        <InvalidateProvider isAdmin={isAdmin}>
          {invalidateApiKeyPrompt => {
            return (
              <EuiButton
                onClick={() =>
                  invalidateApiKeyPrompt(
                    selectedItems.map(({ name, id }) => ({ name, id })),
                    this.onApiKeysInvalidated
                  )
                }
                color="danger"
                data-test-subj="bulkInvalidateActionButton"
              >
                <FormattedMessage
                  id="xpack.security.management.apiKeys.table.invalidateApiKeyButton"
                  defaultMessage="Invalidate {count, plural, one {API key} other {API keys}}"
                  values={{
                    count: selectedItems.length,
                  }}
                />
              </EuiButton>
            );
          }}
        </InvalidateProvider>
      ) : (
        undefined
      ),
      toolsRight: (
        <EuiButton
          color="secondary"
          iconType="refresh"
          onClick={() => this.reloadApiKeys()}
          data-test-subj="reloadButton"
        >
          <FormattedMessage
            id="xpack.security.management.apiKeys.table.reloadApiKeysButton"
            defaultMessage="Reload"
          />
        </EuiButton>
      ),
      box: {
        incremental: true,
      },
      filters: isAdmin
        ? [
            {
              type: 'field_value_selection',
              field: 'username',
              name: i18n.translate('xpack.security.management.apiKeys.table.userFilterLabel', {
                defaultMessage: 'User',
              }),
              multiSelect: false,
              options: Object.keys(
                apiKeys.reduce((apiKeysMap: any, apiKey) => {
                  apiKeysMap[apiKey.username] = true;
                  return apiKeysMap;
                }, {})
              ).map(username => {
                return {
                  value: username,
                  view: username,
                };
              }),
            },
            {
              type: 'field_value_selection',
              field: 'realm',
              name: i18n.translate('xpack.security.management.apiKeys.table.realmFilterLabel', {
                defaultMessage: 'Realm',
              }),
              multiSelect: false,
              options: Object.keys(
                apiKeys.reduce((apiKeysMap: any, apiKey) => {
                  apiKeysMap[apiKey.realm] = true;
                  return apiKeysMap;
                }, {})
              ).map(realm => {
                return {
                  value: realm,
                  view: realm,
                };
              }),
            },
          ]
        : undefined,
    };

    return (
      <>
        {isAdmin ? (
          <>
            <EuiCallOut
              title={
                <FormattedMessage
                  id="xpack.security.management.apiKeys.table.adminText"
                  defaultMessage="You are an API Key administrator."
                />
              }
              color="success"
              iconType="user"
              size="s"
              data-test-subj="apiKeyAdminDescriptionCallOut"
            />

            <EuiSpacer size="m" />
          </>
        ) : (
          undefined
        )}

        {
          <EuiInMemoryTable
            items={apiKeys}
            itemId="id"
            columns={this.getColumnConfig()}
            search={search}
            sorting={sorting}
            selection={selection}
            pagination={pagination}
            loading={isLoadingTable}
            message={message}
            isSelectable={true}
            rowProps={() => {
              return {
                'data-test-subj': 'apiKeyRow',
              };
            }}
          />
        }
      </>
    );
  };

  private getColumnConfig = () => {
    const { isAdmin } = this.state;

    let config = [
      {
        field: 'name',
        name: i18n.translate('xpack.security.management.apiKeys.table.nameColumnName', {
          defaultMessage: 'Name',
        }),
        sortable: true,
      },
    ];

    if (isAdmin) {
      config = config.concat([
        {
          field: 'username',
          name: i18n.translate('xpack.security.management.apiKeys.table.userNameColumnName', {
            defaultMessage: 'User',
          }),
          sortable: true,
        },
        {
          field: 'realm',
          name: i18n.translate('xpack.security.management.apiKeys.table.realmColumnName', {
            defaultMessage: 'Realm',
          }),
          sortable: true,
        },
      ]);
    }

    config = config.concat([
      {
        field: 'creation',
        name: i18n.translate('xpack.security.management.apiKeys.table.creationDateColumnName', {
          defaultMessage: 'Created',
        }),
        sortable: true,
        // @ts-ignore
        render: (creationDateMs: number) => moment(creationDateMs).format(DATE_FORMAT),
      },
      {
        field: 'expiration',
        name: i18n.translate('xpack.security.management.apiKeys.table.expirationDateColumnName', {
          defaultMessage: 'Expires',
        }),
        sortable: true,
        // @ts-ignore
        render: (expirationDateMs: number) => {
          if (expirationDateMs === undefined) {
            return (
              <EuiText color="subdued">
                {i18n.translate(
                  'xpack.security.management.apiKeys.table.expirationDateNeverMessage',
                  {
                    defaultMessage: 'Never',
                  }
                )}
              </EuiText>
            );
          }

          return moment(expirationDateMs).format(DATE_FORMAT);
        },
      },
      {
        name: i18n.translate('xpack.security.management.apiKeys.table.statusColumnName', {
          defaultMessage: 'Status',
        }),
        render: ({ expiration }: any) => {
          const now = Date.now();

          if (now > expiration) {
            return <EuiBadge color="hollow">Expired</EuiBadge>;
          }

          return <EuiBadge color="secondary">Active</EuiBadge>;
        },
      },
      {
        name: i18n.translate('xpack.security.management.apiKeys.table.actionsColumnName', {
          defaultMessage: 'Actions',
        }),
        actions: [
          {
            render: ({ name, id }: any) => {
              return (
                <EuiFlexGroup gutterSize="s">
                  <EuiFlexItem>
                    <InvalidateProvider isAdmin={isAdmin}>
                      {invalidateApiKeyPrompt => {
                        return (
                          <EuiToolTip
                            content={i18n.translate(
                              'xpack.security.management.apiKeys.table.actionDeleteTooltip',
                              { defaultMessage: 'Invalidate' }
                            )}
                          >
                            <EuiButtonIcon
                              aria-label={i18n.translate(
                                'xpack.security.management.apiKeys.table.actionDeleteAriaLabel',
                                {
                                  defaultMessage: `Invalidate '{name}'`,
                                  values: { name },
                                }
                              )}
                              iconType="minusInCircle"
                              color="danger"
                              data-test-subj="invalidateApiKeyButton"
                              onClick={() =>
                                invalidateApiKeyPrompt([{ id, name }], this.onApiKeysInvalidated)
                              }
                            />
                          </EuiToolTip>
                        );
                      }}
                    </InvalidateProvider>
                  </EuiFlexItem>
                </EuiFlexGroup>
              );
            },
          },
        ],
      },
    ]);

    return config;
  };

  private onApiKeysInvalidated = (apiKeysInvalidated: ApiKeyToInvalidate[]): void => {
    if (apiKeysInvalidated.length) {
      this.reloadApiKeys();
    }
  };

  private async checkPrivileges() {
    try {
      const { isAdmin, areApiKeysEnabled } = await ApiKeysApi.checkPrivileges();
      this.setState({ isAdmin, areApiKeysEnabled });

      if (areApiKeysEnabled) {
        this.initiallyLoadApiKeys();
      } else {
        // We're done loading and will just show the "Disabled" error.
        this.setState({ isLoadingApp: false });
      }
    } catch (e) {
      if (_.get(e, 'body.statusCode') === 403) {
        this.setState({ permissionDenied: true, isLoadingApp: false });
      } else {
        toastNotifications.addDanger(
          this.props.i18n.translate(
            'xpack.security.management.apiKeys.table.fetchingApiKeysErrorMessage',
            {
              defaultMessage: 'Error checking privileges: {message}',
              values: { message: _.get(e, 'body.message', '') },
            }
          )
        );
      }
    }
  }

  private initiallyLoadApiKeys = () => {
    this.setState({ isLoadingApp: true, isLoadingTable: false });
    this.loadApiKeys();
  };

  private reloadApiKeys = () => {
    this.setState({ apiKeys: [], isLoadingApp: false, isLoadingTable: true });
    this.loadApiKeys();
  };

  private loadApiKeys = async () => {
    try {
      const { isAdmin } = this.state;
      const { apiKeys } = await ApiKeysApi.getApiKeys(isAdmin);
      this.setState({ apiKeys });
    } catch (e) {
      this.setState({ error: e });
    }

    this.setState({ isLoadingApp: false, isLoadingTable: false });
  };
}
