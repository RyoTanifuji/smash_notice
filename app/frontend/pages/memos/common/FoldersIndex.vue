<template>
  <template v-if="isDataReceived">
    <div class="text-md-h3 text-h4 font-weight-bold">
      {{ pageInformation.pageTitle }}
    </div>

    <div class="my-6" />

    <v-row>
      <v-col
        cols="12"
        sm="10"
        md="8"
        lg="8"
        xl="8"
      >
        <template v-if="folders.length">
          <div class="d-flex">
            <span class="text-h6">
              フォルダ一覧
            </span>
            <v-spacer />
            <v-btn
              color="teal-accent-4"
              class="mb-2 mr-2"
              @click="handleOpenFolderCreateDialog"
            >
              フォルダの追加
            </v-btn>
          </div>
          <v-list lines="two">
            <template
              v-for="folderItem in sortedFolders"
              :key="folderItem.id"
            >
              <div class="list-item-folder">
                <v-list-item
                  :title="folderItem.name"
                  :subtitle="dateFormat(folderItem.updatedAt)"
                  :to="{ path: `/${pageInformation.pathPrefix}/${folderItem.id}/memos` }"
                  :prepend-icon="mdiFolder"
                />
                <v-btn
                  icon
                  density="compact"
                  variant="plain"
                  class="list-item-folder-info"
                >
                  <v-icon :icon="mdiInformationOutline" />
                  <v-menu activator="parent">
                    <v-list density="compact">
                      <v-list-item @click="handleOpenFolderEditDialog(folderItem)">
                        <v-list-item-title>
                          <span>
                            フォルダを編集する
                          </span>
                        </v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="handleOpenFolderDeleteDialog(folderItem)">
                        <v-list-item-title>
                          <span class="text-error">
                            フォルダを削除する
                          </span>
                        </v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-btn>
              </div>
            </template>
          </v-list>
        </template>

        <template v-else>
          <div class="text-body-1 font-weight-bold">
            まだ、フォルダがありません。

            <div class="my-8" />

            フォルダの追加から自分の使用ファイターを選択して、フォルダを追加しましょう。
          </div>

          <div class="my-8" />

          <v-layout>
            <v-btn
              class="mx-auto"
              color="teal-accent-4"
              @click="handleOpenFolderCreateDialog"
            >
              フォルダの追加
            </v-btn>
          </v-layout>
        </template>
      </v-col>
    </v-row>

    <div class="justify-center">
      <v-dialog
        v-model="folderCreateDialog"
        width="700px"
      >
        <FolderFormDialog
          :folder="folder"
          @close-dialog="handleCloseFolderDialog"
          @folder-submit="handleFolderCreate"
        >
          <template #title>
            フォルダの追加
          </template>
          <template #submit>
            作成
          </template>
        </FolderFormDialog>
      </v-dialog>
    </div>

    <div class="justify-center">
      <v-dialog
        v-model="folderEditDialog"
        width="700px"
      >
        <FolderFormDialog
          :folder="folder"
          @close-dialog="handleCloseFolderDialog"
          @folder-submit="handleFolderUpdate"
        >
          <template #title>
            フォルダの編集
          </template>
          <template #submit>
            更新
          </template>
        </FolderFormDialog>
      </v-dialog>
    </div>
    
    <div class="justify-center">
      <v-dialog
        v-model="folderDeleteDialog"
        width="500px"
      >
        <v-card>
          <v-card-title class="ma-2">
            <span class="text-h5 font-weight-bold">フォルダの削除</span>
          </v-card-title>
          <v-card-text>
            「{{ folder.name }}」フォルダを削除してもよろしいですか？
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn @click="handleCloseFolderDialog">
              キャンセル
            </v-btn>
            <v-btn
              class="mr-4"
              color="error"
              @click="handleFolderDelete"
            >
              削除
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </template>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { mdiFolder, mdiInformationOutline } from '@mdi/js';
import { serverErrorAlertStatus } from '../../../constants/alertStatus';
import FolderFormDialog from '../components/FolderFormDialog';
import dayjs from 'dayjs';

export default {
  name: "FoldersIndex",
  components: {
    FolderFormDialog
  },
  beforeRouteUpdate(){
    this.isDataReceived = false;
    next();
  },
  data() {
    return {
      pageInformationMatchup: {
        pageTitle: "キャラ対メモ",
        pathPrefix: "matchup",
        folderType: "MatchupFolder"
      },
      pageInformationStrategy: {
        pageTitle: "自キャラメモ",
        pathPrefix: "strategy",
        folderType: "StrategyFolder"
      },
      folderCreateDialog: false,
      folderEditDialog: false,
      folderDeleteDialog: false,
      folderDefault: {
        id: null,
        name: "",
        fighterId: null
      },
      folder: {},
      isDataReceived: false,
      mdiFolder,
      mdiInformationOutline
    };
  },
  computed: {
    ...mapGetters("folders", ["folders"]),
    isMatchup() {
      return this.$route.name == "MatchupFoldersIndex";
    },
    pageInformation() {
      return this.isMatchup ? this.pageInformationMatchup : this.pageInformationStrategy;
    },
    sortedFolders() {
      return this.folders.slice().sort((a, b) => {
        if (a.updatedAt > b.updatedAt) return -1;
        if (a.updatedAt < b.updatedAt) return 1;
        return 0;
      });
    }
  },
  mounted() {
    this.fetchFolders(this.pageInformation.folderType)
      .then(() => {
          this.isDataReceived = true;
      });
  },
  updated() {
    this.fetchFolders(this.pageInformation.folderType)
      .then(() => {
          this.isDataReceived = true;
      });
  },
  methods: {
    ...mapActions("folders", [
      "fetchFolders",
      "createFolder",
      "updateFolder",
      "deleteFolder"
    ]),
    ...mapActions("alert", [
      "displayAlert",
      "closeAlertWithCross"
    ]),
    handleOpenFolderCreateDialog() {
      this.folder = Object.assign({}, this.folderDefault);
      this.folderCreateDialog = true;
    },
    handleOpenFolderEditDialog(folder) {
      this.folder = Object.assign({}, folder);
      this.folderEditDialog = true;
    },
    handleOpenFolderDeleteDialog(folder) {
      this.folder = folder;
      this.folderDeleteDialog = true;
    },
    handleCloseFolderDialog() {
      this.closeAlertWithCross();
      this.folder = Object.assign({}, this.folderDefault);
      this.folderCreateDialog = false;
      this.folderEditDialog = false;
      this.folderDeleteDialog = false;
    },
    async handleFolderCreate(folder) {
      try {
        await this.createFolder({
          folder: folder,
          folderType: this.pageInformation.folderType
        });
        this.handleCloseFolderDialog();
      } catch (error) {
        this.displayAlert({ alertStatus: serverErrorAlertStatus, isDialog: true });
      }
    },
    async handleFolderUpdate(folder) {
      try {
        await this.updateFolder(folder);
        this.handleCloseFolderDialog();
      } catch (error) {
        this.displayAlert({ alertStatus: serverErrorAlertStatus, isDialog: true });
      }
    },
    async handleFolderDelete() {
      try {
        await this.deleteFolder(this.folder);
      } catch (error) {
        this.displayAlert({ alertStatus: serverErrorAlertStatus });
      }
      this.handleCloseFolderDialog();
    },
    dateFormat(date) {
      return dayjs(date).format("YYYY-MM-DD");
    }
  }
};
</script>

<style scoped>
.list-item-folder {
  position: relative;
}

.list-item-folder-info {
  position: absolute;
  top: 25%;
  right: 2%;
}
</style>