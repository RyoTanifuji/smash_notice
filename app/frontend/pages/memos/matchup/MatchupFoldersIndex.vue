<template>
  <div class="text-h3 font-weight-bold">
    キャラ対メモ
  </div>

  <div class="my-10" />

  <template v-if="folders.length">
    <v-row>
      <v-col
        cols="12"
        sm="10"
        md="8"
        lg="8"
        xl="8"
      >
        <div class="d-flex">
          <span class="text-h5">
            フォルダ一覧
          </span>
          <v-spacer />
          <v-btn
            color="indigo-accent-4"
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
                :to="{ path: `/matchup/${folderItem.id}/memos` }"
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
      </v-col>
    </v-row>
  </template>

  <template v-else>
    <v-row>
      <v-col
        cols="12"
        sm="10"
        md="8"
        lg="8"
        xl="8"
      >
        <div class="text-body-1 font-weight-bold">
          まだ、フォルダがありません

          <div class="my-8" />

          フォルダの追加から自分の使用ファイターを選択して、フォルダを追加しましょう
        </div>

        <div class="my-8" />

        <v-layout>
          <v-btn
            class="mx-auto"
            color="indigo-accent-4"
            @click="handleOpenFolderCreateDialog"
          >
            フォルダの追加
          </v-btn>
        </v-layout>
      </v-col>
    </v-row>
  </template>

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

<script>
import { mapGetters, mapActions } from 'vuex';
import dayjs from 'dayjs';
import { 
  mdiFolder,
  mdiInformationOutline
} from '@mdi/js';
import {
  serverErrorAlertStatus
} from '../../../plugins/alertStatus';
import FolderFormDialog from '../components/FolderFormDialog';

export default {
  name: "MatchupFoldersIndex",
  components: {
    FolderFormDialog
  },
  data() {
    return {
      folderCreateDialog: false,
      folderEditDialog: false,
      folderDeleteDialog: false,
      folderType: "MatchupFolder",
      folderInitial: {
        id: null,
        name: "",
        fighterId: null
      },
      folder: {},
      mdiFolder,
      mdiInformationOutline
    };
  },
  computed: {
    ...mapGetters("folders", ["folders"]),
    sortedFolders() {
      return this.folders.slice().sort((a, b) => {
        if (a.updatedAt > b.updatedAt) return -1;
        if (a.updatedAt < b.updatedAt) return 1;
        return 0;
      });
    }
  },
  mounted() {
    this.$store.dispatch("folders/fetchFolders", this.folderType);
  },
  methods: {
    ...mapActions("folders", [
      "createFolder",
      "updateFolder",
      "deleteFolder"
    ]),
    ...mapActions("alert", ["displayAlert"]),
    handleOpenFolderCreateDialog() {
      this.folder = Object.assign({}, this.folderInitial);
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
      this.folder = Object.assign({}, this.folderInitial);
      this.folderCreateDialog = false;
      this.folderEditDialog = false;
      this.folderDeleteDialog = false;
    },
    async handleFolderCreate(folder) {
      try {
        await this.createFolder({ folder: folder, folderType: this.folderType });
      } catch (error) {
        this.displayAlert(serverErrorAlertStatus);
      }
      this.handleCloseFolderDialog();
    },
    async handleFolderUpdate(folder) {
      try {
        await this.updateFolder(folder);
      } catch (error) {
        this.displayAlert(serverErrorAlertStatus);
      }
      this.handleCloseFolderDialog();
    },
    async handleFolderDelete() {
      try {
        await this.deleteFolder(this.folder);
      } catch (error) {
        this.displayAlert(serverErrorAlertStatus);
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
  right: 2%
}
</style>