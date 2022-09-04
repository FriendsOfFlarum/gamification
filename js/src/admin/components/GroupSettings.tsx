import app from 'flarum/admin/app';
import Component from 'flarum/common/Component';
import Select from 'flarum/common/components/Select';
import withAttr from 'flarum/common/utils/withAttr';
import Stream from 'flarum/common/utils/Stream';
import Group from 'flarum/common/models/Group';
import Button from 'flarum/common/components/Button';

interface SettingsEntry {
  groupId?: number;
  minPoints?: number;
  maxPoints?: number;
}

interface GroupSettingsAttrs {
  value: string;
  onchange: (value: string) => void;
}

export default class GroupSettings extends Component<GroupSettingsAttrs> {
  newGroupId = Stream('');
  newMinPoints = Stream('');
  newMaxPoints = Stream('');

  view() {
    let entries: SettingsEntry[] = [];

    try {
      entries = JSON.parse(this.attrs.value);
    } catch (error) {
      // silence errors. Will reset to empty array below
    }

    if (!Array.isArray(entries)) {
      entries = [];
    }

    let groupOptions: { [id: string]: string } = {};

    app.store.all<Group>('groups').forEach((group) => {
      // Don't allow Member or Guest since those are virtual, and don't allow Admin as it's too dangerous and could strip admins of their roles
      if ([Group.ADMINISTRATOR_ID, Group.MEMBER_ID, Group.GUEST_ID].indexOf(group.id()!) !== -1) {
        return;
      }

      groupOptions[group.id()!] = group.nameSingular();
    });

    const addHandler = () => {
      const newEntry: SettingsEntry = {
        groupId: parseInt(this.newGroupId()),
      };

      if (this.newMinPoints()) {
        newEntry.minPoints = parseInt(this.newMinPoints());
      }

      if (this.newMaxPoints()) {
        newEntry.maxPoints = parseInt(this.newMaxPoints());
      }

      entries.push(newEntry);

      this.attrs.onchange(JSON.stringify(entries));

      this.newGroupId('');
      this.newMinPoints('');
      this.newMaxPoints('');
    };

    return (
      <table>
        <thead>
          <tr>
            <th>Group</th>
            <th>Minimum points (inclusive)</th>
            <th>Maximum points (inclusive)</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, entryIndex) => {
            const valueChangeHandler = (attribute: keyof SettingsEntry) => {
              return (value: string) => {
                if (value === '') {
                  delete entry[attribute];
                } else {
                  entry[attribute] = parseInt(value);
                }

                this.attrs.onchange(JSON.stringify(entries));
              };
            };

            const deleteHandler = () => {
              entries.splice(entryIndex, 1);

              this.attrs.onchange(JSON.stringify(entries));
            };

            return (
              <tr>
                <td>
                  <Select options={groupOptions} value={entry.groupId + ''} onchange={valueChangeHandler('groupId')} />
                </td>
                <td>
                  <input
                    className="FormControl"
                    type="number"
                    value={entry.minPoints || ''}
                    onchange={withAttr('value', valueChangeHandler('minPoints'))}
                  />
                </td>
                <td>
                  <input
                    className="FormControl"
                    type="number"
                    value={entry.maxPoints || ''}
                    onchange={withAttr('value', valueChangeHandler('maxPoints'))}
                  />
                </td>
                <td>
                  <Button className="Button Button--icon" icon="fas fa-times" onclick={deleteHandler}>
                    Delete
                  </Button>
                </td>
              </tr>
            );
          })}
          <tr>
            <td>
              <Select options={groupOptions} value={this.newGroupId()} onchange={this.newGroupId} />
            </td>
            <td>
              <input className="FormControl" type="number" bidi={this.newMinPoints} />
            </td>
            <td>
              <input className="FormControl" type="number" bidi={this.newMaxPoints} />
            </td>
            <td>
              <Button className="Button Button--icon" icon="fas fa-plus" onclick={addHandler} disabled={!this.newGroupId()}>
                Add
              </Button>
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
}
